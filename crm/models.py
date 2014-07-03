from django.db import models
from django.contrib.auth.models import User

class Contact(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    create_time = models.DateTimeField()
    modify_time = models.DateTimeField()
    creator = models.ForeignKey(User)

    class Meta:
        ordering = ('create_time',)

class ContactEmail(models.Model):
    contact = models.ForeignKey(Contact)
    email = models.EmailField(max_length=256, blank=False)

class ContactEventType(models.Model):
    name = models.CharField(max_length=256, blank=False)
    description = models.CharField(max_length=256)

class ContactEvent(models.Model):
    contact = models.ForeignKey(Contact)
    event_time = models.DateTimeField(blank=False)
    type = models.ForeignKey(ContactEventType)
    description = models.CharField(max_length=256, blank=False)
