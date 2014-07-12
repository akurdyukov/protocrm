from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from rest2backbone.forms import FormFactory
from rest2backbone.resources import IndexedRouter
from rest_framework_nested import routers
from rest2backbone.views import restApi
from crm import views

admin.autodiscover()

router = IndexedRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'contactevents', views.ContactEventViewSet)

events_router = routers.NestedSimpleRouter(router, r'contacts', lookup='contact')
events_router.register(r'events', views.ContactEventViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^/?$', login_required(TemplateView.as_view(template_name='crm/index.html')), {'forms': FormFactory(router)}, name='index'),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'crm/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),
    url(r'^api/', include(router.urls)),
    url(r'^api/', include(events_router.urls)),
    url(r'^js-locale/(?P<packages>\S+?)/?$', 'django.views.i18n.javascript_catalog'),
    url(r'^js-restAPI/?$', restApi.as_view(), {'router': router, 'url_prefix':'/api'}, name='rest-api'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls))
)