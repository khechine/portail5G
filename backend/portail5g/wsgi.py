"""WSGI config for portail5g project."""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portail5g.settings')
application = get_wsgi_application()
