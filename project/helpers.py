def calc_diffs(players):
    for i in range(2, len(players) + 1):
        players[i]['diff'] = players[i]['time'] - players[i - 1]['time'];
    return players;
