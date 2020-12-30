from flask import render_template, request
from app import app, db
from app.models import Problem, Answer, User, Response, ResponseTime
import ast


# @app.route('/')
# @app.route('/index')
# def index():
#     user = {'username': 'Odd'}
#     return render_template('index.html', title='Home', user=user)


@app.route('/api/problem/<contest_name>/<id>')
def problem(contest_name, id):
    id_0 = int(id) - 1
    contest_name = contest_name.replace('_', ' ')
    problem = Problem.query.filter_by(contest_name=contest_name, id=id_0).first_or_404()
    problem.problem = problem.problem.replace('static/data/imgs', '/static/data/imgs').replace('<img', '<br/><br/><img')
    # problem.choices = ast.literal_eval(problem.choices)
    if problem.choices != 'null':
        problem.choices = [chr(i + ord('A')) + '. ' + choice for i, choice in enumerate(ast.literal_eval(problem.choices))]
    else:
        problem.choices = [chr(i + ord('A')) for i in range(5)]
    problem.problem = problem.problem.replace('$$', r'\$$')
    # return render_template('problem.html', id=id, problem=problem)
    # print(type(problem.problem))
    return {'problem' : problem.problem, 'choices': problem.choices}

@app.route('/api/problem/<contest_name>')
def problems(contest_name):
    contest_name = contest_name.replace('_', ' ')
    problems = Problem.query.filter_by(contest_name=contest_name).all()
    # print(problems)
    for problem in problems:
        problem.problem = problem.problem.replace('static/data/imgs', '/static/data/imgs').replace('<img', '<br/><br/><img')
        # problem.choices = ast.literal_eval(problem.choices)
        if problem.choices != 'null':
            problem.choices = [chr(i + ord('A')) + '. ' + choice for i, choice in enumerate(ast.literal_eval(problem.choices))]
            if 'amc' in contest_name.lower() and len(problem.choices)<5:
                problem.choices = problem.choices + [chr(i + ord('A')) for i in range(len(problem.choices), 5)]
        else:
            problem.choices = [chr(i + ord('A')) for i in range(5)]
        problem.problem = problem.problem.replace('$$', r'\$$')
    # return render_template('problem.html', id=id, problem=problem)
    # print(type(problems[0].problem))
    return {'results': sorted(({'problem' : problem.problem, 'choices': problem.choices, 'id':problem.id} for problem in problems), key=lambda x: x['id'])}


@app.route('/api/answer/<contest_name>')
def answers(contest_name):
    contest_name = contest_name.replace('_', ' ')
    answers = Answer.query.filter_by(contest_name=contest_name).all()
    sorted_answers = [a.answer for a in sorted(answers, key=lambda x: x.id)]
    return {'results': sorted_answers}

@app.route('/api/available_contests')
def available_contests():
    contests = Problem.query.with_entities(Problem.contest_name).distinct()
    return {'available_contests': [x[0] for x in contests]}

@app.route('/api/users')
def users():
    available_users = User.query.all()
    results = [{column.name: getattr(row, column.name) for column in row.__table__.columns} for row in available_users]
    return {'results': results}

@app.route('/api/adduser/<user_name>')
def add_user(user_name):
    if not User.query.filter_by(name=user_name).all():
        new_user = User(name=user_name)
        db.session.add(new_user)
        db.session.commit()
        return users()
    return {'results': []}

@app.route('/api/response', methods=['POST'])
def response():
    request_data = request.get_json()
    # user_id = request_data['user_id']
    user_name = request_data['user_name']
    response_str = ','.join(request_data['response'])
    contest_name = request_data['contest_name']
    new_response = Response(response_str=response_str, contest_name=contest_name)
    # current_user = User.query.get_or_404(user_id)
    current_user = User.query.filter_by(name=user_name).first_or_404()
    current_user.responses.append(new_response)
    db.session.add(new_response)
    db.session.commit()
    return {'response': new_response.response_str, 'contest_name': new_response.contest_name}


@app.route('/api/response_time', methods=['POST'])
def response_time():
    request_data = request.get_json()
    # user_id = request_data['user_id']
    user_name = request_data['user_name']
    problem_id = request_data['problem_id']
    contest_name = request_data['contest_name']
    entry_type = request_data['entry_type']
    new_rt = ResponseTime(problem_id=problem_id, contest_name=contest_name,
                            entry_type=entry_type)
    # current_user = User.query.get_or_404(user_id)
    current_user = User.query.filter_by(name=user_name).first_or_404()
    current_user.response_times.append(new_rt)
    db.session.add(new_rt)
    db.session.commit()
    return {column.name: getattr(new_rt, column.name) for column in new_rt.__table__.columns}
# @app.route('/test')
# def test():
#     return render_template('test.html')
