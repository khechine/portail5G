#!/usr/bin/env python
"""
Seed Django — initialise le contenu FR + AR pour la landing page Topnet Box 5G.
Équivalent Python du seed.js Strapi.

Usage :
    python seed/seed.py
    # ou via Docker :
    docker compose run --rm backend python seed/seed.py
"""
import os
import sys
import django

# ── Setup Django ──────────────────────────────────────────────────────────────
# Ajouter le répertoire parent au path Python pour trouver portail5g/settings.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portail5g.settings')
django.setup()

from django.contrib.auth import get_user_model
from content.models import HomePage, SiteConfig

User = get_user_model()

# ── Config ────────────────────────────────────────────────────────────────────
ADMIN_EMAIL = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@topnet.tn')
ADMIN_PASSWORD = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Topnet2026!')
ADMIN_USERNAME = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')

log = print

# ── Gouvernorats ──────────────────────────────────────────────────────────────
GOVERNORATES_FR = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja',
    'Jendouba', 'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Gabès', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
]

GOVERNORATES_AR = [
    'تونس', 'أريانة', 'بن عروس', 'منوبة', 'نابل', 'زغوان', 'بنزرت', 'باجة',
    'جندوبة', 'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 'القيروان',
    'القصرين', 'سيدي بوزيد', 'قابس', 'مدنين', 'تطاوين', 'قفصة', 'توزر', 'قبلي',
]


# ── Helpers ───────────────────────────────────────────────────────────────────
def plan_card(speed, unit, price, title, badge, recommended, perks, period='/ mois · 24 mois'):
    return {
        'speed': speed, 'speedUnit': unit, 'speedLabel': 'Débit descendant',
        'title': title, 'price': price, 'currency': 'DT', 'period': period,
        'badge': badge, 'recommended': recommended,
        'features': [{'text': t} for t in perks],
        'buttonLabel': 'Commander', 'buttonUrl': '#commander',
    }


def plan_card_ar(speed, unit, price, title, badge, recommended, perks, period='/ شهرياً · 24 شهراً'):
    return {
        'speed': speed, 'speedUnit': unit, 'speedLabel': 'سرعة التحميل',
        'title': title, 'price': price, 'currency': 'د.ت', 'period': period,
        'badge': badge, 'recommended': recommended,
        'features': [{'text': t} for t in perks],
        'buttonLabel': 'اطلب', 'buttonUrl': '#commander',
    }


# ── Contenu FR ────────────────────────────────────────────────────────────────
SITE_CONFIG_FR = {
    'locale': 'fr',
    'site_name': 'TOPNET Box 5G',
    'primary_color': '#e2418c',
    'primary_dark': '#c93578',
    'heading_color': '#251444',
    'text_color': '#737177',
    'light_bg': '#F7F5F1',
    'border_color': '#E6E2D9',
    'dark_bg': '#251444',
    'body_font': 'Outfit',
    'heading_font': 'Outfit',
    'arabic_font': 'Cairo',
    'phone': '1120',
    'email': 'commercial@topnet.tn',
    'address': 'Siège Topnet, Centre Urbain Nord, Tunis',
    'topbar_left': 'Service client 7j/7 — Hotline 1120',
    'cta_label': 'Commandez',
    'cta_url': '#commander',
    'lang_label': 'العربية',
    'footer_about': "Leader des fournisseurs d'accès Internet en Tunisie depuis 2001. Plus de 200 000 abonnés, 12 agences nationales.",
    'copyright': '© 2026 Topnet S.A. — Tous droits réservés.',
    'nav_items': [
        {'label': 'Accueil', 'url': '#accueil'},
        {'label': 'À propos', 'url': '#apropos'},
        {'label': 'Offres', 'url': '#offres'},
        {'label': 'FAQ', 'url': '#faq'},
        {'label': 'Contact', 'url': '#commander'},
    ],
    'socials': [
        {'label': 'facebook', 'url': 'https://www.facebook.com/topnet'},
        {'label': 'twitter', 'url': 'https://x.com/topnet'},
        {'label': 'instagram', 'url': 'https://www.instagram.com/topnet'},
        {'label': 'youtube', 'url': 'https://www.youtube.com/@topnet'},
    ],
    'footer_columns': [
        {
            'title': 'Offres',
            'links': [
                {'label': 'Box 5G', 'url': '#offres'},
                {'label': 'ADSL Résidentiel', 'url': '#'},
                {'label': 'Smart Fibre', 'url': '#'},
                {'label': 'Topnet Mobile', 'url': '#'},
                {'label': 'Entreprises', 'url': '#'},
            ],
        },
        {
            'title': 'Support',
            'links': [
                {'label': "Centre d'aide", 'url': '#'},
                {'label': "Vérifier l'éligibilité", 'url': '#'},
                {'label': 'Espace client', 'url': '#'},
                {'label': 'Trouver une agence', 'url': '#'},
                {'label': '1120', 'url': 'tel:1120'},
            ],
        },
        {
            'title': 'Topnet',
            'links': [
                {'label': 'À propos', 'url': '#'},
                {'label': 'Actualités', 'url': '#'},
                {'label': 'Recrutement', 'url': '#'},
                {'label': 'Partenaires', 'url': '#'},
                {'label': 'Mentions légales', 'url': '#'},
            ],
        },
    ],
    'legal_links': [
        {'label': 'Confidentialité', 'url': '#'},
        {'label': 'CGU', 'url': '#'},
        {'label': 'Cookies', 'url': '#'},
    ],
}

HOME_PAGE_FR = {
    'locale': 'fr',
    'meta_title': 'TOPNET Box 5G — Internet Ultra-rapide sans fil',
    'meta_description': "Commandez la Box 5G TOPNET Huawei H153-381 : installation Plug & Play, Wi-Fi 6, débits jusqu'à 100 Mbps. Réseau hybride 5G + 4G. Livraison partout en Tunisie.",
    'hero': {
        'enabled': True,
        'slides': [
            {
                'badge': 'Nouveau — Disponible maintenant',
                'title': 'BOX 5G TOPNET\nPlug & Play.',
                'titleHighlight': 'Profitez.',
                'text': "La TOPNET Box 5G Huawei H153-381 : aucun technicien, aucun câble. Branchez, connectez-vous et profitez d'un débit ultrarapide jusqu'à 100 Mbps — dès la première minute.",
                'btnPrimaryLabel': 'Commandez maintenant', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'Voir les tarifs', 'btnSecondaryUrl': '#offres',
                'image_asset': 'hero_slide_1.png',
            },
            {
                'badge': 'Réseau hybride 5G + 4G',
                'title': 'Une connexion\nsans limite',
                'titleHighlight': 'Partout en Tunisie.',
                'text': 'La couverture 5G et le basculement automatique vers la 4G garantissent une connexion stable, même loin de la fibre.',
                'btnPrimaryLabel': 'Découvrir les offres', 'btnPrimaryUrl': '#offres',
                'btnSecondaryLabel': 'Assistance', 'btnSecondaryUrl': '#faq',
                'image_asset': 'hero_slide_2.png',
            },
            {
                'badge': 'Wi-Fi 6 bi-bande',
                'title': "Jusqu'à 1.2 Gbps\nen Wi-Fi 6",
                'titleHighlight': 'Rapide & fluide.',
                'text': 'La Box Huawei H153-381 offre un Wi-Fi 6 bi-bande pour streamer, jouer et télétravailler en toute fluidité.',
                'btnPrimaryLabel': 'Commandez maintenant', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'Fiche technique', 'btnSecondaryUrl': '#specs',
                'image_asset': 'hero_slide_3.jpeg',
            },
        ],
    },
    'trust': {
        'enabled': True,
        'items': [
            {'value': '5G + 4G', 'label': 'Réseau hybride'},
            {'value': 'Wi-Fi 6', 'label': 'Bi-bande'},
            {'value': '1 min', 'label': 'Installation'},
            {'value': 'Box mise à disposition', 'label': "Équipement inclus"},
            {'value': '24/7', 'label': 'Support client 1120'},
        ],
    },
    'about': {
        'enabled': True,
        'tagline': 'À propos de la Box 5G',
        'title': 'Internet Ultra-rapide sans fil',
        'titleHighlight': 'sans fibre, sans technicien.',
        'text': "La TOPNET Box 5G Huawei H153-381 transforme le réseau mobile en internet domestique. Branchez la SIM TOPNET 5G, connectez vos appareils en Wi-Fi 6 et profitez d'un débit descendant jusqu'à 100 Mbps, avec basculement automatique 4G/5G.",
        'features': [
            {'text': 'Installation Plug & Play'},
            {'text': 'Wi-Fi 6 haute vitesse'},
            {'text': 'Carte SIM TOPNET 5G (2 DT TTC)'},
            {'text': 'Répéteur offert dès 50M'},
        ],
        'buttonLabel': 'Plus sur la Box', 'buttonUrl': '#specs',
    },
    'services': {
        'enabled': True,
        'tagline': 'Nos offres',
        'title': 'Une Box pour tous',
        'titleHighlight': 'vos usages',
        'subtitle': 'Famille, télétravail, gaming ou streaming : trouvez la Box 5G adaptée.',
        'items': [
            {
                'icon': '📶', 'title': 'Internet résidentiel',
                'description': "Le remplaçant idéal de l'ADSL pour toute la famille.",
                'features': [{'text': 'Usage quotidien'}, {'text': 'Répéteur offert dès 50M'}, {'text': 'Box mise à disposition'}],
            },
            {
                'icon': '💼', 'title': 'Télétravail & Gaming',
                'description': 'Connexion stable pour la visioconférence, le cloud et le jeu en ligne.',
                'features': [{'text': '4K & streaming'}, {'text': 'Latence réduite'}, {'text': 'Wi-Fi 6'}],
            },
            {
                'icon': '🛰️', 'title': 'Couverture étendue',
                'description': "5G en zone couverte, basculement automatique en 4G partout ailleurs.",
                'features': [{'text': 'Réseau hybride'}, {'text': "Débit jusqu'à 100 Mbps"}, {'text': 'Mobilité'}],
            },
        ],
    },
    'plans': {
        'enabled': True,
        'tagline': 'Nos tarifs',
        'title': 'Choisissez votre',
        'titleHighlight': 'offre 5G',
        'subtitle': 'Box mise à disposition, installation gratuite et engagement 12, 24 ou 36 mois.',
        'groups': [
            {'name': '30M', 'cards': [
                plan_card('30', 'M', '64.9', 'Engagement 12 mois', '', False, ['Upload 10 Mbps', 'Avance : 389.4 DT (6 mois)', 'Storage & VOD inclus', 'Contrôle parental inclus'], '/ mois · 12 mois'),
                plan_card('30', 'M', '59.9', 'Engagement 24 mois', '⭐ Populaire', True, ['Upload 10 Mbps', 'Avance : 119.8 DT (2 mois)', '+ 2 DT Timbre Fiscal (2 mois)', '+ 2 DT TTC Carte SIM'], '/ mois · 24 mois'),
                plan_card('30', 'M', '55.0', 'Engagement 36 mois', '', False, ['Upload 10 Mbps', 'Avance : 110.0 DT (2 mois)', '+ 2 DT Timbre Fiscal (2 mois)', '+ 2 DT TTC Carte SIM'], '/ mois · 36 mois'),
            ]},
            {'name': '50M', 'cards': [
                plan_card('50', 'M', '71.9', 'Engagement 12 mois', '', False, ['Upload 16 Mbps', 'Avance : 431.4 DT (6 mois)', 'Répéteur Wifi gratuit', 'Storage & VOD inclus'], '/ mois · 12 mois'),
                plan_card('50', 'M', '69.9', 'Engagement 24 mois', '⭐ Recommandé', True, ['Upload 16 Mbps', 'Avance : 139.8 DT (2 mois)', 'Répéteur Wifi gratuit', '+ 2 DT Timbre Fiscal + SIM'], '/ mois · 24 mois'),
                plan_card('50', 'M', '64.9', 'Engagement 36 mois', '', False, ['Upload 16 Mbps', 'Avance : 129.8 DT (2 mois)', 'Répéteur Wifi gratuit', '+ 2 DT Timbre Fiscal + SIM'], '/ mois · 36 mois'),
            ]},
            {'name': '100M', 'cards': [
                plan_card('100', 'M', '119.9', 'Engagement 12 mois', '', False, ['Upload 20 Mbps', 'Avance : 719.4 DT (6 mois)', 'Répéteur Wifi gratuit', 'Storage & VOD inclus'], '/ mois · 12 mois'),
                plan_card('100', 'M', '110.9', 'Engagement 24 mois', '⭐ Premium', True, ['Upload 20 Mbps', 'Avance : 221.8 DT (2 mois)', 'Répéteur Wifi gratuit', '+ 2 DT Timbre Fiscal + SIM'], '/ mois · 24 mois'),
                plan_card('100', 'M', '99.9', 'Engagement 36 mois', '', False, ['Upload 20 Mbps', 'Avance : 199.8 DT (2 mois)', 'Répéteur Wifi gratuit', '+ 2 DT Timbre Fiscal + SIM'], '/ mois · 36 mois'),
            ]},
        ],
        'note': 'Offres valables sous réserve de couverture 5G. Carte SIM TOPNET 5G : 2 DT TTC. Timbre fiscal : 2 DT (pour 2 mois).',
    },
    'specs': {
        'enabled': True,
        'tagline': 'Fiche technique',
        'title': 'Huawei',
        'titleHighlight': 'H153-381',
        'rows': [
            {'label': 'Technologie', 'value': '5G / 4G', 'highlight': True},
            {'label': 'Modèle', 'value': 'Huawei H153-381', 'highlight': True},
            {'label': 'Type', 'value': 'Routeur 5G fixe', 'highlight': False},
            {'label': 'Connexion Internet', 'value': 'Via réseau mobile 5G/4G', 'highlight': False},
            {'label': 'Installation', 'value': 'Plug & Play', 'highlight': True},
            {'label': 'Wi-Fi', 'value': 'Wi-Fi intégré', 'highlight': False},
            {'label': 'Ports Ethernet', 'value': 'Ports LAN pour connecter vos équipements filaires', 'highlight': False},
            {'label': 'Carte SIM', 'value': 'SIM TOPNET 5G', 'highlight': False},
            {'label': 'Alimentation', 'value': 'Adaptateur secteur fourni', 'highlight': False},
            {'label': 'Utilisation', 'value': 'Connexion Internet à domicile ou au bureau', 'highlight': False},
        ],
    },
    'steps': {
        'enabled': True,
        'tagline': 'Mise en marche',
        'title': 'Connecté en',
        'titleHighlight': '3 étapes',
        'steps': [
            {'title': 'Insérez la SIM TOPNET 5G', 'description': 'Placez la carte SIM 5G fournie dans le logement dédié de la Box Huawei H153-381.'},
            {'title': "Branchez l'alimentation", 'description': "Reliez l'adaptateur secteur fourni à une prise murale. Initialisation rapide Plug & Play."},
            {'title': 'Connectez-vous au Wi-Fi', 'description': "SSID et mot de passe figurant sur l'étiquette sous la Box. C'est tout."},
        ],
        'helpTitle': "Besoin d'aide ?",
        'helpText': "Appelez le service client au 1120 — disponible 7j/7, ou visitez l'agence TOPNET la plus proche.",
    },
    'faq': {
        'enabled': True,
        'tagline': 'FAQ',
        'title': 'Questions',
        'titleHighlight': 'fréquentes',
        'items': [
            {'question': "Qu'est-ce que la Box 5G TOPNET ?", 'answer': "La Box 5G TOPNET (Huawei H153-381) est une solution d'accès Internet très haut débit qui utilise le réseau mobile 5G pour connecter le foyer, sans ligne téléphonique ni câble fibre. Elle se branche directement sur une prise électrique et diffuse le Wi-Fi dans tout le logement."},
            {'question': "Quelle est la différence entre la Box 5G et la fibre optique (GPON) ou le VDSL ?", 'answer': "La fibre optique et le VDSL offrent une connexion filaire dédiée. La Box 5G capte le signal via les antennes mobiles 5G : elle est idéale pour les foyers non encore raccordés au filaire, avec une mise en service Plug & Play très rapide."},
            {'question': "Ai-je besoin d'une ligne téléphonique fixe pour installer la Box 5G ?", 'answer': "Non. La Box 5G fonctionne uniquement via le réseau mobile 5G ; aucune ligne fixe ni installation filaire n'est nécessaire."},
            {'question': "Quel débit puis-je espérer avec la Box 5G TOPNET ?", 'answer': "Le débit dépend de la couverture 5G à votre adresse. Les offres proposent des débits de 30M, 50M et 100M en téléchargement."},
            {'question': "Comment savoir si mon adresse est éligible à la Box 5G ?", 'answer': "Le conseiller vérifie la couverture via l'outil de simulation TOPNET (à partir de votre adresse ou numéro de téléphone) ou en agence."},
            {'question': "Comment installer la Box 5G ?", 'answer': "L'installation est en mode « Plug & Play » : il suffit de brancher la Box sur une prise électrique. Aucun technicien ni rendez-vous n'est nécessaire."},
            {'question': "Quelle est la durée d'engagement de l'offre ?", 'answer': "En règle générale, la durée d'engagement est de 12, 24 ou 36 mois."},
            {'question': "Comment contacter le service client pour la Box 5G ?", 'answer': "Le client peut joindre le service client TOPNET par téléphone au 1120, via l'espace client en ligne, ou via l'assistant virtuel Topy, disponible 24h/24 et 7j/7."},
        ],
    },
    'testimonials': {
        'enabled': True,
        'tagline': 'Avis clients',
        'title': 'Ce que disent',
        'titleHighlight': 'nos clients',
        'items': [
            {'quote': 'Installé en 5 minutes chez moi à Sousse avec la Box Huawei. Le Wi-Fi couvre toute la maison.', 'author': 'Sami A.', 'role': 'Abonné Box 5G 50M', 'rating': 5},
            {'quote': "Fini l'ADSL coupé les jours de pluie. Streaming 4K sans aucune coupure grâce à la 5G.", 'author': 'Mehdi B.', 'role': 'Abonné Box 5G 100M', 'rating': 5},
            {'quote': "Installation Plug & Play très simple et assistance réactive via le 1120.", 'author': 'Lamia T.', 'role': 'Abonnée Box 5G 30M', 'rating': 4},
        ],
    },
    'news': {
        'enabled': True,
        'tagline': 'Actualités',
        'title': 'Nos dernières',
        'titleHighlight': 'nouvelles',
        'items': [
            {'title': 'Topnet étend son réseau 5G à 8 nouveaux gouvernorats', 'excerpt': "La couverture 5G continue de s'étendre à travers le pays. Vérifiez l'éligibilité dans votre zone.", 'date': '12 Jan 2026', 'link': '#'},
            {'title': 'La Box Huawei H153-381 adoptée pour les offres 5G TOPNET', 'excerpt': "Découvrez le routeur 5G fixe ultra performant avec Wi-Fi intégré et Plug & Play.", 'date': '28 Fév 2026', 'link': '#'},
            {'title': 'Offre spéciale : Répéteur Wifi offert à partir du débit 50M', 'excerpt': "Profitez du répéteur gratuit dès l'offre 50M avec engagement 24 ou 36 mois.", 'date': '15 Mar 2026', 'link': '#'},
        ],
    },
    'cta': {
        'enabled': True,
        'title': 'Prêt à passer à la 5G ?',
        'subtitle': 'Commandez en ligne dès maintenant ou rendez-vous dans votre agence TOPNET.',
        'btnLabel': 'Commandez maintenant', 'btnUrl': '#commander',
        'btnSecondaryLabel': '1120', 'btnSecondaryUrl': 'tel:1120',
    },
    'order': {
        'enabled': True,
        'tagline': 'Commandez en ligne',
        'title': 'Recevez votre',
        'titleHighlight': 'Box 5G chez vous',
        'subtitle': 'Remplissez le formulaire, un conseiller TOPNET vous contacte sous 24h.',
        'labelFirstname': 'Prénom *', 'placeholderFirstname': 'Ex : Mohamed',
        'labelLastname': 'Nom *', 'placeholderLastname': 'Ex : Ben Ali',
        'labelPhone': 'Numéro de téléphone *', 'placeholderPhone': 'Ex : 55 123 456',
        'labelGovernorate': 'Gouvernorat *', 'placeholderGovernorate': 'Sélectionnez',
        'labelAddress': 'Adresse complète *', 'placeholderAddress': 'Rue, immeuble, ville…',
        'labelExisting': 'Êtes-vous déjà abonné Topnet ? *',
        'optionYes': 'Oui, je suis abonné', 'optionNo': 'Non, je suis nouveau',
        'labelPlan': 'Choisissez votre offre *', 'submitLabel': 'Commander',
        'disclaimer': "Vos données sont confidentielles et utilisées uniquement dans le cadre de votre demande d'abonnement.",
        'msgRequired': 'Merci de remplir tous les champs obligatoires.',
        'msgSuccess': 'Demande envoyée ! Un conseiller Topnet vous contactera sous 24h.',
        'msgError': 'Une erreur est survenue, veuillez réessayer.',
        'governorates': [{'text': g} for g in GOVERNORATES_FR],
    },
    'newsletter': {
        'enabled': True,
        'tagline': 'Newsletter',
        'title': 'Restez',
        'titleHighlight': 'informé',
        'text': "Recevez les dernières offres et l'actualité 5G de Topnet.",
        'subtitle': "Recevez les dernières offres et l'actualité 5G de Topnet.",
        'placeholder': 'Votre adresse email', 'buttonLabel': "S'abonner",
        'msgEmail': 'Veuillez saisir un email valide.',
        'msgSuccess': 'Merci pour votre inscription !',
        'msgError': 'Une erreur est survenue, veuillez réessayer.',
    },
}

# ── Contenu AR ────────────────────────────────────────────────────────────────
SITE_CONFIG_AR = {
    **SITE_CONFIG_FR,
    'locale': 'ar',
    'site_name': 'توبنات بوكس 5G',
    'phone': '1120',
    'email': 'commercial@topnet.tn',
    'address': 'مقر توبنات، المركز الحضري الشمالي، تونس',
    'topbar_left': 'خدمة العملاء 7/7 — 1120',
    'cta_label': 'اطلب الآن',
    'lang_label': 'Français',
    'footer_about': 'الرائدة في خدمات الإنترنت في تونس منذ 2001. أكثر من 200,000 مشترك و12 وكالة في كامل أنحاء البلاد.',
    'copyright': '© 2026 توبنات S.A. — جميع الحقوق محفوظة.',
    'nav_items': [
        {'label': 'الرئيسية', 'url': '#accueil'},
        {'label': 'من نحن', 'url': '#apropos'},
        {'label': 'العروض', 'url': '#offres'},
        {'label': 'الأسئلة الشائعة', 'url': '#faq'},
        {'label': 'اتصل بنا', 'url': '#commander'},
    ],
    'footer_columns': [
        {'title': 'العروض', 'links': [
            {'label': 'بوكس 5G', 'url': '#offres'},
            {'label': 'أدسل المنزلي', 'url': '#'},
            {'label': 'سمارت فايبر', 'url': '#'},
            {'label': 'توبنات موبايل', 'url': '#'},
            {'label': 'الشركات', 'url': '#'},
        ]},
        {'title': 'الدعم', 'links': [
            {'label': 'مركز المساعدة', 'url': '#'},
            {'label': 'تحقق من التغطية', 'url': '#'},
            {'label': 'فضاء العميل', 'url': '#'},
            {'label': 'ابحث عن وكالة', 'url': '#'},
            {'label': '1120', 'url': 'tel:1120'},
        ]},
        {'title': 'توبنات', 'links': [
            {'label': 'من نحن', 'url': '#'},
            {'label': 'الأخبار', 'url': '#'},
            {'label': 'التوظيف', 'url': '#'},
            {'label': 'الشركاء', 'url': '#'},
            {'label': 'البنود القانونية', 'url': '#'},
        ]},
    ],
    'legal_links': [
        {'label': 'الخصوصية', 'url': '#'},
        {'label': 'الشروط العامة', 'url': '#'},
        {'label': 'ملفات الارتباط', 'url': '#'},
    ],
}

HOME_PAGE_AR = {
    'locale': 'ar',
    'meta_title': 'توبنات بوكس 5G — إنترنت فائق السرعة بدون أسلاك',
    'meta_description': 'اطلب بوكس 5G من توبنات Huawei H153-381 : تركيب Plug & Play، Wi-Fi 6، سرعات تصل إلى 100 ميجابت/ثانية. شبكة هجينة 5G + 4G.',
    'hero': {
        'enabled': True,
        'slides': [
            {
                'badge': 'جديد — متوفر الآن',
                'title': 'بوكس 5G توبنات\nPlug & Play.',
                'titleHighlight': 'استمتع.',
                'text': 'بوكس 5G من توبنات Huawei H153-381 : بدون فنّي، بدون كابل. أوصله واتصل واستمتع بسرعة فائقة تصل إلى 100 ميجابت/ثانية.',
                'btnPrimaryLabel': 'اطلب الآن', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'شاهد الأسعار', 'btnSecondaryUrl': '#offres',
                'image_asset': 'hero_slide_1.png',
            },
            {
                'badge': 'شبكة هجينة 5G + 4G',
                'title': 'اتصال\nبلا حدود',
                'titleHighlight': 'في كل تونس.',
                'text': 'تغطية 5G مع تحويل تلقائي إلى 4G تضمن اتصالاً مستقراً حتى بعيداً عن الألياف.',
                'btnPrimaryLabel': 'اكتشف العروض', 'btnPrimaryUrl': '#offres',
                'btnSecondaryLabel': 'المساعدة', 'btnSecondaryUrl': '#faq',
                'image_asset': 'hero_slide_2.png',
            },
            {
                'badge': 'Wi-Fi 6 ثنائي النطاق',
                'title': 'حتى 1.2 جيجابت/ثانية\nمع Wi-Fi 6',
                'titleHighlight': 'سريع وسلس.',
                'text': 'بوكس Huawei H153-381 توفر Wi-Fi 6 ثنائي النطاق للبث والألعاب والعمل عن بُعد بسلاسة تامة.',
                'btnPrimaryLabel': 'اطلب الآن', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'المواصفات التقنية', 'btnSecondaryUrl': '#specs',
                'image_asset': 'hero_slide_3.jpeg',
            },
        ],
    },
    'trust': {
        'enabled': True,
        'items': [
            {'value': '5G + 4G', 'label': 'شبكة هجينة'},
            {'value': 'Wi-Fi 6', 'label': 'ثنائي النطاق'},
            {'value': '1 دقيقة', 'label': 'تركيب Plug & Play'},
            {'value': 'البوكس على الذمة', 'label': 'معدات مشمولة'},
            {'value': '24/7', 'label': 'دعم العملاء 1120'},
        ],
    },
    'about': {
        'enabled': True,
        'tagline': 'عن بوكس 5G',
        'title': 'إنترنت فائق السرعة بدون أسلاك',
        'titleHighlight': 'بدون ألياف وبدون فنّي.',
        'text': 'بوكس 5G من توبنات Huawei H153-381 يحوّل الشبكة المتنقلة إلى إنترنت منزلي. أدخل شريحة SIM TOPNET 5G، اربط أجهزتك عبر Wi-Fi 6 واستمتع بسرعة تحميل تصل إلى 100 ميجابت/ثانية.',
        'features': [
            {'text': 'تركيب Plug & Play'},
            {'text': 'Wi-Fi 6 عالي السرعة'},
            {'text': 'شريحة SIM TOPNET 5G (2 د.ت)'},
            {'text': 'مكرر Wi-Fi مجاني ابتداءً من 50M'},
        ],
        'buttonLabel': 'المزيد عن البوكس', 'buttonUrl': '#specs',
    },
    'services': {
        'enabled': True,
        'tagline': 'عروضنا',
        'title': 'بوكس واحدة',
        'titleHighlight': 'لكل استخداماتك',
        'subtitle': 'عائلة، عمل عن بُعد، ألعاب أو بث : اختر بوكس 5G المناسب لك.',
        'items': [
            {'icon': '📶', 'title': 'إنترنت المنزل', 'description': 'البديل المثالي لخطوط ADSL لكل العائلة.', 'features': [{'text': 'استخدام يومي'}, {'text': 'مكرر Wi-Fi مجاني ابتداءً من 50M'}, {'text': 'البوكس على الذمة'}]},
            {'icon': '💼', 'title': 'العمل والألعاب', 'description': 'اتصال مستقر للمكالمات المرئية والسحابة والألعاب عبر الإنترنت.', 'features': [{'text': 'بث 4K'}, {'text': 'زمن استجابة منخفض'}, {'text': 'Wi-Fi 6'}]},
            {'icon': '🛰️', 'title': 'تغطية واسعة', 'description': '5G في المناطق المغطاة مع تحويل تلقائي إلى 4G في كل مكان.', 'features': [{'text': 'شبكة هجينة'}, {'text': 'سرعة تصل إلى 100 ميجابت/ثانية'}, {'text': 'تنقل'}]},
        ],
    },
    'plans': {
        'enabled': True,
        'tagline': 'أسعارنا',
        'title': 'اختر',
        'titleHighlight': 'عرض 5G الخاص بك',
        'subtitle': 'البوكس على الذمة، التركيب مجاني والتزام 12 أو 24 أو 36 شهراً.',
        'groups': [
            {'name': '30M', 'cards': [
                plan_card_ar('30', 'M', '64.9', 'التزام 12 شهراً', '', False, ['رفع 10 ميجابت/ث', 'تسبقة : 389.4 د.ت (6 أشهر)', 'تخزين وVOD مشمول', 'رقابة أبوية مشمولة'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('30', 'M', '59.9', 'التزام 24 شهراً', '⭐ شائع', True, ['رفع 10 ميجابت/ث', 'تسبقة : 119.8 د.ت (شهرين)', '+ 2 د.ت طابع جبائي (شهرين)', '+ 2 د.ت شريحة SIM'], '/ شهرياً · 24 شهراً'),
                plan_card_ar('30', 'M', '55.0', 'التزام 36 شهراً', '', False, ['رفع 10 ميجابت/ث', 'تسبقة : 110.0 د.ت (شهرين)', '+ 2 د.ت طابع جبائي (شهرين)', '+ 2 د.ت شريحة SIM'], '/ شهرياً · 36 شهراً'),
            ]},
            {'name': '50M', 'cards': [
                plan_card_ar('50', 'M', '71.9', 'التزام 12 شهراً', '', False, ['رفع 16 ميجابت/ث', 'تسبقة : 431.4 د.ت (6 أشهر)', 'مكرر Wi-Fi مجاني', 'تخزين وVOD مشمول'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('50', 'M', '69.9', 'التزام 24 شهراً', '⭐ موصى به', True, ['رفع 16 ميجابت/ث', 'تسبقة : 139.8 د.ت (شهرين)', 'مكرر Wi-Fi مجاني', '+ 2 د.ت طابع جبائي + SIM'], '/ شهرياً · 24 شهراً'),
                plan_card_ar('50', 'M', '64.9', 'التزام 36 شهراً', '', False, ['رفع 16 ميجابت/ث', 'تسبقة : 129.8 د.ت (شهرين)', 'مكرر Wi-Fi مجاني', '+ 2 د.ت طابع جبائي + SIM'], '/ شهرياً · 36 شهراً'),
            ]},
            {'name': '100M', 'cards': [
                plan_card_ar('100', 'M', '119.9', 'التزام 12 شهراً', '', False, ['رفع 20 ميجابت/ث', 'تسبقة : 719.4 د.ت (6 أشهر)', 'مكرر Wi-Fi مجاني', 'تخزين وVOD مشمول'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('100', 'M', '110.9', 'التزام 24 شهراً', '⭐ بريميوم', True, ['رفع 20 ميجابت/ث', 'تسبقة : 221.8 د.ت (شهرين)', 'مكرر Wi-Fi مجاني', '+ 2 د.ت طابع جبائي + SIM'], '/ شهرياً · 24 شهراً'),
                plan_card_ar('100', 'M', '99.9', 'التزام 36 شهراً', '', False, ['رفع 20 ميجابت/ث', 'تسبقة : 199.8 د.ت (شهرين)', 'مكرر Wi-Fi مجاني', '+ 2 د.t طابع جبائي + SIM'], '/ شهرياً · 36 شهراً'),
            ]},
        ],
        'note': 'العروض صالحة حسب التغطية. شريحة SIM TOPNET 5G : 2 د.ت. طابع جبائي : 2 د.ت (لمدة شهرين).',
    },
    'specs': {
        'enabled': True,
        'tagline': 'المواصفات التقنية',
        'title': 'Huawei',
        'titleHighlight': 'H153-381',
        'rows': [
            {'label': 'التكنولوجيا', 'value': '5G / 4G', 'highlight': True},
            {'label': 'الموديل', 'value': 'Huawei H153-381', 'highlight': True},
            {'label': 'النوع', 'value': 'راوتر 5G ثابت', 'highlight': False},
            {'label': 'الاتصال بالإنترنت', 'value': 'عبر شبكة الجوال 5G/4G', 'highlight': False},
            {'label': 'التركيب', 'value': 'Plug & Play', 'highlight': True},
            {'label': 'Wi-Fi', 'value': 'Wi-Fi مدمج', 'highlight': False},
            {'label': 'منافذ الإيثرنت', 'value': 'منافذ LAN لربط أجهزتك السلكية', 'highlight': False},
            {'label': 'شريحة SIM', 'value': 'SIM TOPNET 5G', 'highlight': False},
            {'label': 'التغذية', 'value': 'محول كهربائي مرفق', 'highlight': False},
            {'label': 'الاستخدام', 'value': 'اتصال بالإنترنت في المنزل أو المكتب', 'highlight': False},
        ],
    },
    'steps': {
        'enabled': True,
        'tagline': 'التشغيل',
        'title': 'متصل عبر',
        'titleHighlight': '3 خطوات',
        'steps': [
            {'title': 'أدخل شريحة SIM TOPNET 5G', 'description': 'ضع شريحة SIM 5G المرفقة في المكان المخصص في بوكس Huawei H153-381.'},
            {'title': 'أوصله بالكهرباء', 'description': 'اربط المحول الكهربائي بمقبس الحائط. تشغيل سريع Plug & Play.'},
            {'title': 'اتصل بشبكة Wi-Fi', 'description': 'اسم الشبكة وكلمة المرور موجودان على الملصق أسفل البوكس. هذا كل شيء.'},
        ],
        'helpTitle': 'تحتاج مساعدة؟',
        'helpText': 'اتصل على 1120 — متاح 7/7، أو زر أقرب وكالة توبنات.',
    },
    'faq': {
        'enabled': True,
        'tagline': 'الأسئلة الشائعة',
        'title': 'أسئلة',
        'titleHighlight': 'متكررة',
        'items': [
            {'question': 'ما هو بوكس 5G توبنات؟', 'answer': 'بوكس 5G توبنات (Huawei H153-381) هو حل إنترنت فائق السرعة يعتمد على شبكة 5G دون الحاجة لخط هاتف ثابت أو ألياف. يتم توصيله بالكهرباء مباشرة.'},
            {'question': 'ما الفرق بين بوكس 5G والألياف البصرية أو VDSL؟', 'answer': 'الألياف البصرية وVDSL يوفران اتصالا سلكيا. بوكس 5G يعتمد على شبكة الجوال 5G وهو مثالي للمنازل غير المربوطة بالألياف مع تركيب سريع Plug & Play.'},
            {'question': 'هل أحتاج خط هاتف قار لتشغيل بوكس 5G؟', 'answer': 'لا. يعمل بوكس 5G حصريا عبر شبكة الجوال 5G دون الحاجة لخط قار.'},
            {'question': 'ما هي السرعة المتوقعة؟', 'answer': 'تتوفر العروض بسرعات 30M و50M و100M حسب التغطية.'},
            {'question': 'كيف أعرف هل منطقتي مغطاة؟', 'answer': 'يتحقق المستشار من التغطية عبر أداة المحاكاة الخاصة بتوبنات أو في الوكالة.'},
            {'question': 'كيف يتم التركيب؟', 'answer': 'التركيب يتم بصيغة Plug & Play : يكفي توصيل البوكس بالكهرباء دون الحاجة لفني.'},
            {'question': 'ما هي مدة الالتزام؟', 'answer': 'تكون مدة الالتزام 12 أو 24 أو 36 شهرا.'},
            {'question': 'كيف اتصل بخدمة العملاء؟', 'answer': 'يمكنك الاتصال بالرقم 1120 أو عبر فضاء العميل أو المساعد Topy على مدار 24/7.'},
        ],
    },
    'testimonials': {
        'enabled': True,
        'tagline': 'آراء العملاء',
        'title': 'ماذا يقول',
        'titleHighlight': 'عملاؤنا',
        'items': [
            {'quote': 'ركّبته في 5 دقائق في منزلي بسوسة مع بوكس Huawei. Wi-Fi يغطي المنزل كله.', 'author': 'سامي ع.', 'role': 'مشترك بوكس 5G 50M', 'rating': 5},
            {'quote': 'وداعاً للأدسل الذي ينقطع أيام المطر. بث 4K دون أي انقطاع بفضل 5G.', 'author': 'مهدي ب.', 'role': 'مشترك بوكس 5G 100M', 'rating': 5},
            {'quote': 'تركيب Plug & Play بسيط جداً ودعم سريع عبر 1120.', 'author': 'لمياء ت.', 'role': 'مشتركة بوكس 5G 30M', 'rating': 4},
        ],
    },
    'news': {
        'enabled': True,
        'tagline': 'الأخبار',
        'title': 'آخر',
        'titleHighlight': 'المستجدات',
        'items': [
            {'title': 'توبنات توسّع شبكة 5G إلى 8 ولايات جديدة', 'excerpt': 'تواصل تغطية 5G توسعها عبر البلاد. تحقق من التغطية في منطقتك.', 'date': '12 جانفي 2026', 'link': '#'},
            {'title': 'اعتماد بوكس Huawei H153-381 لعروض 5G توبنات', 'excerpt': 'اكتشف الراوتر الثابت فائق الأداء مع Wi-Fi مدمج وتركيب Plug & Play.', 'date': '28 فيفري 2026', 'link': '#'},
            {'title': 'عرض خاص : مكرر Wi-Fi مجاني ابتداءً من سرعة 50M', 'excerpt': 'استفد من مكرر مجاني عند الاشتراك في عرض 50M مع التزام 24 أو 36 شهراً.', 'date': '15 مارس 2026', 'link': '#'},
        ],
    },
    'cta': {
        'enabled': True,
        'title': 'مستعد للانتقال إلى 5G؟',
        'subtitle': 'اطلب عبر الإنترنت الآن أو توجه إلى أقرب وكالة توبنات.',
        'btnLabel': 'اطلب الآن', 'btnUrl': '#commander',
        'btnSecondaryLabel': '1120', 'btnSecondaryUrl': 'tel:1120',
    },
    'order': {
        'enabled': True,
        'tagline': 'اطلب عبر الإنترنت',
        'title': 'استلم',
        'titleHighlight': 'بوكس 5G في منزلك',
        'subtitle': 'املأ الاستمارة وسيتصل بك مستشار توبنات خلال 24 ساعة.',
        'labelFirstname': 'الاسم *', 'placeholderFirstname': 'مثال : محمد',
        'labelLastname': 'اللقب *', 'placeholderLastname': 'مثال : بن علي',
        'labelPhone': 'رقم الهاتف *', 'placeholderPhone': 'مثال : 55 123 456',
        'labelGovernorate': 'الولاية *', 'placeholderGovernorate': 'اختر',
        'labelAddress': 'العنوان الكامل *', 'placeholderAddress': 'الشارع، البناية، المدينة…',
        'labelExisting': 'هل أنت مشترك توبنات بالفعل؟ *',
        'optionYes': 'نعم، أنا مشترك', 'optionNo': 'لا، أنا جديد',
        'labelPlan': 'اختر عرضك *', 'submitLabel': 'اطلب',
        'disclaimer': 'بياناتك سرية وتُستخدم فقط في إطار طلب اشتراكك.',
        'msgRequired': 'يرجى ملء جميع الحقول الإلزامية.',
        'msgSuccess': 'تم إرسال طلبك! سيتصل بك مستشار توبنات خلال 24 ساعة.',
        'msgError': 'حدث خطأ، يرجى إعادة المحاولة.',
        'governorates': [{'text': g} for g in GOVERNORATES_AR],
    },
    'newsletter': {
        'enabled': True,
        'tagline': 'النشرة البريدية',
        'title': 'ابقَ',
        'titleHighlight': 'متابعاً',
        'text': 'استلم آخر العروض وأخبار 5G من توبنات.',
        'subtitle': 'استلم آخر العروض وأخبار 5G من توبنات.',
        'placeholder': 'بريدك الإلكتروني', 'buttonLabel': 'اشترك',
        'msgEmail': 'يرجى إدخال بريد إلكتروني صحيح.',
        'msgSuccess': 'شكراً لاشتراكك!',
        'msgError': 'حدث خطأ، يرجى إعادة المحاولة.',
    },
}


# ── Main ──────────────────────────────────────────────────────────────────────
def seed_superuser():
    user, created = User.objects.get_or_create(
        username=ADMIN_USERNAME,
        defaults={'email': ADMIN_EMAIL, 'is_staff': True, 'is_superuser': True}
    )
    user.set_password(ADMIN_PASSWORD)
    user.email = ADMIN_EMAIL
    user.is_staff = True
    user.is_superuser = True
    user.save()
    status = 'créé' if created else 'mot de passe réinitialisé'
    log(f'👤 Superuser {ADMIN_USERNAME} ({ADMIN_EMAIL}) {status}')


def seed_site_config():
    for data in [SITE_CONFIG_FR, SITE_CONFIG_AR]:
        locale = data['locale']
        obj, created = SiteConfig.objects.update_or_create(
            locale=locale,
            defaults={k: v for k, v in data.items() if k != 'locale'},
        )
        status = 'créé' if created else 'mis à jour'
        log(f'✅ SiteConfig {locale} {status}')


def seed_home_page():
    # Extract JSON section fields and scalar fields separately
    section_fields = [
        'hero', 'trust', 'about', 'services', 'plans', 'specs',
        'steps', 'faq', 'testimonials', 'news', 'cta', 'order', 'newsletter',
    ]
    for data in [HOME_PAGE_FR, HOME_PAGE_AR]:
        locale = data['locale']
        defaults = {
            'meta_title': data.get('meta_title', ''),
            'meta_description': data.get('meta_description', ''),
        }
        for field in section_fields:
            if field in data:
                defaults[field] = data[field]

        obj, created = HomePage.objects.update_or_create(
            locale=locale,
            defaults=defaults,
        )
        status = 'créé' if created else 'mis à jour'
        log(f'✅ HomePage {locale} {status}')


def seed_explicit_models():
    """
    Crée les modèles séparés (HeroSlide, TrustItem, ServiceItem…)
    et les lie aux objets HomePage via ManyToManyField.
    Appelé uniquement une fois si les modèles sont vides.
    """
    from content.models import (
        HeroSlide, TrustItem, ServiceItem,
        PlanGroup, PlanCard, SpecRow, StepItem, FaqItem,
        TestimonialItem, NewsItem,
    )

    # ── FR ────────────────────────────────────────────────────────────────────
    hp_fr = HomePage.objects.get(locale='fr')
    data_fr = HOME_PAGE_FR

    # Hero slides
    if not hp_fr.hero_slides.exists():
        for i, slide in enumerate(data_fr['hero'].get('slides', [])):
            s = HeroSlide.objects.create(
                badge=slide.get('badge', ''),
                title=slide.get('title', ''),
                title_highlight=slide.get('titleHighlight', ''),
                text=slide.get('text', ''),
                btn_primary_label=slide.get('btnPrimaryLabel', ''),
                btn_primary_url=slide.get('btnPrimaryUrl', ''),
                btn_secondary_label=slide.get('btnSecondaryLabel', ''),
                btn_secondary_url=slide.get('btnSecondaryUrl', ''),
                order=i,
            )
            img_asset = slide.get('image_asset')
            if img_asset:
                _asset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', img_asset)
                if os.path.exists(_asset_path):
                    from django.core.files import File
                    with open(_asset_path, 'rb') as _f:
                        s.image.save(f'hero/{img_asset}', File(_f), save=True)
            hp_fr.hero_slides.add(s)
        log('✅ HeroSlide FR créés')
    else:
        for i, s in enumerate(hp_fr.hero_slides.all().order_by('order')):
            slides_data = data_fr['hero'].get('slides', [])
            if i < len(slides_data):
                img_asset = slides_data[i].get('image_asset')
                if img_asset:
                    _asset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', img_asset)
                    if os.path.exists(_asset_path):
                        from django.core.files import File
                        with open(_asset_path, 'rb') as _f:
                            s.image.save(f'hero/{img_asset}', File(_f), save=True)
        log('✅ HeroSlide FR mis à jour (images)')

    # Trust items
    if not hp_fr.trust_items.exists():
        for i, item in enumerate(data_fr['trust'].get('items', [])):
            t = TrustItem.objects.create(value=item['value'], label=item['label'], order=i)
            hp_fr.trust_items.add(t)
        log('✅ TrustItem FR créés')

    # About (scalar fields on HomePage)
    ab = data_fr.get('about', {})
    hp_fr.about_tagline = ab.get('tagline', '')
    hp_fr.about_title = ab.get('title', '')
    hp_fr.about_title_highlight = ab.get('titleHighlight', '')
    hp_fr.about_text = ab.get('text', '')
    hp_fr.about_button_label = ab.get('buttonLabel', '')
    hp_fr.about_button_url = ab.get('buttonUrl', '')
    hp_fr.about_features = ab.get('features', [])
    _about_img = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'about_femme.jpg')
    if os.path.exists(_about_img):
        from django.core.files import File
        with open(_about_img, 'rb') as _f:
            hp_fr.about_image.save('about/about_femme.jpg', File(_f), save=False)
        log('✅ About image FR uploadée (femme.jpg)')

    # Services
    sv = data_fr.get('services', {})
    hp_fr.services_tagline = sv.get('tagline', '')
    hp_fr.services_title = sv.get('title', '')
    hp_fr.services_title_highlight = sv.get('titleHighlight', '')
    hp_fr.services_subtitle = sv.get('subtitle', '')
    if not hp_fr.services_items.exists():
        for i, item in enumerate(sv.get('items', [])):
            si = ServiceItem.objects.create(
                icon=item.get('icon', ''),
                title=item['title'],
                description=item.get('description', ''),
                features=item.get('features', []),
                order=i,
            )
            hp_fr.services_items.add(si)
        log('✅ ServiceItem FR créés')

    # Plans
    pl = data_fr.get('plans', {})
    hp_fr.plans_tagline = pl.get('tagline', '')
    hp_fr.plans_title = pl.get('title', '')
    hp_fr.plans_title_highlight = pl.get('titleHighlight', '')
    hp_fr.plans_subtitle = pl.get('subtitle', '')
    hp_fr.plans_note = pl.get('note', '')
    if not hp_fr.plans_groups.exists():
        for gi, grp in enumerate(pl.get('groups', [])):
            pg = PlanGroup.objects.create(name=grp['name'], order=gi)
            for ci, card in enumerate(grp.get('cards', [])):
                PlanCard.objects.create(
                    group=pg,
                    speed=str(card.get('speed', '')),
                    speed_unit=card.get('speedUnit', 'M'),
                    speed_label=card.get('speedLabel', 'Débit descendant'),
                    title=card['title'],
                    price=str(card['price']),
                    currency=card.get('currency', 'DT'),
                    period=card.get('period', '/ mois · 24 mois'),
                    badge=card.get('badge', ''),
                    recommended=card.get('recommended', False),
                    button_label=card.get('buttonLabel', 'Commander'),
                    button_url=card.get('buttonUrl', '#commander'),
                    features=card.get('features', []),
                    order=ci,
                )
            hp_fr.plans_groups.add(pg)
        log('✅ PlanGroup + PlanCard FR créés')

    # Specs
    sp = data_fr.get('specs', {})
    hp_fr.specs_tagline = sp.get('tagline', '')
    hp_fr.specs_title = sp.get('title', '')
    hp_fr.specs_title_highlight = sp.get('titleHighlight', '')
    # Upload spec image Huawei H153-381
    _spec_img = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'huawei_h153_381.jpeg')
    if not hp_fr.specs_image and os.path.exists(_spec_img):
        from django.core.files import File
        with open(_spec_img, 'rb') as _f:
            hp_fr.specs_image.save('specs/huawei_h153_381.jpeg', File(_f), save=False)
        log('✅ Specs image FR uploadée')
    if not hp_fr.specs_rows.exists():
        for i, row in enumerate(sp.get('rows', [])):
            sr = SpecRow.objects.create(
                label=row['label'], value=row['value'],
                highlight=row.get('highlight', False), order=i,
            )
            hp_fr.specs_rows.add(sr)
        log('✅ SpecRow FR créés')

    # Steps
    st = data_fr.get('steps', {})
    hp_fr.steps_tagline = st.get('tagline', '')
    hp_fr.steps_title = st.get('title', '')
    hp_fr.steps_title_highlight = st.get('titleHighlight', '')
    hp_fr.steps_help_title = st.get('helpTitle', '')
    hp_fr.steps_help_text = st.get('helpText', '')
    if not hp_fr.steps_items.exists():
        for i, step in enumerate(st.get('steps', [])):
            si = StepItem.objects.create(
                title=step['title'], description=step.get('description', ''), order=i,
            )
            hp_fr.steps_items.add(si)
        log('✅ StepItem FR créés')

    # FAQ
    fq = data_fr.get('faq', {})
    hp_fr.faq_tagline = fq.get('tagline', '')
    hp_fr.faq_title = fq.get('title', '')
    hp_fr.faq_title_highlight = fq.get('titleHighlight', '')
    if not hp_fr.faq_items.exists():
        for i, item in enumerate(fq.get('items', [])):
            fi = FaqItem.objects.create(
                question=item['question'], answer=item['answer'], order=i,
            )
            hp_fr.faq_items.add(fi)
        log('✅ FaqItem FR créés')

    # Testimonials
    tm = data_fr.get('testimonials', {})
    hp_fr.testimonials_tagline = tm.get('tagline', '')
    hp_fr.testimonials_title = tm.get('title', '')
    hp_fr.testimonials_title_highlight = tm.get('titleHighlight', '')
    if not hp_fr.testimonials_items.exists():
        for i, item in enumerate(tm.get('items', [])):
            ti = TestimonialItem.objects.create(
                quote=item['quote'], author=item['author'],
                role=item.get('role', ''), rating=item.get('rating', 5), order=i,
            )
            hp_fr.testimonials_items.add(ti)
        log('✅ TestimonialItem FR créés')

    # News
    nw = data_fr.get('news', {})
    hp_fr.news_tagline = nw.get('tagline', '')
    hp_fr.news_title = nw.get('title', '')
    hp_fr.news_title_highlight = nw.get('titleHighlight', '')
    if not hp_fr.news_items.exists():
        for i, item in enumerate(nw.get('items', [])):
            ni = NewsItem.objects.create(
                title=item['title'], excerpt=item.get('excerpt', ''),
                date=item.get('date', ''), link=item.get('link', '#'), order=i,
            )
            hp_fr.news_items.add(ni)
        log('✅ NewsItem FR créés')

    # CTA
    ct = data_fr.get('cta', {})
    hp_fr.cta_title = ct.get('title', '')
    hp_fr.cta_subtitle = ct.get('subtitle', '')
    hp_fr.cta_btn_label = ct.get('btnLabel', '')
    hp_fr.cta_btn_url = ct.get('btnUrl', '')
    hp_fr.cta_btn_secondary_label = ct.get('btnSecondaryLabel', '')
    hp_fr.cta_btn_secondary_url = ct.get('btnSecondaryUrl', '')

    hp_fr.save()
    log('✅ HomePage FR scalar fields sauvegardés')

    # ── AR ────────────────────────────────────────────────────────────────────
    hp_ar = HomePage.objects.get(locale='ar')
    data_ar = HOME_PAGE_AR

    if not hp_ar.hero_slides.exists():
        for i, slide in enumerate(data_ar['hero'].get('slides', [])):
            s = HeroSlide.objects.create(
                badge=slide.get('badge', ''),
                title=slide.get('title', ''),
                title_highlight=slide.get('titleHighlight', ''),
                text=slide.get('text', ''),
                btn_primary_label=slide.get('btnPrimaryLabel', ''),
                btn_primary_url=slide.get('btnPrimaryUrl', ''),
                btn_secondary_label=slide.get('btnSecondaryLabel', ''),
                btn_secondary_url=slide.get('btnSecondaryUrl', ''),
                order=i,
            )
            img_asset = slide.get('image_asset')
            if img_asset:
                _asset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', img_asset)
                if os.path.exists(_asset_path):
                    from django.core.files import File
                    with open(_asset_path, 'rb') as _f:
                        s.image.save(f'hero/{img_asset}', File(_f), save=True)
            hp_ar.hero_slides.add(s)
        log('✅ HeroSlide AR créés')
    else:
        for i, s in enumerate(hp_ar.hero_slides.all().order_by('order')):
            slides_data = data_ar['hero'].get('slides', [])
            if i < len(slides_data):
                img_asset = slides_data[i].get('image_asset')
                if img_asset:
                    _asset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', img_asset)
                    if os.path.exists(_asset_path):
                        from django.core.files import File
                        with open(_asset_path, 'rb') as _f:
                            s.image.save(f'hero/{img_asset}', File(_f), save=True)
        log('✅ HeroSlide AR mis à jour (images)')

    if not hp_ar.trust_items.exists():
        for i, item in enumerate(data_ar['trust'].get('items', [])):
            t = TrustItem.objects.create(value=item['value'], label=item['label'], order=i + 10)
            hp_ar.trust_items.add(t)
        log('✅ TrustItem AR créés')

    ab_ar = data_ar.get('about', {})
    hp_ar.about_tagline = ab_ar.get('tagline', '')
    hp_ar.about_title = ab_ar.get('title', '')
    hp_ar.about_title_highlight = ab_ar.get('titleHighlight', '')
    hp_ar.about_text = ab_ar.get('text', '')
    hp_ar.about_button_label = ab_ar.get('buttonLabel', '')
    hp_ar.about_button_url = ab_ar.get('buttonUrl', '')
    hp_ar.about_features = ab_ar.get('features', [])
    _about_img = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'about_femme.jpg')
    if os.path.exists(_about_img):
        from django.core.files import File
        with open(_about_img, 'rb') as _f:
            hp_ar.about_image.save('about/about_femme.jpg', File(_f), save=False)
        log('✅ About image AR uploadée (femme.jpg)')

    sv_ar = data_ar.get('services', {})
    hp_ar.services_tagline = sv_ar.get('tagline', '')
    hp_ar.services_title = sv_ar.get('title', '')
    hp_ar.services_title_highlight = sv_ar.get('titleHighlight', '')
    hp_ar.services_subtitle = sv_ar.get('subtitle', '')
    if not hp_ar.services_items.exists():
        for i, item in enumerate(sv_ar.get('items', [])):
            si = ServiceItem.objects.create(
                icon=item.get('icon', ''),
                title=item['title'],
                description=item.get('description', ''),
                features=item.get('features', []),
                order=i + 10,
            )
            hp_ar.services_items.add(si)
        log('✅ ServiceItem AR créés')

    pl_ar = data_ar.get('plans', {})
    hp_ar.plans_tagline = pl_ar.get('tagline', '')
    hp_ar.plans_title = pl_ar.get('title', '')
    hp_ar.plans_title_highlight = pl_ar.get('titleHighlight', '')
    hp_ar.plans_subtitle = pl_ar.get('subtitle', '')
    hp_ar.plans_note = pl_ar.get('note', '')
    if not hp_ar.plans_groups.exists():
        for gi, grp in enumerate(pl_ar.get('groups', [])):
            pg = PlanGroup.objects.create(name=grp['name'], order=gi + 10)
            for ci, card in enumerate(grp.get('cards', [])):
                PlanCard.objects.create(
                    group=pg,
                    speed=str(card.get('speed', '')),
                    speed_unit=card.get('speedUnit', 'M'),
                    speed_label=card.get('speedLabel', 'سرعة التحميل'),
                    title=card['title'],
                    price=str(card['price']),
                    currency=card.get('currency', 'د.ت'),
                    period=card.get('period', '/ شهرياً · 24 شهراً'),
                    badge=card.get('badge', ''),
                    recommended=card.get('recommended', False),
                    button_label=card.get('buttonLabel', 'اطلب'),
                    button_url=card.get('buttonUrl', '#commander'),
                    features=card.get('features', []),
                    order=ci,
                )
            hp_ar.plans_groups.add(pg)
        log('✅ PlanGroup + PlanCard AR créés')

    sp_ar = data_ar.get('specs', {})
    hp_ar.specs_tagline = sp_ar.get('tagline', '')
    hp_ar.specs_title = sp_ar.get('title', '')
    hp_ar.specs_title_highlight = sp_ar.get('titleHighlight', '')
    # Upload spec image Huawei H153-381 (même image que FR)
    if not hp_ar.specs_image and os.path.exists(_spec_img):
        from django.core.files import File
        with open(_spec_img, 'rb') as _f:
            hp_ar.specs_image.save('specs/huawei_h153_381.jpeg', File(_f), save=False)
        log('✅ Specs image AR uploadée')
    if not hp_ar.specs_rows.exists():
        for i, row in enumerate(sp_ar.get('rows', [])):
            sr = SpecRow.objects.create(
                label=row['label'], value=row['value'],
                highlight=row.get('highlight', False), order=i + 10,
            )
            hp_ar.specs_rows.add(sr)
        log('✅ SpecRow AR créés')

    st_ar = data_ar.get('steps', {})
    hp_ar.steps_tagline = st_ar.get('tagline', '')
    hp_ar.steps_title = st_ar.get('title', '')
    hp_ar.steps_title_highlight = st_ar.get('titleHighlight', '')
    hp_ar.steps_help_title = st_ar.get('helpTitle', '')
    hp_ar.steps_help_text = st_ar.get('helpText', '')
    if not hp_ar.steps_items.exists():
        for i, step in enumerate(st_ar.get('steps', [])):
            si = StepItem.objects.create(
                title=step['title'], description=step.get('description', ''), order=i + 10,
            )
            hp_ar.steps_items.add(si)
        log('✅ StepItem AR créés')

    fq_ar = data_ar.get('faq', {})
    hp_ar.faq_tagline = fq_ar.get('tagline', '')
    hp_ar.faq_title = fq_ar.get('title', '')
    hp_ar.faq_title_highlight = fq_ar.get('titleHighlight', '')
    if not hp_ar.faq_items.exists():
        for i, item in enumerate(fq_ar.get('items', [])):
            fi = FaqItem.objects.create(
                question=item['question'], answer=item['answer'], order=i + 10,
            )
            hp_ar.faq_items.add(fi)
        log('✅ FaqItem AR créés')

    tm_ar = data_ar.get('testimonials', {})
    hp_ar.testimonials_tagline = tm_ar.get('tagline', '')
    hp_ar.testimonials_title = tm_ar.get('title', '')
    hp_ar.testimonials_title_highlight = tm_ar.get('titleHighlight', '')
    if not hp_ar.testimonials_items.exists():
        for i, item in enumerate(tm_ar.get('items', [])):
            ti = TestimonialItem.objects.create(
                quote=item['quote'], author=item['author'],
                role=item.get('role', ''), rating=item.get('rating', 5), order=i + 10,
            )
            hp_ar.testimonials_items.add(ti)
        log('✅ TestimonialItem AR créés')

    nw_ar = data_ar.get('news', {})
    hp_ar.news_tagline = nw_ar.get('tagline', '')
    hp_ar.news_title = nw_ar.get('title', '')
    hp_ar.news_title_highlight = nw_ar.get('titleHighlight', '')
    if not hp_ar.news_items.exists():
        for i, item in enumerate(nw_ar.get('items', [])):
            ni = NewsItem.objects.create(
                title=item['title'], excerpt=item.get('excerpt', ''),
                date=item.get('date', ''), link=item.get('link', '#'), order=i + 10,
            )
            hp_ar.news_items.add(ni)
        log('✅ NewsItem AR créés')

    ct_ar = data_ar.get('cta', {})
    hp_ar.cta_title = ct_ar.get('title', '')
    hp_ar.cta_subtitle = ct_ar.get('subtitle', '')
    hp_ar.cta_btn_label = ct_ar.get('btnLabel', '')
    hp_ar.cta_btn_url = ct_ar.get('btnUrl', '')
    hp_ar.cta_btn_secondary_label = ct_ar.get('btnSecondaryLabel', '')
    hp_ar.cta_btn_secondary_url = ct_ar.get('btnSecondaryUrl', '')

    hp_ar.save()
    log('✅ HomePage AR scalar fields sauvegardés')


def main():
    log('🌱 Démarrage du seed...')
    seed_superuser()
    seed_site_config()
    seed_home_page()
    seed_explicit_models()
    log('\n🎉 Seed terminé avec succès !')
    log(f'   Django Admin : http://localhost:8000/django-admin/ ({ADMIN_EMAIL} / {ADMIN_PASSWORD})')
    log('   Custom Admin : http://localhost:3001/admin/')


if __name__ == '__main__':
    main()

