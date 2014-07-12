__author__ = 'alik'

from django.contrib.auth.models import User, Group
from rest_framework import serializers
from multi_email_field.serializers import MultiEmailField
from crm.models import Contact, ContactEvent


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class ContactSerializer(serializers.HyperlinkedModelSerializer):
    creator_name = serializers.Field(source='creator.username')
    modifier_name = serializers.Field(source='modifier.username')
    emails = MultiEmailField()

    class Meta:
        model = Contact
        fields = ('id', 'first_name', 'last_name', 'create_time', 'modify_time', 'creator', 'creator_name', 'modifier', 'modifier_name', 'emails')
        read_only_fields = ('id', 'create_time', 'modify_time', 'creator', 'modifier')

class ContactEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ContactEvent
        fields = ('id', 'contact', 'event_time', 'type', 'description', 'author')
        read_only_fields = ('id', 'event_time', 'author')