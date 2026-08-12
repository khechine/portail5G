from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import HomePage, SiteConfig
from .serializers import HomePageSerializer, SiteConfigSerializer


def _strapi_response(data):
    """
    Wrap data in { data: {...} } to stay compatible with the
    existing Express/EJS lib/strapi.js which expects Strapi's response shape.
    """
    return {'data': data}


class HomePageView(APIView):
    """
    GET  /api/home-page/?locale=fr   → retourne la page d'accueil
    PUT  /api/home-page/?locale=fr   → met à jour (admin uniquement)
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'POST'):
            return [IsAuthenticated()]
        return []

    def get(self, request):
        locale = request.query_params.get('locale', 'fr')
        try:
            obj = HomePage.objects.get(locale=locale)
        except HomePage.DoesNotExist:
            # Fallback to FR if locale not found
            try:
                obj = HomePage.objects.get(locale='fr')
            except HomePage.DoesNotExist:
                return Response({'data': None}, status=status.HTTP_404_NOT_FOUND)

        serializer = HomePageSerializer(obj, context={'request': request})
        return Response(_strapi_response(serializer.data))

    def put(self, request):
        locale = request.query_params.get('locale', 'fr')
        obj, _ = HomePage.objects.get_or_create(locale=locale)
        serializer = HomePageSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(_strapi_response(serializer.data))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteConfigView(APIView):
    """
    GET  /api/site-config/?locale=fr   → retourne la config du site
    PUT  /api/site-config/?locale=fr   → met à jour (admin uniquement)
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'POST'):
            return [IsAuthenticated()]
        return []

    def get(self, request):
        locale = request.query_params.get('locale', 'fr')
        try:
            obj = SiteConfig.objects.get(locale=locale)
        except SiteConfig.DoesNotExist:
            try:
                obj = SiteConfig.objects.get(locale='fr')
            except SiteConfig.DoesNotExist:
                return Response({'data': None}, status=status.HTTP_404_NOT_FOUND)

        serializer = SiteConfigSerializer(obj, context={'request': request})
        return Response(_strapi_response(serializer.data))

    def put(self, request):
        locale = request.query_params.get('locale', 'fr')
        obj, _ = SiteConfig.objects.get_or_create(locale=locale)
        serializer = SiteConfigSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(_strapi_response(serializer.data))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MediaUploadView(APIView):
    """
    POST /api/media/upload/  → upload d'image, retourne l'URL
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        from django.core.files.storage import default_storage
        from django.conf import settings
        import os

        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Sanitize filename
        name = file.name.replace(' ', '_')
        path = default_storage.save(f'uploads/{name}', file)
        url = request.build_absolute_uri(f"{settings.MEDIA_URL}{path}")
        return Response({'url': url, 'path': path})
