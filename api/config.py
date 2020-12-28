import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # flask-sqlalchemy config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'database.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_BINDS = {
        'response_time': os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'response.sqlite3')
    }
