from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from crm.models import Contact, ContactEvent
from crm.serializers import UserSerializer, GroupSerializer, ContactSerializer, ContactEventSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    search_fields = ('last_name', 'first_name')


class ContactEventViewSet(viewsets.ModelViewSet):
    queryset = ContactEvent.objects.all()
    serializer_class = ContactEventSerializer
    search_fields = ('type', 'description')
