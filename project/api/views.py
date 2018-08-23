from flask import Blueprint, render_template, jsonify, redirect

from project.models import Split, Stage, Event
from project.api.rankings import get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking
from project.api.helpers import normalize


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

# http://flask.pocoo.org/snippets/57/
@api_blueprint.route('/', defaults={'path': ''})
@api_blueprint.route('/<path:path>')
def index(path):
    return render_template('index.html')


@api_blueprint.route('/api/event/info/<id>')
def event(id):
    event = Event.query.get(id)

    game = {'id': event.game.id, 'name': event.game.name}
    stages = normalize(('id', 'country', 'finished', 'order'), event.get_stages());
    car_classes = normalize(('id', 'name'), event.get_car_classes())
    players = normalize(('id', 'name', 'points', 'car_id', 'car_name'), event.get_players())

    return jsonify({
        'id': event.id,
        'name': event.name,
        'game': game,
        'players': players,
        'carClasses': car_classes,
        'stages': stages
    })


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
