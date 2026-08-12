#!/bin/sh
set -e

echo "Waiting for database..."
python -c "
import sys, time, psycopg2, os
db_url = os.environ.get('DATABASE_URL', '')
# parse simple host/user/pass
for _ in range(30):
    try:
        conn = psycopg2.connect(db_url)
        conn.close()
        sys.exit(0)
    except Exception as e:
        time.sleep(1)
sys.exit(1)
"

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Running seed script if DB is empty..."
python seed/seed.py || true

echo "Starting Gunicorn..."
exec gunicorn portail5g.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
