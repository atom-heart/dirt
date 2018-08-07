from flask import Blueprint, render_template, jsonify, redirect

from project.models import Split, Stage
from project.api.rankings import get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

@api_blueprint.route('/')
def index():
    return render_template('index.html')


@api_blueprint.route('/api/split/<id>')
def api_split(id):
    return jsonify(get_split_ranking(id))


@api_blueprint.route('/api/split/progress/<id>')
def api_split_progress(id):
    return jsonify(get_split_progress(id))


@api_blueprint.route('/api/stage/<id>')
def api_stage(id):
    return jsonify(get_stage_ranking(id))


@api_blueprint.route('/api/stage/progress/<id>')
def api_stage_progress(id):
    return jsonify(get_stage_progress(id))


@api_blueprint.route('/api/event/<id>')
def api_event(id):
    return jsonify(get_event_ranking(id))
