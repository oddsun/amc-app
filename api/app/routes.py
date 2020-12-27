from flask import render_template
from app import app
from app.models import Problem
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
        else:
            problem.choices = [chr(i + ord('A')) for i in range(5)]
        problem.problem = problem.problem.replace('$$', r'\$$')
    # return render_template('problem.html', id=id, problem=problem)
    # print(type(problems[0].problem))
    return {'results': sorted(({'problem' : problem.problem, 'choices': problem.choices, 'id':problem.id} for problem in problems), key=lambda x: x['id'])}


@app.route('/api/available_contests')
def available_contests():
    contests = Problem.query.with_entities(Problem.contest_name).distinct()
    return {'available_contests': [x[0] for x in contests]}
# @app.route('/test')
# def test():
#     return render_template('test.html')
