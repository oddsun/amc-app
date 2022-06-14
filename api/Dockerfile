FROM python:3.9
WORKDIR /app

COPY . ./
RUN pip install -r ./requirements.txt
ENV FLASK_ENV production
RUN ls -lah

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "wsgi:app"]