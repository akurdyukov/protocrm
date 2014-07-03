from django.shortcuts import render
from django.contrib.auth.models import User, Group
from crm.models import Contact
from rest_framework import viewsets
from crm.serializers import UserSerializer, GroupSerializer, ContactSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


def index(request):
    context = {}
    return render(request, 'crm/index.html', context)