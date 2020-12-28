from app import db
from sqlalchemy.sql import func


class Problem(db.Model):
    __table__ = db.Model.metadata.tables['problem_table']

    def __repr__(self):
        return '<Problem {} in {}>'.format(self.id, self.contest_name)


class Answer(db.Model):
    __table__ = db.Model.metadata.tables['ans_table']

    def __repr__(self):
        return '<Answer {} in {}>'.format(self.id, self.contest_name)


class ResponseTime(db.Model):
    __bind_key__ = 'response'
    __tablename__ = 'response_time'
    id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.Integer)
    entry_type = db.Column(db.String(10))
    contest_name = db.Column(db.String(20))
    entry_time = db.Column(db.DateTime, server_default=func.utcnow())

    # def __init__(self, problem_id, entry_type, contest_name):
    #     self.problem_id = problem_id
    #     self.entry_type = entry_type
    #     self.contest_name = contest_name
    #     self.entry_time = entry_time

    def __repr__(self):
        return '<ResponseTime {} {} in {} at {}>'.format(self.entry_type, self.problem_id, self.contest_name, self.entry_time)

class Response(db.Model):
    __bind_key__ = 'response'
    __tablename__ = 'response'
    id = db.Column(db.Integer, primary_key=True)
    response_str = db.Column(db.String(150))
    contest_name = db.Column(db.String(20))
    entry_time = db.Column(db.DateTime, server_default=func.utcnow())

    # def __init__(self, problem_id, entry_type, contest_name):
    #     self.problem_id = problem_id
    #     self.entry_type = entry_type
    #     self.contest_name = contest_name
    #     self.entry_time = entry_time

    def __repr__(self):
        return '<Response for {}>'.format(self.contest_name)
