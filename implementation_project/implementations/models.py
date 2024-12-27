# implementations/models.py
from django.db import models

class Project(models.Model):
    project_name = models.CharField(max_length=100)
    activity = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)
    file = models.FileField(upload_to='files/', blank=True, null=True)

    def __str__(self):
        return self.project_name
