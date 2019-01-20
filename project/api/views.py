from flask import Blueprint, render_template, jsonify, redirect, abort, request
from sqlalchemy import and_
from json import loads as json_loads
from datetime import datetime

from project import db
from project.filters import timefilter

from project.models import Split, Stage, Event, Time, Player, StageRanking
from project.models import Game, Track, CarClass, Weather, Car, EventPlayer, Country
from project.api.rankings import assign_points, get_event_ranking, get_split_ranking, get_split_progress, get_stage_ranking, get_stage_progress, get_event_ranking
from project.api.helpers import normalize, add_positions, strToTimedelta, add_points, get_next_split, get_prev_split


#### Blueprint config #################################################
#######################################################################

api_blueprint = Blueprint('api', __name__)


#### Routes ###########################################################
#######################################################################
import os

@api_blueprint.route('/api/populate')
def api_populate():
    # yes, that's how I populate database. i know.
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    path = APP_ROOT + '/add_game.py'
    exec(open(path).read())

    return jsonify('done')

@api_blueprint.route('/api/events')
def api_events():
    _events = Event.query.order_by(Event.start.desc()).all()

    response = [{
        'id': e.id,
        'name': e.name,
        'finished': e.finished,
        'started': e.start,
        'game_id': e.game_id
    } for e in _events]

    return jsonify(response)


import json
@api_blueprint.route('/api/event', methods=['POST'])
def api_event():
    # Create an event
    if request.method == 'POST':
        data = request.get_json()

        # Event with game and car classes
        game = Game.query.get(data['gameId'])
        cc = [CarClass.query.get(id) for id in data['classes']]

        event = Event(name=data['name'], game=game, car_classes=cc, start=datetime.now())

        db.session.add(event)

        # Event players
        eps = []
        players = []
        for order, p in enumerate(data['players'], start=1):
            player = Player.query.get(p['playerId'])
            players.append(player)

            car = Car.query.get(p['carId'])

            ep = EventPlayer(order=order, event=event, car=car)
            ep.player = player

            eps.append(ep)

        db.session.add_all(eps)

        # Stages
        stages = []

        for stage_order, stage in enumerate(data['stages'], start=1):
            country = Country.query.get(stage['countryId'])
            splits = []

            for order, split in enumerate(stage['splits'], start=1):
                track = Track.query.get(split['trackId'])
                weather = Weather.query.get(split['weatherId'])

                _split = Split(track=track, weather=weather, order=order)
                splits.append(_split)

                db.session.add(_split)

                # Turns
                turns = []
                for player in players:
                    turn = Time(player=player, split=_split)
                    turns.append(turn)

                db.session.add_all(turns)

            if stage_order == 1:
                splits[0].active = True
            splits[-1].last_in_stage = True

            db.session.add_all(splits)

            _stage = Stage(order=stage_order, event=event, country=country, splits=splits)
            stages.append(_stage)

        stages[-1].last_in_event = True

        for stage in stages:
            stage_rankings = []

            for player in players:
                sr = StageRanking()
                sr.player = player
                stage_rankings.append(sr)

            stage.stage_ranking.extend(stage_rankings)
            db.session.add_all(stage_rankings)

        db.session.add_all(stages)
        db.session.commit()

        if event.name == '':
            event.name = 'Event #' + str(event.id)
            db.session.add(event)
            db.session.commit()

        return jsonify({
            'event_id': event.id
        })


@api_blueprint.route('/api/players')
def api_players():
    _players = Player.query.all()
    print(not _players)
    if not _players:
        return jsonify([])

    players = []

    for _player in _players:
        players.append({
            'id': _player.id,
            'name': _player.name
        })

    return jsonify(players), 200


@api_blueprint.route('/api/player', methods=['POST'])
def api_player():
    if request.method == 'POST':
        player = Player(name=request.form.get('name'))

        db.session.add(player)
        db.session.commit()

        return jsonify({
            'id': player.id,
            'name': player.name
        })


@api_blueprint.route('/api/games/<int:id>')
def api_game(id):
    _game = Game.query.get(id)
    if not _game:
        abort(404)

    game = {
        'id': _game.id,
        'name': _game.name
    }

    car_classes = []

    for _class in _game.car_classes.all():
        cars = []

        for _car in _class.cars.all():
            cars.append({
                'id': _car.id,
                'name': _car.name
            })

        car_classes.append({
            'id': _class.id,
            'name': _class.name,
            'cars': cars
        })

    countries = []

    for _country in _game.countries.all():
        tracks = []

        for _track in _country.tracks.filter(Track.game_id == _game.id).all():
            tracks.append({
                'id': _track.id,
                'name': _track.name,
                'length': _track.length,
                'type': _track.type
            })

        weather = []

        for _weather in _country.weather.all():
            weather.append({
                'id': _weather.id,
                'conditions': _weather.conditions,
                'favorable': _weather.favorable
            })

        countries.append({
            'id': _country.id,
            'name': _country.name,
            'tracks': tracks,
            'weather': weather
        })

    return jsonify({
        'game': game,
        'car_classes': car_classes,
        'countries': countries
    }), 200


@api_blueprint.route('/api/events/<int:id>')
def api_eventS(id):
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

    if (_event.finished):
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

        if _split.finished:
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
            'ranking': get_split_ranking(next_split.id)
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
        'ranking': get_split_ranking(turn.split.id)
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
