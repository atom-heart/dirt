from os import path, curdir

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy


#### App config #######################################################
#######################################################################

# Proper path to instance directory
instance_path = path.join(path.abspath(curdir), 'instance')

# Init app with config file
app = Flask(__name__, instance_path=instance_path, instance_relative_config=True)
app.config.from_pyfile('config.py')

# Modules
db = SQLAlchemy(app)


#### Blueprints #######################################################
#######################################################################

# Import
from project.api.views import api_blueprint

# Register
app.register_blueprint(api_blueprint)


#### React entry point ################################################
#######################################################################

# http://flask.pocoo.org/snippets/57/
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')
