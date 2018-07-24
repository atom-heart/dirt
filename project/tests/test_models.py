from project.models import Split

from datetime import timedelta as td


def test_split_ranking(app, db, game1, event1, stage1):
    split = Split.query.get(1)
    times = split.times

    # No player finished
    ranking = split.get_ranking()
    assert ranking[0][0] == 3
    assert ranking[1][0] == 2
    assert ranking[2][0] == 1

    # One finished, one disqualified, one didn't finish
    times[1].time = td(seconds=1)
    times[2].disqualified = True
    db.session.add_all(times)
    db.session.commit()

    ranking = split.get_ranking()
    assert ranking[0][0] == 2
    assert ranking[1][0] == 3
    assert ranking[2][0] == 1

    # All disqualified
    times[1].time = None
    times[0].disqualified = True
    times[1].disqualified = True
    times[2].disqualified = True
    db.session.add_all(times)
    db.session.commit()

    ranking = split.get_ranking()
    assert ranking[0][0] == 3
    assert ranking[1][0] == 2
    assert ranking[2][0] == 1

    # All finished with same times
    times[0].time = td(seconds=1)
    times[1].time = td(seconds=1)
    times[2].time = td(seconds=1)
    times[0].disqualified = False
    times[1].disqualified = False
    times[2].disqualified = False
    db.session.add_all(times)
    db.session.commit()

    ranking = split.get_ranking()
    assert ranking[0][0] == 3
    assert ranking[1][0] == 2
    assert ranking[2][0] == 1


def test_split_progress(app, db, game1, event1, stage1):
    split1 = Split.query.get(1)
    times1 = split1.times
    split2 = Split.query.get(2)
    times2 = split2.times
    ranking = split1.stage.stage_ranking.all()

    # Ranking and progress of first split have to be the same
    assert split1.get_ranking() == split1.get_progress()

    # One player won, two have same time
    times1[0].time = td(seconds=10)
    times1[1].time = td(seconds=11)
    times1[2].time = td(seconds=12)

    times2[0].time = td(seconds=5) # 15s in total
    times2[1].time = td(seconds=1) # 12s in total
    times2[2].time = td(seconds=3) # 15s in total

    db.session.add_all(times1)
    db.session.add_all(times2)

    progress = split2.get_progress()
    assert progress[0][0] == 2
    assert progress[1][0] == 3
    assert progress[2][0] == 1

    # One player disualified, on last place even despite best time
    ranking[2].disqualified = True
    times1[2].time = td() # 3s in total
    db.session.add(ranking[2])
    db.session.add(times1[2])
    db.session.commit()

    progress = split2.get_progress()
    assert progress[0][0] == 2
    assert progress[1][0] == 1
    assert progress[2][0] == 3

    # Two players disqualified, ordered by EventPlayer.order, not time
    ranking[1].disqualified = True
    times1[1].time = td() # 1s in total
    db.session.add(ranking[1])
    db.session.add(times1[1])
    db.session.commit()

    progress = split2.get_progress()
    assert progress[0][0] == 1
    assert progress[1][0] == 3
    assert progress[2][0] == 2
