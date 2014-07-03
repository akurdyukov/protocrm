__author__ = 'alik'
from django.conf.urls import patterns, url
from crm import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
)

