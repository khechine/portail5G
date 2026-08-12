from django.db import models


class HomePage(models.Model):
    """
    Équivalent du Single Type Strapi 'home-page'.
    Une ligne par locale (fr / ar).
    Les sections (hero, plans, FAQ, etc.) sont stockées en JSONField
    avec la même structure que le seed.js Strapi.
    """
    LOCALE_CHOICES = [('fr', 'Français'), ('ar', 'عربي')]

    locale = models.CharField(max_length=5, unique=True, choices=LOCALE_CHOICES)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    # Sections — même structure JSON que dans seed.js
    hero = models.JSONField(default=dict, blank=True)
    trust = models.JSONField(default=dict, blank=True)
    about = models.JSONField(default=dict, blank=True)
    services = models.JSONField(default=dict, blank=True)
    plans = models.JSONField(default=dict, blank=True)
    specs = models.JSONField(default=dict, blank=True)
    steps = models.JSONField(default=dict, blank=True)
    faq = models.JSONField(default=dict, blank=True)
    testimonials = models.JSONField(default=dict, blank=True)
    news = models.JSONField(default=dict, blank=True)
    cta = models.JSONField(default=dict, blank=True)
    order = models.JSONField(default=dict, blank=True)
    newsletter = models.JSONField(default=dict, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Page d'accueil"
        verbose_name_plural = "Pages d'accueil"

    def __str__(self):
        return f'HomePage ({self.locale})'


class SiteConfig(models.Model):
    """
    Équivalent du Single Type Strapi 'site-config'.
    Une ligne par locale (fr / ar).
    """
    LOCALE_CHOICES = [('fr', 'Français'), ('ar', 'عربي')]

    locale = models.CharField(max_length=5, unique=True, choices=LOCALE_CHOICES)

    # Identité
    site_name = models.CharField(max_length=100, blank=True)
    logo = models.ImageField(upload_to='config/', blank=True, null=True)
    favicon = models.FileField(upload_to='config/', blank=True, null=True)

    # Couleurs (non-localisées, même valeur FR/AR)
    primary_color = models.CharField(max_length=20, default='#FFA502')
    primary_dark = models.CharField(max_length=20, default='#e08e00')
    heading_color = models.CharField(max_length=20, default='#251444')
    text_color = models.CharField(max_length=20, default='#737177')
    light_bg = models.CharField(max_length=20, default='#F7F5F1')
    border_color = models.CharField(max_length=20, default='#E6E2D9')
    dark_bg = models.CharField(max_length=20, default='#251444')

    # Typographie
    body_font = models.CharField(max_length=100, default='Outfit')
    heading_font = models.CharField(max_length=100, default='Outfit')
    arabic_font = models.CharField(max_length=100, default='Cairo')

    # Coordonnées
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)

    # Topbar & nav
    topbar_left = models.CharField(max_length=255, blank=True)
    cta_label = models.CharField(max_length=100, blank=True)
    cta_url = models.CharField(max_length=255, blank=True)
    lang_label = models.CharField(max_length=50, blank=True)

    # Footer
    footer_about = models.TextField(blank=True)
    copyright = models.CharField(max_length=255, blank=True)

    # Répétables — stockés en JSON
    nav_items = models.JSONField(default=list, blank=True)
    socials = models.JSONField(default=list, blank=True)
    footer_columns = models.JSONField(default=list, blank=True)
    legal_links = models.JSONField(default=list, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Configuration du site'
        verbose_name_plural = 'Configurations du site'

    def __str__(self):
        return f'SiteConfig ({self.locale})'
