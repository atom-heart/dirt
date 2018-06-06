from flask import Blueprint, render_template

from project import db
from project.models import Event


#### Blueprint config #################################################
#######################################################################

events_blueprint = Blueprint('events', __name__)


#### Routes ###########################################################
#######################################################################

@events_blueprint.route('/')
def index():
    """Hello, World!"""
    return render_template('index.html')
