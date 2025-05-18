from django.utils import timezone
from datetime import timedelta
from .models import Habit
from celery import shared_task

@shared_task
def reset_streaks():
    yesterday = timezone.now().date() - timedelta(days=1)
    habits_to_reset = Habit.objects.filter(
        last_completed__lt=yesterday,
        streak__gt=0
    )
    for habit in habits_to_reset:
        habit.streak = 0
        habit.save()
