__author__ = 'alik'

from django.contrib.auth.models import User, Group
from rest_framework import serializers
from crm.models import Contact


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
    class Meta:
        model = Contact
        fields = ('id', 'first_name', 'last_name', 'create_time', 'modify_time', 'creator', 'creator_name')
