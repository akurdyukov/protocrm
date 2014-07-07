from django.db import models
from current_user.models import CurrentUserField

class Contact(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)
    creator = CurrentUserField(auto_update=False, related_name='creator')
    modifier = CurrentUserField(related_name='modifier')

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
