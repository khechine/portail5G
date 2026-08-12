from rest_framework import serializers
from .models import (
    HomePage, SiteConfig,
    HeroSlide, TrustItem, ServiceItem,
    PlanGroup, PlanCard, SpecRow, StepItem, FaqItem,
    TestimonialItem, NewsItem,
)
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

    def to_representation(self, instance):
        """
        Override to merge explicit model data (with image URLs) into the
        legacy JSON fields expected by the Express/EJS frontend.
        """
        request = self.context.get('request')
        data = super().to_representation(instance)

        def media(img_field):
            return _media_url(request, str(img_field) if img_field else '')

        # ── Hero slides ──────────────────────────────────────────────────────
        slides = instance.hero_slides.order_by('order')
        if slides.exists():
            slides_data = [
                {
                    'badge': s.badge,
                    'title': s.title,
                    'titleHighlight': s.title_highlight,
                    'text': s.text,
                    'image': {'url': media(s.image)} if s.image else None,
                    'btnPrimaryLabel': s.btn_primary_label,
                    'btnPrimaryUrl': s.btn_primary_url,
                    'btnSecondaryLabel': s.btn_secondary_label,
                    'btnSecondaryUrl': s.btn_secondary_url,
                }
                for s in slides
            ]
            data['hero'] = {**data.get('hero', {}), 'slides': slides_data, 'enabled': instance.hero_enabled}

        # ── Trust items ──────────────────────────────────────────────────────
        trust_qs = instance.trust_items.order_by('order')
        if trust_qs.exists():
            data['trust'] = {
                **data.get('trust', {}),
                'enabled': instance.trust_enabled,
                'items': [{'value': t.value, 'label': t.label} for t in trust_qs],
            }

        # ── About (scalar fields) ────────────────────────────────────────────
        if instance.about_title or instance.about_text:
            data['about'] = {
                **data.get('about', {}),
                'enabled': instance.about_enabled,
                'tagline': instance.about_tagline,
                'title': instance.about_title,
                'titleHighlight': instance.about_title_highlight,
                'text': instance.about_text,
                'features': instance.about_features,
                'buttonLabel': instance.about_button_label,
                'buttonUrl': instance.about_button_url,
                'image': {'url': media(instance.about_image)} if instance.about_image else None,
            }

        # ── Services ─────────────────────────────────────────────────────────
        services_qs = instance.services_items.order_by('order')
        if services_qs.exists() or instance.services_title:
            data['services'] = {
                **data.get('services', {}),
                'enabled': instance.services_enabled,
                'tagline': instance.services_tagline,
                'title': instance.services_title,
                'titleHighlight': instance.services_title_highlight,
                'subtitle': instance.services_subtitle,
                'items': [
                    {
                        'icon': s.icon,
                        'title': s.title,
                        'description': s.description,
                        'features': s.features,
                    }
                    for s in services_qs
                ],
            }

        # ── Plans ─────────────────────────────────────────────────────────────
        plans_qs = instance.plans_groups.order_by('order')
        if plans_qs.exists() or instance.plans_title:
            groups_data = []
            for grp in plans_qs:
                cards_data = [
                    {
                        'speed': c.speed,
                        'speedUnit': c.speed_unit,
                        'speedLabel': c.speed_label,
                        'title': c.title,
                        'price': c.price,
                        'currency': c.currency,
                        'period': c.period,
                        'badge': c.badge,
                        'recommended': c.recommended,
                        'features': c.features,
                        'buttonLabel': c.button_label,
                        'buttonUrl': c.button_url,
                        'image': {'url': media(c.image)} if c.image else None,
                    }
                    for c in grp.cards.order_by('order')
                ]
                groups_data.append({'name': grp.name, 'cards': cards_data})

            data['plans'] = {
                **data.get('plans', {}),
                'enabled': instance.plans_enabled,
                'tagline': instance.plans_tagline,
                'title': instance.plans_title,
                'titleHighlight': instance.plans_title_highlight,
                'subtitle': instance.plans_subtitle,
                'note': instance.plans_note,
                'groups': groups_data,
            }

        # ── Specs ─────────────────────────────────────────────────────────────
        specs_qs = instance.specs_rows.order_by('order')
        if specs_qs.exists() or instance.specs_title:
            data['specs'] = {
                **data.get('specs', {}),
                'enabled': instance.specs_enabled,
                'tagline': instance.specs_tagline,
                'title': instance.specs_title,
                'titleHighlight': instance.specs_title_highlight,
                'image': {'url': media(instance.specs_image)} if instance.specs_image else None,
                'rows': [
                    {'label': r.label, 'value': r.value, 'highlight': r.highlight}
                    for r in specs_qs
                ],
            }

        # ── Steps ─────────────────────────────────────────────────────────────
        steps_qs = instance.steps_items.order_by('order')
        if steps_qs.exists() or instance.steps_title:
            data['steps'] = {
                **data.get('steps', {}),
                'enabled': instance.steps_enabled,
                'tagline': instance.steps_tagline,
                'title': instance.steps_title,
                'titleHighlight': instance.steps_title_highlight,
                'helpTitle': instance.steps_help_title,
                'helpText': instance.steps_help_text,
                'steps': [
                    {'title': s.title, 'description': s.description}
                    for s in steps_qs
                ],
            }

        # ── FAQ ───────────────────────────────────────────────────────────────
        faq_qs = instance.faq_items.order_by('order')
        if faq_qs.exists() or instance.faq_title:
            data['faq'] = {
                **data.get('faq', {}),
                'enabled': instance.faq_enabled,
                'tagline': instance.faq_tagline,
                'title': instance.faq_title,
                'titleHighlight': instance.faq_title_highlight,
                'items': [
                    {'question': f.question, 'answer': f.answer}
                    for f in faq_qs
                ],
            }

        # ── Testimonials ──────────────────────────────────────────────────────
        testimonials_qs = instance.testimonials_items.order_by('order')
        if testimonials_qs.exists() or instance.testimonials_title:
            data['testimonials'] = {
                **data.get('testimonials', {}),
                'enabled': instance.testimonials_enabled,
                'tagline': instance.testimonials_tagline,
                'title': instance.testimonials_title,
                'titleHighlight': instance.testimonials_title_highlight,
                'items': [
                    {
                        'author': t.author,
                        'role': t.role,
                        'quote': t.quote,
                        'rating': t.rating,
                        'avatar': {'url': media(t.avatar)} if t.avatar else None,
                    }
                    for t in testimonials_qs
                ],
            }

        # ── News ──────────────────────────────────────────────────────────────
        news_qs = instance.news_items.order_by('order')
        if news_qs.exists() or instance.news_title:
            data['news'] = {
                **data.get('news', {}),
                'enabled': instance.news_enabled,
                'tagline': instance.news_tagline,
                'title': instance.news_title,
                'titleHighlight': instance.news_title_highlight,
                'items': [
                    {
                        'title': n.title,
                        'excerpt': n.excerpt,
                        'date': n.date,
                        'link': n.link,
                        'image': {'url': media(n.image)} if n.image else None,
                    }
                    for n in news_qs
                ],
            }

        # ── CTA ───────────────────────────────────────────────────────────────
        if instance.cta_title or instance.cta_btn_label:
            data['cta'] = {
                **data.get('cta', {}),
                'enabled': instance.cta_enabled,
                'title': instance.cta_title,
                'subtitle': instance.cta_subtitle,
                'btnLabel': instance.cta_btn_label,
                'btnUrl': instance.cta_btn_url,
                'btnSecondaryLabel': instance.cta_btn_secondary_label,
                'btnSecondaryUrl': instance.cta_btn_secondary_url,
                'background': {'url': media(instance.cta_background)} if instance.cta_background else None,
            }

        return data
