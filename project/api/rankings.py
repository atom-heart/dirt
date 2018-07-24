from project.models import Split, Stage
from project.api.helpers import get_split_prog, add_positions, add_pos_diffs, add_time_diffs, format_times_diffs, group_players

def get_split_ranking(id):
    # Get player times for given split
    _ranking = Split.query.get(id).get_ranking()

    # Parse to a dict
    ranking = []
    keys = ('id', 'name', 'time', 'disqualified')
    for player in _ranking:
        ranking.append(dict(zip(keys, player)))

    # Parse even more
    ranking = add_positions(ranking)
    ranking = add_time_diffs(ranking)
    ranking = format_times_diffs(ranking)
    ranking = group_players(ranking)

    return ranking


def get_split_progress(id):
    # Get current and previous splits
    _curr = Split.query.get(id)
    _prev = _curr.get_previous()

    # No previous split means current one is first in stage
    if not _prev:
        return get_split_ranking(id)

    # Get progress of current and previous split
    curr = get_split_prog(_curr)
    prev = get_split_prog(_prev)

    # Determine player positions for both splits in order to calculate position diffs
    curr = add_positions(curr)
    prev = add_positions(prev)

    # Determine position diffs, time diffs, format times and group players
    curr = add_pos_diffs(curr, prev)
    curr = add_time_diffs(curr)
    curr = format_times_diffs(curr)
    curr = group_players(curr)

    return curr


def get_stage_ranking(id):
    _ranking = Stage.query.get(id).get_ranking()

    ranking = []
    keys = ('id', 'name', 'time', 'points', 'disqualified')
    for player in _ranking:
        ranking.append(dict(zip(keys, player)))

    ranking = add_positions(ranking)
    ranking = add_time_diffs(ranking)
    ranking = format_times_diffs(ranking)
    ranking = group_players(ranking)

    return ranking


def get_stage_progress(id):
    pass
