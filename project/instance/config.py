from os import path

BASEDIR = path.abspath(path.dirname(__file__))

# The app
DEBUG = True
SECRET_KEY = '309b73ff14af3782d874a26cf788c3cf92a0b2a28ab3aee0'

# SQLAlchemy
# SQLALCHEMY_DATABASE_URI = 'postgresql://atom:acdc@localhost/dirt'
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_ECHO = False
