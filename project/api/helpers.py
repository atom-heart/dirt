from project.filters import timefilter


def add_positions(players):
    """Determines player positions. Assumes input list of players is sorted"""
    ranking = {}
    prev = None

    for pos, (id, player) in enumerate(players.items(), start=1):
        # First is always first
        if pos is 1:
            player['position'] = pos

        # Same position for players with same time
        elif player['time'] and player['time'] == prev['time']:
            player['position'] = prev['position']

        # Same position for all disqualified
        elif player['disqualified'] and prev['disqualified']:
            player['position'] = prev['position']

        else:
            player['position'] = pos

        # Add player to ranking and save as previous
        ranking[id] = prev = player

    return ranking


def add_pos_diffs(curr, prev):
    """Determines position differences betwen current and previous split progresses"""
    result = {}

    for id, player in curr.items():
        player['position_diff'] = prev[id]['position'] - curr[id]['position']
        result[id] = player

    return result


def add_time_diffs(players):
    """Determines time differences"""
    result = {}
    prev = None

    for pos, (id, player) in enumerate(players.items(), start=1):
        if player['time'] and prev and prev['time']:
            player['time_diff'] = player['time'] - prev['time']
        else:
            player['time_diff'] = None

        result[id] = player
        prev = player

    return result


def format_times_diffs(players):
    """Formats times and time differences"""
    result = {}

    for id, player in players.items():
        player['time'] = timefilter(player['time'])
        player['time_diff'] = timefilter(player['time_diff'])

        result[id] = player

    return result



def group_players(players):
    """
    Divides players into groups: `finished`, `disqualified` and, optionally, `not_finished`.

    args:
        players: dict of players, with their ID as the key, containing (among others)
            `disqualified` (bool) property

    returns:
        ranking: dict of lists (groups) of players
    """
    result = {'finished': [], 'disqualified': [], 'not_finished': []}

    for id, player in players.items():
        # Save `disqualified` property to temporary variable, and delete from player dict
        disq = player['disqualified']
        del player['disqualified']

        # Assign to suitable groups
        if player['time']:
            result['finished'].append(player)
        elif disq:
            result['disqualified'].append(player)
        else:
            result['not_finished'].append(player)

    return result


def get_split_prog(split):
    """Returnes dict of dicts of player progress until given split"""
    # Get progress of all players
    players_all = split.progress_all
    # Get players that has been disqualified on this or before this split
    players_disq = split.progress_disq

    # Sift disqualified players from all players
    players_finished = [x for x in players_all if x[0] not in [y[0] for y in players_disq]]

    # Create dict of dicts with player data
    ranking = {}
    keys = ('id', 'name', 'time', 'disqualified')

    # Players that are not disqualified go first, with None for `disqualified` field
    for player in players_finished:
        ranking[player[0]] = dict(zip(keys, player + (None,)))

    # Then disqualified ones, with True
    for player in players_disq:
        ranking[player[0]] = dict(zip(keys, player + (True,)))

    return ranking
