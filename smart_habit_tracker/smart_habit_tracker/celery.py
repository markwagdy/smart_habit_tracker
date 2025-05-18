from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# set default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_habit_tracker.settings')

app = Celery('smart_habit_tracker')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
