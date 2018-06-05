from os import path, curdir
from flask import Flask


#### App config #######################################################
#######################################################################

# Proper path to instance directory
instance_path = path.join(path.abspath(curdir), 'instance')

# Init app with config file in instance directory
app = Flask(__name__, instance_path=instance_path, instance_relative_config=True)
app.config.from_pyfile('flask.cfg')


#### Blueprints #######################################################
#######################################################################

# Import
from project.events.views import events_blueprint

# Register
app.register_blueprint(events_blueprint)
