from flask import Blueprint, render_template, jsonify, redirect

from project.models import Split

from project.api.helpers import get_split_prog, add_positions, add_pos_diffs, add_time_diffs, format_times_diffs, group_players

#### API globals ######################################################
#######################################################################

split_keys = ('id', 'name', 'time', 'disqualified')


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

@api_blueprint.route('/api/split/<id>')
def api_split(id):
    # Get player times form given split
    _split = Split.query.get(id)
    _times = _split.times

    # Parse to a dict
    ranking = {}
    keys = ('id', 'name', 'time', 'disqualified')
    for time in _times:
        ranking[time[0]] = dict(zip(keys, time))

    # Parse even more
    ranking = add_positions(ranking)
    ranking = add_time_diffs(ranking)
    ranking = format_times_diffs(ranking)
    ranking = group_players(ranking)

    return jsonify(ranking)


@api_blueprint.route('/api/split/progress/<id>')
def api_split_progress(id):
    # Get current and previous splits
    _curr = Split.query.get(id)
    _prev = _curr.previous

    # No previous split means current one is first in stage
    if not _prev:
        return api_split(id)

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

    return jsonify(curr)
