from os import path

BASEDIR = path.abspath(path.dirname(__file__))

# The app
# DEBUG = True
SECRET_KEY = '\xc5\xcbmu\xf5\xcd\xbe\xee\xc9a\xac\xe6\x80\x16,\x96\xf4\xcaW\xe9\xa79\xbe\x98'

# SQLAlchem
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = False
