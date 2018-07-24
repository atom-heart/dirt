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
        elif player['disqualified'] and prev['disqualified']:
            player['position'] = prev['position']

        # Base case
        elif player['time'] or player['disqualified']:
            player['position'] = pos

        else:
            break

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

    for player in ranking:
        if player['time'] and prev and prev['time']:
            player['time_diff'] = player['time'] - prev['time']
        else:
            player['time_diff'] = None
        prev = player

    return ranking


def format_times_diffs(ranking):
    """Formats times and time differences"""
    for player in ranking:
        player['time'] = timefilter(player['time'])
        player['time_diff'] = timefilter(player['time_diff'])

    return ranking


def group_players(players):
    """
    Divides players into groups: `finished`, `disqualified` and, optionally, `not_finished`.

    args:
        players: dict of players, with their ID as the key, containing (among others)
            `disqualified` (bool) property

    returns:
        ranking: dict of lists (groups) of players
    """
    grouped = {'finished': [], 'disqualified': [], 'not_finished': []}

    for player in players:
        # Save `disqualified` property to temporary variable, and delete from player dict
        disq = player['disqualified']
        del player['disqualified']

        # Assign to suitable groups
        if player['time']:
            grouped['finished'].append(player)
        elif disq:
            grouped['disqualified'].append(player)
        else:
            grouped['not_finished'].append(player)

    return grouped


def get_split_prog(split):
    ranking = []
    keys = ('id', 'name', 'time', 'disqualified')

    for player in split.get_progress():
        ranking.append(dict(zip(keys, player)))

    return ranking
