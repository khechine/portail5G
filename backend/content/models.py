from django.db import models


class HeroSlide(models.Model):
    badge = models.CharField(max_length=200, blank=True, verbose_name="Badge")
    title = models.TextField(blank=True, verbose_name="Titre principal")
    title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Titre surbrillance")
    text = models.TextField(blank=True, verbose_name="Texte descriptif")
    image = models.ImageField(upload_to='hero/', blank=True, null=True, verbose_name="Image du slide")
    btn_primary_label = models.CharField(max_length=100, blank=True, verbose_name="Libellé Bouton 1")
    btn_primary_url = models.CharField(max_length=255, blank=True, verbose_name="URL Bouton 1")
    btn_secondary_label = models.CharField(max_length=100, blank=True, verbose_name="Libellé Bouton 2")
    btn_secondary_url = models.CharField(max_length=255, blank=True, verbose_name="URL Bouton 2")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Slide Hero"
        verbose_name_plural = "Hero - Slides (Bannières)"

    def __str__(self):
        return f"Slide #{self.order + 1} - {self.badge or self.title[:30]}"


class TrustItem(models.Model):
    value = models.CharField(max_length=100, verbose_name="Valeur / Stat (ex: 5G + 4G)")
    label = models.CharField(max_length=100, verbose_name="Libellé (ex: Réseau hybride)")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Élément de confiance"
        verbose_name_plural = "Bandeau Confiance (Stats)"

    def __str__(self):
        return f"{self.value} - {self.label}"


class ServiceItem(models.Model):
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône / Emoji")
    title = models.CharField(max_length=200, verbose_name="Titre du service")
    description = models.TextField(blank=True, verbose_name="Description")
    features = models.JSONField(default=list, blank=True, verbose_name="Liste des points (ex: [{\"text\": \"...\"}])")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Service / Usage"
        verbose_name_plural = "Services - Cartes usages"

    def __str__(self):
        return self.title


class PlanGroup(models.Model):
    name = models.CharField(max_length=50, verbose_name="Nom de l'onglet (ex: 30M, 50M)")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Groupe d'offres"
        verbose_name_plural = "Offres - Onglets (30M, 50M, 100M)"

    def __str__(self):
        return f"Onglet {self.name}"


class PlanCard(models.Model):
    group = models.ForeignKey(PlanGroup, related_name='cards', on_delete=models.CASCADE)
    speed = models.CharField(max_length=50, verbose_name="Débit (ex: 50)")
    speed_unit = models.CharField(max_length=20, default='M', verbose_name="Unité débit")
    speed_label = models.CharField(max_length=100, default='Débit descendant', verbose_name="Libellé débit")
    title = models.CharField(max_length=200, verbose_name="Nom du forfait (ex: Famille connectée)")
    price = models.CharField(max_length=50, verbose_name="Prix (ex: 69.9)")
    currency = models.CharField(max_length=20, default='DT', verbose_name="Devise")
    period = models.CharField(max_length=100, default='/ mois · 24 mois', verbose_name="Période")
    badge = models.CharField(max_length=100, blank=True, verbose_name="Badge (ex: ⭐ Recommandé)")
    recommended = models.BooleanField(default=False, verbose_name="Recommandé ?")
    image = models.ImageField(upload_to='plans/', blank=True, null=True, verbose_name="Image forfait")
    button_label = models.CharField(max_length=100, default='Commander', verbose_name="Libellé Bouton")
    button_url = models.CharField(max_length=255, default='#commander', verbose_name="URL Bouton")
    features = models.JSONField(default=list, blank=True, verbose_name="Caractéristiques")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Carte d'offre"
        verbose_name_plural = "Offres - Cartes de tarifs"

    def __str__(self):
        return f"{self.title} ({self.speed}{self.speed_unit} - {self.price} {self.currency})"


class SpecRow(models.Model):
    label = models.CharField(max_length=150, verbose_name="Libellé spécification")
    value = models.CharField(max_length=200, verbose_name="Valeur")
    highlight = models.BooleanField(default=False, verbose_name="Mettre en valeur ?")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Ligne spécification"
        verbose_name_plural = "Fiche technique - Lignes"

    def __str__(self):
        return f"{self.label}: {self.value}"


class StepItem(models.Model):
    title = models.CharField(max_length=200, verbose_name="Titre étape")
    description = models.TextField(blank=True, verbose_name="Description étape")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Étape de mise en marche"
        verbose_name_plural = "Étapes de mise en marche"

    def __str__(self):
        return f"Étape {self.order + 1}: {self.title}"


class FaqItem(models.Model):
    question = models.CharField(max_length=300, verbose_name="Question")
    answer = models.TextField(verbose_name="Réponse")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Question / Réponse FAQ"
        verbose_name_plural = "FAQ - Questions / Réponses"

    def __str__(self):
        return self.question


class TestimonialItem(models.Model):
    quote = models.TextField(verbose_name="Citation / Avis")
    author = models.CharField(max_length=150, verbose_name="Nom client")
    role = models.CharField(max_length=150, blank=True, verbose_name="Statut / Offre souscrite")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Photo client")
    rating = models.PositiveIntegerField(default=5, verbose_name="Note (1 à 5)")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Avis client"
        verbose_name_plural = "Témoignages / Avis clients"

    def __str__(self):
        return f"{self.author} ({self.rating}★)"


class NewsItem(models.Model):
    title = models.CharField(max_length=255, verbose_name="Titre article")
    excerpt = models.TextField(blank=True, verbose_name="Extrait / Résumé")
    date = models.CharField(max_length=100, blank=True, verbose_name="Date d'affichage")
    image = models.ImageField(upload_to='news/', blank=True, null=True, verbose_name="Image article")
    link = models.CharField(max_length=255, default='#', verbose_name="Lien vers article")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Actualité / Article"
        verbose_name_plural = "Actualités / Nouveautés"

    def __str__(self):
        return self.title


class HomePage(models.Model):
    """
    Page d'accueil : champs scalaires explicites + relations Django.
    """
    LOCALE_CHOICES = [('fr', 'Français'), ('ar', 'عربي')]

    locale = models.CharField(max_length=5, unique=True, choices=LOCALE_CHOICES)
    meta_title = models.CharField(max_length=200, blank=True, verbose_name="Méta Titre SEO")
    meta_description = models.TextField(blank=True, verbose_name="Méta Description SEO")

    # Sections actives / désactivées
    hero_enabled = models.BooleanField(default=True, verbose_name="Hero Slider activé ?")

    trust_enabled = models.BooleanField(default=True, verbose_name="Bandeau Confiance activé ?")
    trust_items = models.ManyToManyField(TrustItem, blank=True, verbose_name="Stats de confiance")

    hero_slides = models.ManyToManyField(HeroSlide, blank=True, verbose_name="Slides du Hero")

    # Section À propos
    about_enabled = models.BooleanField(default=True, verbose_name="Section À propos activée ?")
    about_tagline = models.CharField(max_length=150, blank=True, verbose_name="À propos - Tagline / Surtitre")
    about_title = models.CharField(max_length=200, blank=True, verbose_name="À propos - Titre principal")
    about_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="À propos - Titre surbrillance")
    about_text = models.TextField(blank=True, verbose_name="À propos - Texte de présentation")
    about_image = models.ImageField(upload_to='about/', blank=True, null=True, verbose_name="À propos - Image")
    about_button_label = models.CharField(max_length=100, blank=True, verbose_name="À propos - Libellé Bouton")
    about_button_url = models.CharField(max_length=255, blank=True, verbose_name="À propos - URL Bouton")
    about_features = models.JSONField(default=list, blank=True, verbose_name="À propos - Caractéristiques")

    # Section Services
    services_enabled = models.BooleanField(default=True, verbose_name="Section Services activée ?")
    services_tagline = models.CharField(max_length=150, blank=True, verbose_name="Services - Tagline")
    services_title = models.CharField(max_length=200, blank=True, verbose_name="Services - Titre")
    services_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Services - Titre surbrillance")
    services_subtitle = models.TextField(blank=True, verbose_name="Services - Sous-titre")
    services_items = models.ManyToManyField(ServiceItem, blank=True, verbose_name="Cartes de service")

    # Section Offres & Tarifs
    plans_enabled = models.BooleanField(default=True, verbose_name="Section Offres activée ?")
    plans_tagline = models.CharField(max_length=150, blank=True, verbose_name="Offres - Tagline")
    plans_title = models.CharField(max_length=200, blank=True, verbose_name="Offres - Titre principal")
    plans_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Offres - Titre surbrillance")
    plans_subtitle = models.TextField(blank=True, verbose_name="Offres - Sous-titre")
    plans_note = models.TextField(blank=True, verbose_name="Offres - Note de bas de page")
    plans_groups = models.ManyToManyField(PlanGroup, blank=True, verbose_name="Onglets d'offres")

    # Section Fiche Technique
    specs_enabled = models.BooleanField(default=True, verbose_name="Section Fiche Technique activée ?")
    specs_tagline = models.CharField(max_length=150, blank=True, verbose_name="Specs - Tagline")
    specs_title = models.CharField(max_length=200, blank=True, verbose_name="Specs - Titre")
    specs_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Specs - Titre surbrillance")
    specs_image = models.ImageField(upload_to='specs/', blank=True, null=True, verbose_name="Specs - Image du routeur")
    specs_rows = models.ManyToManyField(SpecRow, blank=True, verbose_name="Lignes de spécifications")

    # Section Étapes de mise en marche
    steps_enabled = models.BooleanField(default=True, verbose_name="Section Étapes activée ?")
    steps_tagline = models.CharField(max_length=150, blank=True, verbose_name="Étapes - Tagline")
    steps_title = models.CharField(max_length=200, blank=True, verbose_name="Étapes - Titre")
    steps_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Étapes - Titre surbrillance")
    steps_help_title = models.CharField(max_length=200, blank=True, verbose_name="Étapes - Titre encadré aide")
    steps_help_text = models.TextField(blank=True, verbose_name="Étapes - Texte encadré aide")
    steps_items = models.ManyToManyField(StepItem, blank=True, verbose_name="Liste des étapes")

    # Section FAQ
    faq_enabled = models.BooleanField(default=True, verbose_name="Section FAQ activée ?")
    faq_tagline = models.CharField(max_length=150, blank=True, verbose_name="FAQ - Tagline")
    faq_title = models.CharField(max_length=200, blank=True, verbose_name="FAQ - Titre")
    faq_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="FAQ - Titre surbrillance")
    faq_items = models.ManyToManyField(FaqItem, blank=True, verbose_name="Questions / Réponses")

    # Section Témoignages
    testimonials_enabled = models.BooleanField(default=True, verbose_name="Section Avis activée ?")
    testimonials_tagline = models.CharField(max_length=150, blank=True, verbose_name="Avis - Tagline")
    testimonials_title = models.CharField(max_length=200, blank=True, verbose_name="Avis - Titre")
    testimonials_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Avis - Titre surbrillance")
    testimonials_items = models.ManyToManyField(TestimonialItem, blank=True, verbose_name="Liste des avis")

    # Section Actualités
    news_enabled = models.BooleanField(default=True, verbose_name="Section Actualités activée ?")
    news_tagline = models.CharField(max_length=150, blank=True, verbose_name="Actualités - Tagline")
    news_title = models.CharField(max_length=200, blank=True, verbose_name="Actualités - Titre")
    news_title_highlight = models.CharField(max_length=200, blank=True, verbose_name="Actualités - Titre surbrillance")
    news_items = models.ManyToManyField(NewsItem, blank=True, verbose_name="Articles d'actualité")

    # Section CTA (Call to action final)
    cta_enabled = models.BooleanField(default=True, verbose_name="Section CTA activée ?")
    cta_title = models.CharField(max_length=200, blank=True, verbose_name="CTA - Titre principal")
    cta_subtitle = models.TextField(blank=True, verbose_name="CTA - Sous-titre")
    cta_background = models.ImageField(upload_to='cta/', blank=True, null=True, verbose_name="CTA - Image de fond")
    cta_btn_label = models.CharField(max_length=100, blank=True, verbose_name="CTA - Libellé Bouton 1")
    cta_btn_url = models.CharField(max_length=255, blank=True, verbose_name="CTA - URL Bouton 1")
    cta_btn_secondary_label = models.CharField(max_length=100, blank=True, verbose_name="CTA - Libellé Bouton 2")
    cta_btn_secondary_url = models.CharField(max_length=255, blank=True, verbose_name="CTA - URL Bouton 2")

    # JSON fallback pour compatibilité des données complexes non-altérées
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
    Configuration globale du site avec champs explicites dans Django Admin.
    """
    LOCALE_CHOICES = [('fr', 'Français'), ('ar', 'عربي')]

    locale = models.CharField(max_length=5, unique=True, choices=LOCALE_CHOICES)

    # Identité
    site_name = models.CharField(max_length=100, blank=True, verbose_name="Nom du site")
    logo = models.ImageField(upload_to='config/', blank=True, null=True, verbose_name="Logo")
    favicon = models.FileField(upload_to='config/', blank=True, null=True, verbose_name="Favicon")

    # Couleurs
    primary_color = models.CharField(max_length=20, default='#FFA502', verbose_name="Couleur principale (boutons, accents)")
    primary_dark = models.CharField(max_length=20, default='#e08e00', verbose_name="Couleur principale sombre (hover)")
    em_color = models.CharField(max_length=20, default='#FFA502', verbose_name="Couleur des <em> dans les titres (h2 em, .section__title em)")
    heading_color = models.CharField(max_length=20, default='#251444', verbose_name="Couleur des titres (h1, h2, h3…)")
    text_color = models.CharField(max_length=20, default='#737177', verbose_name="Couleur du texte courant")
    light_bg = models.CharField(max_length=20, default='#F7F5F1', verbose_name="Fond clair (sections alternées)")
    border_color = models.CharField(max_length=20, default='#E6E2D9', verbose_name="Couleur des bordures")
    dark_bg = models.CharField(max_length=20, default='#251444', verbose_name="Fond sombre (header, footer, topbar)")

    # Typographie
    body_font = models.CharField(max_length=100, default='Outfit', verbose_name="Police du corps")
    heading_font = models.CharField(max_length=100, default='Outfit', verbose_name="Police des titres")
    arabic_font = models.CharField(max_length=100, default='Cairo', verbose_name="Police arabe")

    # Coordonnées
    phone = models.CharField(max_length=30, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email de contact")
    address = models.CharField(max_length=255, blank=True, verbose_name="Adresse postale")

    # Topbar & nav
    topbar_left = models.CharField(max_length=255, blank=True, verbose_name="Texte topbar gauche")
    cta_label = models.CharField(max_length=100, blank=True, verbose_name="Header - Libellé Bouton")
    cta_url = models.CharField(max_length=255, blank=True, verbose_name="Header - URL Bouton")
    lang_label = models.CharField(max_length=50, blank=True, verbose_name="Libellé sélecteur de langue")

    # Footer
    footer_about = models.TextField(blank=True, verbose_name="Footer - Texte à propos")
    copyright = models.CharField(max_length=255, blank=True, verbose_name="Copyright")

    # Stockage JSON pour éléments répétables
    nav_items = models.JSONField(default=list, blank=True, verbose_name="Liens de navigation")
    socials = models.JSONField(default=list, blank=True, verbose_name="Réseaux sociaux")
    footer_columns = models.JSONField(default=list, blank=True, verbose_name="Colonnes du footer")
    legal_links = models.JSONField(default=list, blank=True, verbose_name="Liens légaux")

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Configuration du site'
        verbose_name_plural = 'Configurations du site'

    def __str__(self):
        return f'SiteConfig ({self.locale})'
