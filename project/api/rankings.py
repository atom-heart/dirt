from project.models import Split, Stage, Event
from project.api.helpers import group_players_ranking, add_positions, add_pos_diffs, add_time_diffs, format_times_diffs, group_players, add_stage_positions, normalize

def get_split_ranking(id):
    _split = Split.query.get(id)
    keys = ('id', 'name', 'time', 'disqualified', 'stage_disqualified')

    ranking = normalize(keys, _split.get_ranking())
    ranking = add_positions(ranking)
    ranking = add_time_diffs(ranking)
    ranking = format_times_diffs(ranking)
    ranking = group_players_ranking(ranking)

    return ranking


def get_split_progress(id):
    _curr = Split.query.get(id)
    keys = ('id', 'name', 'time', 'disqualified')

    _prev = _curr if _curr.order == 1 else _curr.get_previous()

    curr = normalize(keys, _curr.get_progress())
    prev = normalize(keys, _prev.get_progress())

    curr = add_positions(curr)
    prev = add_positions(prev)

    curr = add_pos_diffs(prev, curr)

    curr = add_time_diffs(curr)
    curr = format_times_diffs(curr)
    curr = group_players(curr)

    return curr


def get_stage_ranking(id):
    _stage = Stage.query.get(id)
    keys = ('id', 'name', 'time', 'points', 'disqualified')

    ranking = normalize(keys, _stage.get_ranking())

    ranking = add_positions(ranking)
    ranking = add_time_diffs(ranking)
    ranking = format_times_diffs(ranking)
    ranking = group_players(ranking)

    return ranking


def get_stage_progress(id):
    _curr = Stage.query.get(id)
    keys = ('id', 'name', 'points')

    _prev = _curr if _curr.order == 1 else _curr.get_previous()

    curr = normalize(keys, _curr.get_progress())
    prev = normalize(keys, _prev.get_progress())

    curr = add_stage_positions(curr)
    prev = add_stage_positions(prev)

    curr = add_pos_diffs(prev, curr)

    return curr


def get_event_ranking(id):
    _event = Event.query.get(id)
    keys = ('id', 'name', 'points', 'car')

    event = normalize(keys, _event.get_ranking())
    event = add_stage_positions(event)

    return event
