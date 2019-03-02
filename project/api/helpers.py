from datetime import datetime, timedelta

from project import db
from project.models import Split, Stage
from project.filters import timefilter


def add_positions(ranking):
    """Determines player positions. Assumes input list of players is sorted"""
    prev = None

    for pos, player in enumerate(ranking, start=1):
        # First is always first
        if pos is 1 and (player['time'] or player['disqualified']):
            player['position'] = pos

        # Same position for players with same time
        elif player['time'] and player['time'] == prev['time']:
            player['position'] = prev['position']

        # Same position for all disqualified
        elif prev and player['disqualified'] and prev['disqualified']:
            player['position'] = prev['position']

        elif prev and 'stage_disqualified' in player and (player['disqualified'] or player['stage_disqualified']) and (prev['disqualified'] or prev['stage_disqualified']):
            player['position'] = prev['position']

        else:
            player['position'] = pos

        prev = player

    return ranking


def add_stage_positions(ranking):
    prev = None

    for pos, player in enumerate(ranking, start=1):
        if pos is 1:
            player['position'] = pos

        elif player['points'] == prev['points']:
            player['position'] = prev['position']

        else:
            player['position'] = pos

        prev = player

    return ranking


def add_pos_diffs(prev, curr):
    """Determines position differences betwen current and previous split progresses"""
    prev_pos = {player['id']: player['position'] for player in prev}

    for player in curr:
        id = player['id']
        player['position_diff'] = prev_pos[id] - player['position']

    return curr


def add_time_diffs(ranking):
    """Determines time differences"""
    prev = None

    for pos, player in enumerate(ranking, start=1):
        player['time_diff'] = None
        player['prev_time_diff'] = None

        if player['time']:
            if pos is not 1:
                player['time_diff'] = player['time'] - ranking[0]['time']

                if pos is not 2:
                    player['prev_time_diff'] = player['time'] - prev['time']

        prev = player

    return ranking


def format_times_diffs(ranking):
    """Formats times and time differences"""
    for player in ranking:
        player['time'] = timefilter(player['time'])
        player['time_diff'] = timefilter(player['time_diff'], diff=True)
        player['prev_time_diff'] = timefilter(player['prev_time_diff'], diff=True)

    return ranking


def group_players(players):
    """
    Divides players into groups: `finished`, `disqualified` and, optionally, `not_finished`.

    args:
        players: dict of players, with their ID as the key, containing (among others)
            `disqualified` (bool) property

    returns:
        grouped: dict of lists (groups) of players
    """
    grouped = {'finished': [], 'disqualified': [], 'not_finished': []}

    for player in players:
        if player['disqualified']:
            grouped['disqualified'].append(player)
        elif player['time']:
            grouped['finished'].append(player)
        else:
            grouped['not_finished'].append(player)

    return grouped


def group_players_ranking(players):
    """
    Divides players into groups: `finished`, `disqualified` and, optionally, `not_finished`.

    args:
        players: dict of players, with their ID as the key, containing (among others)
            `disqualified` (bool) property

    returns:
        grouped: dict of lists (groups) of players
    """
    grouped = {'finished': [], 'disqualified': [], 'not_finished': [], 'stage_disqualified': []}

    for player in players:
        if player['time']:
            grouped['finished'].append(player)
        elif player['disqualified']:
            grouped['disqualified'].append(player)
        elif player['stage_disqualified']:
            grouped['stage_disqualified'].append(player)
        else:
            grouped['not_finished'].append(player)

    return grouped


def normalize(keys, players):
    return [dict(zip(keys, player)) for player in players]


def strToTimedelta(datestring):
    """Converts JavaScript datetime string to Python timedelta"""
    dt = datetime.strptime(datestring, '%Y-%m-%dT%H:%M:%S.%fZ')
    td = timedelta(
        hours=dt.hour,
        minutes=dt.minute,
        seconds=dt.second,
        microseconds=dt.microsecond
    )

    return td


def add_points(players):
    # temp point system which works only works for 4 or less players
    points = [5, 3, 1, 0]

    result = {}
    for player in players:
        result[player['id']] = 0 if player['disqualified'] else points[player['position'] - 1]

    return result


def get_next_split(curr_split):
    if curr_split.last_in_stage:
        next_stage = db.session.query(Stage.id)\
            .filter(Stage.event_id == curr_split.stage.event_id)\
            .filter(Stage.order == curr_split.stage.order + 1)\
            .first()

        next_split = Split.query\
            .filter(Split.stage_id == next_stage.id)\
            .filter(Split.order == 1)\
            .first()

    else:
        next_split = Split.query\
            .filter(Split.stage_id == curr_split.stage_id)\
            .filter(Split.order == curr_split.order + 1)\
            .first()

    return next_split


def get_prev_split(curr_split):
    # Curr split first in stage, grab last from prev stage
    if curr_split.order == 1:
        prev_stage = db.session.query(Stage.id)\
            .filter(Stage.event_id == curr_split.stage.event_id)\
            .filter(Stage.order == curr_split.stage.order - 1)\
            .first()

        prev_split = Split.query\
            .filter(Split.stage_id == prev_stage.id)\
            .order_by(Split.order.desc())\
            .first()

    else:
        prev_split = Split.query\
            .filter(Split.stage_id == curr_split.stage_id)\
            .filter(Split.order == curr_split.order - 1)\
            .first()

    return prev_split
