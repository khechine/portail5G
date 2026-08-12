from rest_framework import serializers
from .models import HomePage, SiteConfig
from django.conf import settings


def _media_url(request, path):
    """Build absolute media URL."""
    if not path:
        return ''
    if path.startswith('http'):
        return path
    url = f"{settings.MEDIA_URL}{path}".replace('//', '/')
    if request:
        return request.build_absolute_uri(url)
    return url


class SiteConfigSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteConfig
        exclude = ['created_at']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        return _media_url(request, str(obj.logo) if obj.logo else '')

    def get_favicon_url(self, obj):
        request = self.context.get('request')
        return _media_url(request, str(obj.favicon) if obj.favicon else '')


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        exclude = ['created_at']
