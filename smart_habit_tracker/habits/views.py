from rest_framework import generics, viewsets, permissions
from .serializers import RegisterSerializer, HabitSerializer
from .models import Habit,  HabitLog
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from datetime import timedelta



class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        habit = self.get_object()
        if habit.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this habit.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this habit.")
        instance.delete()

    @action(detail=True, methods=['post'])
    def add_log(self, request, pk=None):
        habit = self.get_object()
        today = timezone.now().date()

        if habit.logs.filter(date=today).exists():
            return Response({"detail": "Habit already logged for today."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            habit_log = HabitLog.objects.create(habit=habit, date=today)
        except IntegrityError:
            return Response({"detail": "Habit already logged for today."}, status=status.HTTP_400_BAD_REQUEST)

        yesterday = today - timedelta(days=1)

        if habit.logs.filter(date=yesterday).exists():
            habit.streak += 1
        else:
            habit.streak = 1

        habit.last_completed = today
        habit.save()

        return Response({"detail": "Habit log added successfully.", "streak": habit.streak})
