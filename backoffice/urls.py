from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from rest2backbone.forms import FormFactory
from rest2backbone.resources import IndexedRouter
from rest2backbone.views import restApi
from crm import views


router = IndexedRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'contacts', views.ContactViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^/?$', TemplateView.as_view(template_name='crm/index.html'), {'forms': FormFactory(router)}, name='index'),
    url(r'^api/', include(router.urls)),
    url(r'^js-locale/(?P<packages>\S+?)/?$', 'django.views.i18n.javascript_catalog'),
    url(r'^js-restAPI/?$', restApi.as_view(), {'router': router, 'url_prefix':'/api'}, name='rest-api'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)