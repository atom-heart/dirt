from flask import Blueprint, render_template, jsonify, redirect, abort, request
from sqlalchemy import and_

from project import db
from project.filters import timefilter

from project.models import Split, Stage, Event, Time, Player, StageRanking
from project.api.rankings import get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking
from project.api.helpers import normalize, add_positions, strToTimedelta, assign_points

import datetime


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

# http://flask.pocoo.org/snippets/57/
@api_blueprint.route('/event', defaults={'path': ''})
@api_blueprint.route('/event/<path:path>')
def index(path):
    return render_template('index.html')


@api_blueprint.route('/api/event/info/<id>')
def event(id):
    event = Event.query.get(id)

    game = {'id': event.game.id, 'name': event.game.name}
    stages = normalize(('id', 'country', 'finished', 'order'), event.get_stages())
    car_classes = normalize(('id', 'name'), event.get_car_classes())
    players = normalize(('id', 'name', 'order', 'points', 'car_id', 'car_name'), event.get_players())

    # abort(404)

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


@api_blueprint.route('/api/stage/test/<id>')
def api_stage_test(id):
    _stage = Stage.query.get(id)
    _splits = _stage.splits.order_by(Split.order).all()
    splits = []

    for _split in _splits:
        split = {
            'id': _split.id,
            'order': _split.order,
            'finished': _split.finished,
            'track': _split.track.name,
            'weather': _split.weather.conditions,
            'ranking': get_split_ranking(_split.id)
        }

        if _split.finished:
            split['progress'] = get_split_progress(_split.id)

        splits.append(split)

    # TODO shoud hide progress behind if
    return jsonify({
        'ranking': get_stage_ranking(id),
        'progress': get_stage_progress(id),
        'splits': splits
    })


@api_blueprint.route('/api/stage/progress/<id>')
def api_stage_progress(id):
    return jsonify(get_stage_progress(id))


@api_blueprint.route('/api/event/<id>')
def api_event(id):
    return jsonify(get_event_ranking(id))


@api_blueprint.route('/api/time', methods=['PUT'])
def api_add_time():
    if request.method == 'PUT':
        time = Time.query\
            .filter(and_(Time.player_id == request.form.get('player_id'),
                         Time.split_id == request.form.get('split_id'))).first()

        split = Split.query.get(request.form.get('split_id'))

        player_ranking = StageRanking.query\
            .filter(and_(StageRanking.stage_id == split.stage_id,
                         StageRanking.player_id == request.form.get('player_id'))).first()

        if time.time or time.disqualified:
            time.time = None
            time.disqualified = False
            player_ranking.disqualified = False
            split.turns += 1

        action = request.form.get('action')

        if action == 'ADD_TIME':
            time.time = strToTimedelta(request.form.get('time'))
            split.turns -= 1

        elif action == 'DISQUALIFY':
            time.disqualified = True
            player_ranking.disqualified = True
            split.turns -= 1

        if split.should_finish():
            split.finished = True

            if split.stage.should_finish():
                split.stage.finished = True

                last_split = Split.query\
                    .filter(Split.stage_id == split.stage_id)\
                    .order_by(Split.order.desc())\
                    .first()

                keys = ('id', 'name', 'time', 'disqualified')
                ls_progress = normalize(keys, last_split.get_progress())
                ls_progress = add_positions(ls_progress)

                player_points = assign_points(ls_progress)

                ranking = StageRanking.query\
                    .filter(StageRanking.stage_id == last_split.stage_id).all()

                for player in ranking:
                    player.points = player_points[player.player_id]

                db.session.add_all(ranking)


        else:
            split.finished = False
            split.stage.finished = False

        db.session.add_all([time, split, player_ranking])
        db.session.commit()

        response = {
            'id': time.id,
            'time': timefilter(time.time),
            'player_id': time.player_id,
            'split_id': time.split_id,
            'disqualified': time.disqualified
        }

        return jsonify(response)
