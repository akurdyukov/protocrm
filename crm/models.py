from django.db import models
from django.contrib.auth.models import User
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

class ContactEvent(models.Model):
    CONTACT_CREATED = 'CC'
    CONTACT_EDITED = 'CE'
    NOTE_ADDED = 'NE'

    TYPE_CHOICES = (
        (CONTACT_CREATED, 'Contact created'),
        (CONTACT_EDITED, 'Contact edited'),
        (NOTE_ADDED, 'Note added')
    )

    contact = models.ForeignKey(Contact)
    event_time = models.DateTimeField(blank=False, auto_now_add=True)
    type = models.CharField(max_length=2, choices=TYPE_CHOICES, blank=False)
    description = models.CharField(max_length=256, blank=False)
    author = CurrentUserField(auto_update=False, blank=False)
