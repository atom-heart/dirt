import json

from datetime import timedelta as td

from project.api.helpers import add_positions, add_pos_diffs, add_time_diffs, format_times_diffs, group_players

def test_add_positions():
    ranking = [{'time': None, 'disqualified': False}]
    ranking = add_positions(ranking)
    assert 'position' not in ranking[0]

    ranking = [{'time': None, 'disqualified': True}]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1

    ranking = [{'time': td(minutes=5), 'disqualified': False}]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1

    ranking = [
        {'time': td(minutes=5), 'disqualified': False},
        {'time': td(minutes=6), 'disqualified': False}
    ]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1
    assert ranking[1]['position'] == 2

    ranking = [
        {'time': td(minutes=5), 'disqualified': False},
        {'time': None, 'disqualified': True}
    ]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1
    assert ranking[1]['position'] == 2

    ranking = [
        {'time': td(minutes=5), 'disqualified': False},
        {'time': None, 'disqualified': False}
    ]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1
    assert 'position' not in ranking[1]

    ranking = [
        {'time': None, 'disqualified': True},
        {'time': None, 'disqualified': False}
    ]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == 1
    assert 'position' not in ranking[1]

    ranking = [
        {'time': td(minutes=5), 'disqualified': False},
        {'time': td(minutes=5), 'disqualified': False}
    ]
    ranking = add_positions(ranking)
    assert ranking[0]['position'] == ranking[1]['position'] == 1

    ranking = [
        {'time': None, 'disqualified': False},
        {'time': None, 'disqualified': False}
    ]
    ranking = add_positions(ranking)
    assert 'position' not in ranking[0]
    assert 'position' not in ranking[1]


def test_add_pos_diffs():
    # Same positions in both splits
    curr = [{'id': 1, 'position': 1}, {'id': 2, 'position': 2}]
    ranking = add_pos_diffs(curr, curr)
    assert ranking[0]['position_diff'] == 0
    assert ranking[1]['position_diff'] == 0

    # Different positions
    prev = [{'id': 2, 'position': 1}, {'id': 4, 'position': 2}, {'id': 1, 'position': 3}]
    curr = [{'id': 1, 'position': 1}, {'id': 2, 'position': 2}, {'id': 4, 'position': 3}]
    ranking = add_pos_diffs(prev, curr)
    assert ranking[0]['position_diff'] == 2
    assert ranking[1]['position_diff'] == -1
    assert ranking[2]['position_diff'] == -1


def test_add_time_diffs():
    ranking = [{'time': td(minutes=1)}, {'time': td(minutes=1)}]
    ranking = add_time_diffs(ranking)
    assert ranking[0]['time_diff'] == None
    assert ranking[1]['time_diff'] == td()

    ranking = [{'time': td(minutes=1)}, {'time': td(minutes=2)}]
    ranking = add_time_diffs(ranking)
    assert ranking[0]['time_diff'] == None
    assert ranking[1]['time_diff'] == td(minutes=1)

    ranking = [{'time': td(minutes=1)}, {'time': None}]
    ranking = add_time_diffs(ranking)
    assert ranking[0]['time_diff'] == None
    assert ranking[1]['time_diff'] == None

    ranking = [{'time': None}, {'time': None}]
    ranking = add_time_diffs(ranking)
    assert ranking[0]['time_diff'] == None
    assert ranking[1]['time_diff'] == None


def test_format_times_diffs():
    ranking = [
        {'time': td(minutes=5, seconds=21, milliseconds=300), 'time_diff': None},
        {'time': td(minutes=6, milliseconds=291), 'time_diff': td(seconds=39, milliseconds=9)}
    ]
    ranking = format_times_diffs(ranking)
    assert ranking[0]['time'] == '05:21.300'
    assert ranking[1]['time'] == '06:00.291'
    assert ranking[1]['time_diff'] == '00:39.009'


def test_group_players():
    ranking = [
        {'id': 1, 'time': td(minutes=1), 'disqualified': False},
        {'id': 2, 'time': None, 'disqualified': True},
        {'id': 3, 'time': None, 'disqualified': False}
    ]
    ranking = group_players(ranking)
    assert ranking['finished'][0]['id'] == 1
    assert ranking['disqualified'][0]['id'] == 2
    assert ranking['not_finished'][0]['id'] == 3
