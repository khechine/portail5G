from django.contrib import admin
from django.utils.html import format_html
from .models import (
    HomePage, SiteConfig, HeroSlide, TrustItem, ServiceItem,
    PlanGroup, PlanCard, SpecRow, StepItem, FaqItem,
    TestimonialItem, NewsItem
)


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('order', 'badge', 'title', 'btn_primary_label')
    list_editable = ('order',)
    search_fields = ('badge', 'title', 'text')


@admin.register(TrustItem)
class TrustItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'value', 'label')
    list_editable = ('order',)


@admin.register(ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'icon', 'title', 'description')
    list_editable = ('order',)


class PlanCardInline(admin.TabularInline):
    model = PlanCard
    extra = 1


@admin.register(PlanGroup)
class PlanGroupAdmin(admin.ModelAdmin):
    list_display = ('order', 'name')
    list_editable = ('order',)
    inlines = [PlanCardInline]


@admin.register(PlanCard)
class PlanCardAdmin(admin.ModelAdmin):
    list_display = ('order', 'group', 'title', 'speed', 'price', 'badge', 'recommended')
    list_filter = ('group', 'recommended')
    list_editable = ('order', 'price', 'recommended')


@admin.register(SpecRow)
class SpecRowAdmin(admin.ModelAdmin):
    list_display = ('order', 'label', 'value', 'highlight')
    list_editable = ('order', 'highlight')


@admin.register(StepItem)
class StepItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'description')
    list_editable = ('order',)


@admin.register(FaqItem)
class FaqItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'question')
    list_editable = ('order',)
    search_fields = ('question', 'answer')


@admin.register(TestimonialItem)
class TestimonialItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'author', 'role', 'rating')
    list_editable = ('order', 'rating')


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'date')
    list_editable = ('order',)


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ('locale', 'meta_title', 'updated_at')
    list_display_links = ('locale', 'meta_title')
    readonly_fields = ('updated_at', 'created_at')
    filter_horizontal = (
        'hero_slides', 'trust_items', 'services_items',
        'plans_groups', 'specs_rows', 'steps_items',
        'faq_items', 'testimonials_items', 'news_items',
    )
    fieldsets = (
        ('Méta & Langue', {
            'fields': ('locale', 'meta_title', 'meta_description')
        }),
        ('1. Hero Slider', {
            'fields': ('hero_enabled', 'hero_slides')
        }),
        ('2. Bandeau Confiance', {
            'fields': ('trust_enabled', 'trust_items')
        }),
        ('3. Section À propos', {
            'fields': (
                'about_enabled', 'about_tagline', 'about_title',
                'about_title_highlight', 'about_text', 'about_image',
                'about_button_label', 'about_button_url', 'about_features',
            )
        }),
        ('4. Section Services', {
            'fields': (
                'services_enabled', 'services_tagline', 'services_title',
                'services_title_highlight', 'services_subtitle', 'services_items',
            )
        }),
        ('5. Section Offres & Tarifs', {
            'fields': (
                'plans_enabled', 'plans_tagline', 'plans_title',
                'plans_title_highlight', 'plans_subtitle', 'plans_note', 'plans_groups',
            )
        }),
        ('6. Fiche Technique (Specs)', {
            'fields': (
                'specs_enabled', 'specs_tagline', 'specs_title',
                'specs_title_highlight', 'specs_image', 'specs_rows',
            )
        }),
        ('7. Étapes de mise en marche', {
            'fields': (
                'steps_enabled', 'steps_tagline', 'steps_title',
                'steps_title_highlight', 'steps_help_title', 'steps_help_text', 'steps_items',
            )
        }),
        ('8. Questions Fréquentes (FAQ)', {
            'fields': (
                'faq_enabled', 'faq_tagline', 'faq_title',
                'faq_title_highlight', 'faq_items',
            )
        }),
        ('9. Avis clients', {
            'fields': (
                'testimonials_enabled', 'testimonials_tagline', 'testimonials_title',
                'testimonials_title_highlight', 'testimonials_items',
            )
        }),
        ('10. Actualités', {
            'fields': (
                'news_enabled', 'news_tagline', 'news_title',
                'news_title_highlight', 'news_items',
            )
        }),
        ('11. Call To Action (CTA)', {
            'fields': (
                'cta_enabled', 'cta_title', 'cta_subtitle',
                'cta_background', 'cta_btn_label', 'cta_btn_url',
                'cta_btn_secondary_label', 'cta_btn_secondary_url',
            )
        }),
        ('Sections JSON (Fallback / Legacy)', {
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
    fieldsets = (
        ('Langue & Nom', {
            'fields': ('locale', 'site_name', 'logo', 'logo_preview', 'favicon', 'favicon_preview')
        }),
        ('Couleurs & Charte', {
            'fields': (
                'primary_color', 'primary_dark', 'heading_color',
                'text_color', 'light_bg', 'border_color', 'dark_bg',
            )
        }),
        ('Typographies', {
            'fields': ('body_font', 'heading_font', 'arabic_font')
        }),
        ('Coordonnées', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Topbar & Header', {
            'fields': ('topbar_left', 'cta_label', 'cta_url', 'lang_label')
        }),
        ('Footer', {
            'fields': ('footer_about', 'copyright')
        }),
        ('Listes (JSON)', {
            'fields': ('nav_items', 'socials', 'footer_columns', 'legal_links')
        }),
    )

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
