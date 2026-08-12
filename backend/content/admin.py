from django.contrib import admin
from django.utils.html import format_html
from .models import HomePage, SiteConfig


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ('locale', 'meta_title', 'updated_at')
    list_display_links = ('locale', 'meta_title')
    readonly_fields = ('updated_at', 'created_at')
    fieldsets = (
        ('Méta', {
            'fields': ('locale', 'meta_title', 'meta_description')
        }),
        ('Sections (JSON)', {
            'classes': ('collapse',),
            'fields': (
                'hero', 'trust', 'about', 'services', 'plans',
                'specs', 'steps', 'faq', 'testimonials', 'news',
                'cta', 'order', 'newsletter',
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = ('locale', 'site_name', 'phone', 'updated_at')
    readonly_fields = ('updated_at', 'created_at', 'logo_preview', 'favicon_preview')

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" height="40" />', obj.logo.url)
        return '—'
    logo_preview.short_description = 'Aperçu logo'

    def favicon_preview(self, obj):
        if obj.favicon:
            return format_html('<img src="{}" height="20" />', obj.favicon.url)
        return '—'
    favicon_preview.short_description = 'Aperçu favicon'
