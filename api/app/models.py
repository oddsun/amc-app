from app import db


class Problem(db.Model):
    __table__ = db.Model.metadata.tables['problem_table']

    def __repr__(self):
        return '<Problem {} in {}>'.format(self.id, self.contest_name)


class Answer(db.Model):
    __table__ = db.Model.metadata.tables['ans_table']

    def __repr__(self):
        return '<Answer {} in {}>'.format(self.id, self.contest_name)
