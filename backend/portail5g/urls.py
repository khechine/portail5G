"""URL configuration for portail5g project."""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Django native admin (accessible via /django-admin/)
    path('django-admin/', admin.site.urls),

    # JWT Auth
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # API apps
    path('api/', include('content.urls')),
    path('api/', include('leads.urls')),
]

# Serve media files (Gunicorn fallback when Nginx proxies /media/ to backend)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
