# implementations/serializers.py

from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'tujuan', 'start_date', 'end_date', 'supervisor', 'anggota', 'status', 'notes']

    def create(self, validated_data):
        return Project.objects.create(**validated_data)
