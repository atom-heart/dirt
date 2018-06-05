from flask import Blueprint, render_template


#### Blueprint config #################################################
#######################################################################

events_blueprint = Blueprint('events', __name__)


#### Routes ###########################################################
#######################################################################

@events_blueprint.route('/')
def index():
    """Hello, World!"""
    return render_template('index.html')
