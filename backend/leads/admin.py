from django.contrib import admin
from django.utils.html import format_html
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'firstname', 'lastname', 'phone',
        'governorate', 'plan', 'locale', 'created_at',
    )
    list_filter = ('locale', 'plan', 'governorate', 'existing_subscriber')
    search_fields = ('firstname', 'lastname', 'phone', 'address')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 50
