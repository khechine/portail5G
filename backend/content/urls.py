from django.urls import path
from .views import HomePageView, SiteConfigView, MediaUploadView

urlpatterns = [
    path('home-page', HomePageView.as_view(), name='home-page'),
    path('home-page/', HomePageView.as_view(), name='home-page-slash'),
    path('site-config', SiteConfigView.as_view(), name='site-config'),
    path('site-config/', SiteConfigView.as_view(), name='site-config-slash'),
    path('media/upload/', MediaUploadView.as_view(), name='media-upload'),
]
