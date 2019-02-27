from flask import Blueprint, render_template, jsonify, redirect, abort, request
from sqlalchemy import and_
from json import loads as json_loads

from project import db
from project.filters import timefilter

from project.models import Split, Stage, Event, Time, Player, StageRanking
from project.api.rankings import assign_points, get_event_ranking, get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking
from project.api.helpers import normalize, add_positions, strToTimedelta, add_points, get_next_split, get_prev_split


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################

@api_blueprint.route('/api/events/<int:id>')
def api_event(id):
    _event = Event.query.get(id)
    if not _event:
        abort(404)

    event = {
        'id': _event.id,
        'name': _event.name,
        'finished': _event.finished,
        'start': _event.start,
        'game': {'id': _event.game.id, 'name': _event.game.name},
        'carClasses': normalize(('id', 'name'), _event.get_car_classes()),
        'players': normalize(('id', 'name', 'order', 'car_id', 'car_name'), _event.get_players())
    }

    if _event.finished:
        event['ranking'] = get_event_ranking(_event.id)

    stages = [{
        'id': _stage.id,
        'country': _stage.country,
        'order': _stage.order,
    } for _stage in _event.get_stages()]

    return jsonify({
        'event': event,
        'stages': stages
    }), 200


@api_blueprint.route('/api/stages/<int:id>')
def api_stage(id):
    _stage = Stage.query.get(id)
    if not _stage:
        abort(404)

    stage = {
        'id': id,
        'finished': _stage.finished,
        'last_in_event': _stage.last_in_event,
        'ranking': get_stage_ranking(id),
        'progress': get_stage_progress(id) if _stage.finished else None
    }

    splits = []
    for _split in _stage.splits.order_by(Split.order).all():
        split = {
            'id': _split.id,
            'order': _split.order,
            'active': _split.active,
            'finished': _split.finished,
            'last_in_stage': _split.last_in_stage,
            'track': _split.track.name,
            'weather': _split.weather.conditions,
            'stage_id': _stage.id
        }

        if _split.active or _split.finished:
            split['ranking'] = get_split_ranking(_split.id)
        # if _split.finished:
            split['progress'] = get_split_progress(_split.id)

        splits.append(split)

    return jsonify({
        'stage': stage,
        'splits': splits
    }), 200


@api_blueprint.route('/api/splits/<int:id>/finish', methods=['PUT', 'GET'])
def api_finish_split(id):
    _split = Split.query.get(id)
    if not _split:
        abort(404)

    if not (_split.active and _split.finished):
        abort(403)

    _split.active = False

    response = {'splits': [{
        'id': _split.id,
        'active': False,
        'progress': get_split_progress(_split.id)
    }]}

    if not (_split.last_in_stage and _split.stage.last_in_event):
        next_split = get_next_split(_split)
        next_split.active = True

        # Next split will automatically finish when all players are disqualified
        next_split.finished = next_split.should_finish()

        db.session.add(next_split)

        response['splits'].append({
            'id': next_split.id,
            'active': True,
            'finished': next_split.finished,
            'ranking': get_split_ranking(next_split.id),
            'progress': get_split_progress(next_split.id)
        })

    if _split.last_in_stage:
        _split.stage.finished = True

        stage_ranking = StageRanking.query\
            .filter(StageRanking.stage_id == _split.stage_id).all()

        assign_points(stage_ranking, _split)

        db.session.add_all(stage_ranking)

        response['stage'] = {
            'id': _split.stage.id,
            'finished': _split.stage.finished,
            'ranking': get_stage_ranking(_split.stage.id),
            'progress': get_stage_progress(_split.stage.id)
        }

    if _split.last_in_stage and _split.stage.last_in_event:
        _split.stage.event.finished = True

        response['event'] = {
            'id': _split.stage.event.id,
            'finished': _split.stage.event.finished,
            'ranking': get_event_ranking(_split.stage.event.id)
        }

    db.session.add(_split)
    db.session.commit()

    return jsonify(response), 200


@api_blueprint.route('/api/turns/<int:id>', methods=['PUT'])
def api_turn_update(id):
    args = request.get_json()
    if not ('time' in args and 'disqualified' in args):
        abort(400)

    turn = Time.query.get(id)
    if not turn:
        abort(404)

    stage_rank = StageRanking.query.get([turn.player_id, turn.split.stage_id])

    turn.time = strToTimedelta(args['time']) if args['time'] else None
    turn.disqualified = args['disqualified']
    stage_rank.disqualified = args['disqualified']
    turn.split.finished = turn.split.should_finish()

    db.session.add_all([turn, stage_rank])
    db.session.commit()

    split = {
        'id': turn.split.id,
        'finished': turn.split.finished,
        'ranking': get_split_ranking(turn.split.id),
        'progress': get_split_progress(turn.split.id)
    }

    return jsonify(split), 200


#### Helper routes - not used by the app ##############################
#######################################################################

@api_blueprint.route('/api/splits/<int:id>')
def api_split(id):
    _split = Split.query.get(id)

    if not _split:
        abort(404)

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


@api_blueprint.route('/api/splits/<int:id>/ranking')
def api_split_ranking(id):
    return jsonify(get_split_ranking(id))


@api_blueprint.route('/api/splits/<int:id>/progress')
def api_split_progress(id):
    return jsonify(get_split_progress(id))


@api_blueprint.route('/api/stages/<int:id>/progress')
def api_stage_progress(id):
    return jsonify(get_stage_progress(id))
