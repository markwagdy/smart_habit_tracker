from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Habit, HabitLog
from datetime import timedelta

class HabitTrackerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='secret123', email='test@example.com')
        response = self.client.post('/api/auth/login/', {'username': 'testuser', 'password': 'secret123'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_register_user(self):
        response = APIClient().post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'newpassword123',
            'email': 'new@example.com'
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_create_habit(self):
        response = self.client.post('/api/auth/habits/', {
            'name': 'Read Books',
            'description': 'Read 20 pages',
            'tag': 'mind'
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Habit.objects.count(), 1)

   
    def test_add_log_and_increment_streak(self):
        habit_response = self.client.post('/api/auth/habits/', {'name': 'Meditate'}, format='json')
        habit_id = habit_response.data['id']
        habit = Habit.objects.get(id=habit_id)

        # Log for yesterday manually
        yesterday = timezone.now().date() - timedelta(days=1)
        HabitLog.objects.create(habit=habit, date=yesterday)
        habit.last_completed = yesterday
        habit.streak = 1
        habit.save()

        # Add today's log
        response = self.client.post(f'/api/auth/habits/{habit_id}/add_log/')
        self.assertEqual(response.status_code, 200)
        habit.refresh_from_db()
        self.assertEqual(habit.streak, 2)

    def test_duplicate_log_same_day(self):
        habit_response = self.client.post('/api/auth/habits/', {'name': 'Stretch'}, format='json')
        habit_id = habit_response.data['id']

        # First log
        self.client.post(f'/api/auth/habits/{habit_id}/add_log/')

        # Second log should fail
        response = self.client.post(f'/api/auth/habits/{habit_id}/add_log/')
        self.assertEqual(response.status_code, 400)
        self.assertIn('already logged for today', response.data['detail'].lower())
