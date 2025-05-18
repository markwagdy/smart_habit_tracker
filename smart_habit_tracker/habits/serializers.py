from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Habit, HabitLog


def validate(self, attrs):
    request = self.context.get('request')
    user = request.user
    name = attrs.get('name').strip()

    # Check for duplicate habit name (case-insensitive) for this user
    if Habit.objects.filter(user=user, name__iexact=name).exists():
        raise serializers.ValidationError("You already have a habit with this name.")

    return attrs



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['date']
        
        
        
class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)

    class Meta:
        model = Habit
        fields = ['id', 'name', 'description', 'tag', 'created_at', 'streak', 'last_completed', 'logs']

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Habit name must be at least 3 characters.")
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user
        name = attrs.get('name').strip()

        # If updating, skip check if it's the same habit
        if self.instance:
            existing = Habit.objects.filter(user=user, name__iexact=name).exclude(pk=self.instance.pk)
        else:
            existing = Habit.objects.filter(user=user, name__iexact=name)

        if existing.exists():
            raise serializers.ValidationError("You already have a habit with this name.")
        
        return attrs
