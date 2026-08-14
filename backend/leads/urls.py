from django.urls import path
from .views import LeadCreateView, LeadListView, LeadDetailView

urlpatterns = [
    path('leads/', LeadCreateView.as_view(), name='lead-create'),
    path('leads', LeadCreateView.as_view(), name='lead-create-noslash'),
    path('order/', LeadCreateView.as_view(), name='order-create'),
    path('order', LeadCreateView.as_view(), name='order-create-noslash'),
    path('newsletter/', LeadCreateView.as_view(), name='newsletter-create'),
    path('newsletter', LeadCreateView.as_view(), name='newsletter-create-noslash'),
    path('leads/list/', LeadListView.as_view(), name='lead-list'),
    path('leads/<int:pk>/', LeadDetailView.as_view(), name='lead-detail'),
]
