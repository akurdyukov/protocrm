from django.db import models
from current_user.models import CurrentUserField
from multi_email_field.fields import MultiEmailField

class Contact(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)
    creator = CurrentUserField(auto_update=False, related_name='creator')
    modifier = CurrentUserField(related_name='modifier')
    emails = MultiEmailField()

    class Meta:
        ordering = ('create_time',)

class ContactEventType(models.Model):
    name = models.CharField(max_length=256, blank=False)
    description = models.CharField(max_length=256)

class ContactEvent(models.Model):
    contact = models.ForeignKey(Contact)
    event_time = models.DateTimeField(blank=False)
    type = models.ForeignKey(ContactEventType)
    description = models.CharField(max_length=256, blank=False)
