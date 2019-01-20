from os import path

BASEDIR = path.abspath(path.dirname(__file__))

# The app
# DEBUG = True
SECRET_KEY = '\xc5\xcbmu\xf5\xcd\xbe\xee\xc9a\xac\xe6\x80\x16,\x96\xf4\xcaW\xe9\xa79\xbe\x98'

# SQLAlchemy
SQLALCHEMY_DATABASE_URI = 'postgres://rxqnbsqvyaabnm:09d556f69c5e4f5370d556fd73ada6aa22e56338fdf6e484ca647b370e5737fe@ec2-54-163-246-159.compute-1.amazonaws.com:5432/d816tjvkivk9p7'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = False
