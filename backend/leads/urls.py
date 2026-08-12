from django.urls import path
from .views import LeadCreateView, LeadListView, LeadDetailView

urlpatterns = [
    path('leads/', LeadCreateView.as_view(), name='lead-create'),
    path('leads/list/', LeadListView.as_view(), name='lead-list'),
    path('leads/<int:pk>/', LeadDetailView.as_view(), name='lead-detail'),
]
