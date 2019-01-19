from os import path

BASEDIR = path.abspath(path.dirname(__file__))

# The app
DEBUG = False
TESTING = True
SECRET_KEY = 'xd'

# SQLAlchemy
SQLALCHEMY_DATABASE_URI = 'postgresql://atom:acdc@localhost/testing'
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_ECHO = False
