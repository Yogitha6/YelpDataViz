from django.conf.urls import url

from . import views

urlpatterns = [
        url(r'^$', views.index, name='index'),
		url(r'^selectCity/(?P<cityname>[-\.\w]+)/', views.selectCity, name='selectCity')
]