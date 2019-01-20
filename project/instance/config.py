import os

BASEDIR = os.path.abspath(path.dirname(__file__))

print(os.environ['DATABASE_URL'])

# The app
DEBUG = True
SECRET_KEY = 'supersecretkey'

# SQLAlchem
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = False
