from flask import Blueprint, render_template, jsonify, redirect, abort, request
from sqlalchemy import and_
import json

from project import db
from project.filters import timefilter

from project.models import Split, Stage, Event, Time, Player, StageRanking
from project.api.rankings import get_event_ranking, get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking
from project.api.helpers import normalize, add_positions, strToTimedelta, add_points, get_next_split, get_prev_split


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


@api_blueprint.route('/api/event/<id>')
def api_event(id):
    _event = Event.query.get(id)

    game = {'id': _event.game.id, 'name': _event.game.name}
    car_classes = normalize(('id', 'name'), _event.get_car_classes())
    players = normalize(('id', 'name', 'order', 'points', 'car_id', 'car_name'), _event.get_players())
    ranking = get_event_ranking(_event.id)

    stages = {'byId': {}, 'allIds': []}

    for _stage in _event.get_stages():
        stages['byId'][_stage.id] = {
            'id': _stage.id,
            'country': _stage.country,
            'finished': _stage.finished,
            'order': _stage.order,
            'last_in_event': _stage.last_in_event
        }

        stages['allIds'].append(_stage.id)

    event = {
        'id': _event.id,
        'name': _event.name,
        'finished': _event.finished,
        'start': _event.start,
        'game': game,
        'players': players,
        'carClasses': car_classes,
        'ranking': ranking
    }

    return jsonify({
        'event': event,
        'stages': stages
    }), 200


@api_blueprint.route('/api/event/info/<id>')
def event(id):
    event = Event.query.get(id)

    game = {'id': event.game.id, 'name': event.game.name}
    stages = normalize(('id', 'country', 'finished', 'order', 'last_in_event'), event.get_stages())
    car_classes = normalize(('id', 'name'), event.get_car_classes())
    players = normalize(('id', 'name', 'order', 'points', 'car_id', 'car_name'), event.get_players())
    ranking = get_event_ranking(event.id)

    return jsonify({
        'id': event.id,
        'name': event.name,
        'finished': event.finished,
        'start': event.start,
        'game': game,
        'players': players,
        'carClasses': car_classes,
        'stages': stages,
        'ranking': ranking
    })


@api_blueprint.route('/api/split/<id>')
def api_split(id):
    _split = Split.query.get(id)

    split = {
        'id': _split.id,
        'order': _split.order,
        'active': _split.active,
        'finished': _split.finished,
        'last_in_stage': _split.last_in_stage,
        'track': _split.track.name,
        'weather': _split.weather.conditions,
        'ranking': get_split_ranking(_split.id),
        'progress': get_split_progress(id) if _split.finished else None
    }

    return jsonify(split), 200


@api_blueprint.route('/api/split/ranking/<id>')
def api_split_ranking(id):
    return jsonify(get_split_ranking(id))


@api_blueprint.route('/api/split/progress/<id>')
def api_split_progress(id):
    return jsonify(get_split_progress(id))


@api_blueprint.route('/api/stage/test/<id>')
def api_stage_test(id):
    _stage = Stage.query.get(id)
    _splits = _stage.splits.order_by(Split.order).all()
    splits = []

    for _split in _splits:
        split = {
            'id': _split.id,
            'order': _split.order,
            'active': _split.active,
            'finished': _split.finished,
            'last_in_stage': _split.last_in_stage,
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


@api_blueprint.route('/api/stage/<id>')
def api_stage(id):
    _stage = Stage.query.get(id)

    splits = {'byId': {}, 'allIds': []}

    for _split in _stage.splits.order_by(Split.order).all():
        split = {
            'id': _split.id,
            'stage_id': _stage.id,
            'order': _split.order,
            'active': _split.active,
            'finished': _split.finished,
            'last_in_stage': _split.last_in_stage,
            'track': _split.track.name,
            'weather': _split.weather.conditions,
            'ranking': get_split_ranking(_split.id)
        }

        if _split.finished:
            split['progress'] = get_split_progress(_split.id)

        splits['byId'][_split.id] = split
        splits['allIds'].append(_split.id)

    # TODO should send only active/finished splits

    stage = {
        'id': id,
        'ranking': get_stage_ranking(id),
        'progress': get_stage_progress(id) if _stage.finished else None
    }

    return jsonify({
        'stage': stage,
        'splits': splits
    }), 200



@api_blueprint.route('/api/stage/progress/<id>')
def api_stage_progress(id):
    return jsonify(get_stage_progress(id))


def assign_points(stage_rankings, split):
    last_split_progress = normalize(('id', 'name', 'time', 'disqualified'), split.get_progress())
    last_split_progress = add_positions(last_split_progress)
    last_split_progress = add_points(last_split_progress)

    for player in stage_rankings:
        player.points = last_split_progress[player.player_id]


@api_blueprint.route('/api/finish_split', methods=['PUT'])
def api_finish_split():
    args = request.get_json()

    split = Split.query.get(args['split_id'])
    split.active = False

    splits = {'byId': {}, 'allIds': []}

    splits['allIds'].append(split.id)
    splits['byId'][split.id] = {
        'id': split.id,
        'active': False,
        'progress': get_split_progress(split.id)
    }

    if not (split.last_in_stage and split.stage.last_in_event):
        next_split = get_next_split(split)
        next_split.active = True

        db.session.add(next_split)

        splits['allIds'].append(next_split.id)
        splits['byId'][next_split.id] = {
            'id': next_split.id,
            'active': True,
            'ranking': get_split_ranking(next_split.id)
        }

    response = {'splits': splits}

    if split.last_in_stage:
        split.stage.finished = True

        stage_rankings = StageRanking.query\
            .filter(StageRanking.stage_id == split.stage_id).all()

        assign_points(stage_rankings, split)

        db.session.add_all(stage_rankings)

        response['stage'] = {
            'id': split.stage.id,
            'finished': split.stage.finished,
            'ranking': get_stage_ranking(split.stage.id),
            'progress': get_stage_progress(split.stage.id)
        }

    if split.last_in_stage and split.stage.last_in_event:
        split.stage.event.finished = True

        response['event'] = {
            'id': split.stage.event.id,
            'finished': split.stage.event.finished,
            'ranking': get_event_ranking(split.stage.event.id)
        }

    db.session.add(split)
    db.session.commit()

    return jsonify(response), 200

@api_blueprint.route('/api/time', methods=['PUT'])
def api_add_time_v2():
    args = request.get_json()

    if not 'action' in args:
        abort(404)

    turn = Time.query\
        .filter(Time.player_id == args['player_id'])\
        .filter(Time.split_id == args['split_id'])\
        .first()

    player_ranking = StageRanking.query\
        .filter(StageRanking.stage_id == turn.split.stage_id)\
        .filter(StageRanking.player_id == args['player_id'])\
        .first()

    if args['action'] == 'ADD_TIME':
        turn.time = strToTimedelta(args['time'])
        turn.disqualified = False
        player_ranking.disqualified = False

    elif args['action'] == 'DISQUALIFY':
        turn.time = None
        turn.disqualified = True
        player_ranking.disqualified = True

    if turn.split.should_finish():
        turn.split.finished = True

    db.session.add_all([turn, player_ranking])
    db.session.commit()

    split = {
        'id': turn.split.id,
        'finished': turn.split.finished,
        'ranking': get_split_ranking(turn.split.id)
    }

    return jsonify(split), 200


# @api_blueprint.route('/api/time', methods=['PUT'])
# def api_add_time():
#     if request.method == 'PUT':
#         json = request.get_json()
#
#         turn = Time.query\
#             .filter(Time.player_id == json['player_id'])\
#             .filter(Time.split_id == json['split_id'])\
#             .first()
#
#         stage_ranking = StageRanking.query\
#             .filter(StageRanking.stage_id == turn.split.stage_id)\
#             .all()
#
#         player_ranking = next(player for player in stage_ranking if player.player_id == turn.player_id)
#
#         if json['action'] == 'ADD_TIME':
#             turn.time = strToTimedelta(json['time'])
#             turn.disqualified = False
#             player_ranking.disqualified = False
#
#         elif json['action'] == 'DISQUALIFY':
#             turn.time = None
#             turn.disqualified = True
#             player_ranking.disqualified = True
#
#         response = {'splits': []}
#
#         # Lock previous split if current just started
#         if turn.split.has_just_started() and not (turn.split.order == 1 and turn.split.stage.order == 1):
#             prev_split = get_prev_split(turn.split)
#
#             prev_split.active = False
#             db.session.add(prev_split)
#
#             response['splits'].append({
#                 'id': prev_split.id,
#                 'active': prev_split.active
#             })
#
#
#         if turn.split.should_finish():
#             turn.split.finished = True
#
#             if turn.split.stage.should_finish():
#                 turn.split.stage.finished = True
#
#                 response['stage'] = {
#                     'id': turn.split.stage_id,
#                     'finished': turn.split.stage.finished,
#                     'ranking': get_stage_ranking(turn.split.stage.id),
#                     'progress': get_stage_progress(turn.split.stage.id)
#                 }
#
#                 # Assign points for players
#                 split_progress = normalize(('id', 'name', 'time', 'disqualified'), turn.split.get_progress())
#                 split_progress = add_positions(split_progress)
#                 split_progress = assign_points(split_progress)
#
#                 for player in stage_ranking:
#                     player.points = split_progress[player.player_id]
#
#                 db.session.add_all(stage_ranking)
#
#                 if turn.split.stage.event.should_finish():
#                     turn.split.stage.event.finished = True
#
#                     response['event'] = {
#                         'finished': turn.split.stage.event.finished,
#                         'ranking': get_event_ranking(turn.split.stage.event.id)
#                     }
#
#                 # Activate next split
#                 else:
#                     next_split = get_next_split(turn.split)
#                     next_split.active = True
#
#                     db.session.add(next_split)
#
#                     response['splits'].append({
#                         'id': next_split.id,
#                         'active': next_split.active,
#                         'ranking': get_split_ranking(next_split.id)
#                     })
#
#         response['splits'].append({
#             'id': turn.split.id,
#             'finished': turn.split.should_finish(),
#             'ranking': get_split_ranking(turn.split.id),
#             'progress': get_split_progress(turn.split.id) if turn.split.should_finish() else None
#         })
#
#         db.session.add_all([turn, player_ranking])
#         db.session.commit()
#
#         return jsonify(response)


@api_blueprint.route('/api/test')
def api_test():
    split = Split.query.get(1)
    print(split.should_finish())

    return 'xd'
