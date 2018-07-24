from flask import Blueprint, render_template, jsonify, redirect

from project.models import Split, Stage

from project.api.helpers import get_split_prog, add_positions, add_pos_diffs, add_time_diffs, format_times_diffs, group_players
from project.api.rankings import get_split_ranking, get_split_progress, get_stage_ranking


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

@api_blueprint.route('/api/split/<id>')
def api_split(id):
    return jsonify(get_split_ranking(id))


@api_blueprint.route('/api/split/progress/<id>')
def api_split_progress(id):
    return jsonify(get_split_progress(id))


@api_blueprint.route('/api/stage/<id>')
def api_stage(id):
    # Country, info
    # Stage ranking
    # For each split:
        # Split name, weather, order
        # Split times

    return jsonify(get_stage_ranking(id))
