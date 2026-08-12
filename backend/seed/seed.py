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
    'primary_color': '#FFA502',
    'primary_dark': '#e08e00',
    'heading_color': '#251444',
    'text_color': '#737177',
    'light_bg': '#F7F5F1',
    'border_color': '#E6E2D9',
    'dark_bg': '#251444',
    'body_font': 'Outfit',
    'heading_font': 'Outfit',
    'arabic_font': 'Cairo',
    'phone': '71 001 298',
    'email': 'contact@topnet.tn',
    'address': 'Boulevard de la Terre, Centre Urbain Nord, Tunis',
    'topbar_left': 'Service client 7j/7 — 71 001 298',
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
                {'label': '71 001 298', 'url': 'tel:71001298'},
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
    'meta_title': 'TOPNET Box 5G — Internet ultra-rapide sans fil',
    'meta_description': "Commandez la Box 5G TOPNET : installation en 1 minute, Wi-Fi 6, débits jusqu'à 100 Mbps. Réseau hybride 5G + 4G. Livraison partout en Tunisie.",
    'hero': {
        'enabled': True,
        'slides': [
            {
                'badge': 'Nouveau — Disponible maintenant',
                'title': 'BOX 5G TOPNET\nPlug. Play.',
                'titleHighlight': 'Profitez.',
                'text': "La TOPNET Box 5G : aucun technicien, aucun câble. Branchez, connectez-vous et profitez d'un débit ultrarapide jusqu'à 100 Mbps — dès la première minute.",
                'btnPrimaryLabel': 'Commandez maintenant', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'Voir les tarifs', 'btnSecondaryUrl': '#offres',
            },
            {
                'badge': 'Réseau hybride 5G + 4G',
                'title': 'Une connexion\nsans limite',
                'titleHighlight': 'Partout en Tunisie.',
                'text': 'La couverture 5G et le basculement automatique vers la 4G garantissent une connexion stable, même loin de la fibre.',
                'btnPrimaryLabel': 'Découvrir les offres', 'btnPrimaryUrl': '#offres',
                'btnSecondaryLabel': 'Assistance', 'btnSecondaryUrl': '#faq',
            },
            {
                'badge': 'Wi-Fi 6 bi-bande',
                'title': "Jusqu'à 1.2 Gbps\nen Wi-Fi 6",
                'titleHighlight': 'Rapide & fluide.',
                'text': 'La Box D-Link DWR-2000M offre un Wi-Fi 6 bi-bande pour streamer, jouer et télétravailler en toute fluidité.',
                'btnPrimaryLabel': 'Commandez maintenant', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'Fiche technique', 'btnSecondaryUrl': '#specs',
            },
        ],
    },
    'trust': {
        'enabled': True,
        'items': [
            {'value': '5G + 4G', 'label': 'Réseau hybride'},
            {'value': 'Wi-Fi 6', 'label': 'Bi-bande'},
            {'value': '1 min', 'label': 'Installation'},
            {'value': 'Box offerte', 'label': "Durée d'abonnement"},
            {'value': '24/7', 'label': 'Support client'},
        ],
    },
    'about': {
        'enabled': True,
        'tagline': 'À propos de la Box 5G',
        'title': 'Internet ultra-rapide',
        'titleHighlight': 'sans fibre, sans technicien.',
        'text': "La TOPNET Box 5G transforme le réseau mobile en internet domestique. Branchez la micro-SIM, connectez vos appareils en Wi-Fi 6 et profitez d'un débit descendant jusqu'à 100 Mbps, avec basculement automatique 4G/5G.",
        'features': [
            {'text': 'Super-fast dongle 5G'},
            {'text': 'Wi-Fi 6 haute vitesse'},
            {'text': 'SIM prépayée incluse'},
            {'text': 'Mises à jour 5G incluses'},
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
                'features': [{'text': 'Usage quotidien'}, {'text': 'EasyMesh inclus'}, {'text': 'Box offerte'}],
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
        'subtitle': 'Box offerte, installation gratuite et engagement de 24 mois.',
        'groups': [
            {'name': '30M', 'cards': [
                plan_card('30', 'M', '55.9', 'Usage quotidien', '', False, ['Wi-Fi 6 bi-bande', 'Box D-Link offerte', 'Usage quotidien']),
                plan_card('30', 'M', '65.9', 'Famille connectée', '⭐ Populaire', True, ['Wi-Fi 6 bi-bande', 'EasyMesh inclus', 'Support prioritaire'], '/ mois · 12 mois'),
                plan_card('30', 'M', '75.9', 'Sans engagement', '', False, ['Wi-Fi 6 bi-bande', 'Box offerte', 'Résiliable à tout moment'], '/ mois · Sans engagement'),
            ]},
            {'name': '50M', 'cards': [
                plan_card('50', 'M', '69.9', 'Famille connectée', '⭐ Recommandé', True, ['Wi-Fi 6 bi-bande', 'EasyMesh inclus', 'Famille connectée']),
                plan_card('50', 'M', '79.9', 'Télétravail', '', False, ['Wi-Fi 6 bi-bande', 'EasyMesh inclus', 'Support prioritaire'], '/ mois · 12 mois'),
                plan_card('50', 'M', '89.9', 'Sans engagement', '', False, ['Wi-Fi 6 bi-bande', 'Box offerte', 'Résiliable à tout moment'], '/ mois · Sans engagement'),
            ]},
            {'name': '100M', 'cards': [
                plan_card('100', 'M', '110.9', 'Power User', '', False, ['Wi-Fi 6 bi-bande', '4K, gaming & télétravail', 'EasyMesh inclus']),
                plan_card('100', 'M', '120.9', 'Ultra', '⭐ Premium', True, ['Wi-Fi 6 bi-bande', 'Débit maximum', 'Support VIP'], '/ mois · 12 mois'),
                plan_card('100', 'M', '135.9', 'Sans engagement', '', False, ['Wi-Fi 6 bi-bande', '4K, gaming & télétravail', 'Résiliable à tout moment'], '/ mois · Sans engagement'),
            ]},
        ],
        'note': 'Offres valables dans la limite des stocks et de la couverture. Frais de mise en service offerts.',
    },
    'specs': {
        'enabled': True,
        'tagline': 'Fiche technique',
        'title': 'D-Link',
        'titleHighlight': 'DWR-2000M',
        'rows': [
            {'label': 'Réseau', 'value': '5G / 4G / LTE', 'highlight': True},
            {'label': 'Standard Wi-Fi', 'value': 'Wi-Fi 6 (802.11ax)', 'highlight': False},
            {'label': 'Débit 5 GHz', 'value': "Jusqu'à 1.2 Gbps", 'highlight': True},
            {'label': 'Débit 2.4 GHz', 'value': '574 Mbps', 'highlight': False},
            {'label': 'Utilisateurs simultanés', 'value': '512 (MU-MIMO)', 'highlight': False},
            {'label': 'Ports', 'value': '1× LAN + 1× WAN/LAN Gigabit', 'highlight': False},
            {'label': 'Sécurité', 'value': 'WPA3, 128 bits', 'highlight': False},
            {'label': 'RAM', 'value': '1 Go', 'highlight': False},
            {'label': 'Protocole mesh', 'value': 'EasyMesh', 'highlight': False},
            {'label': 'IPv6', 'value': 'Supporté', 'highlight': False},
        ],
    },
    'steps': {
        'enabled': True,
        'tagline': 'Mise en marche',
        'title': 'Connecté en',
        'titleHighlight': '3 étapes',
        'steps': [
            {'title': 'Insérez la micro-SIM', 'description': 'Placez la carte SIM fournie dans le logement dédié au dos de la Box.'},
            {'title': "Branchez l'alimentation", 'description': "Reliez l'adaptateur à une prise murale. Initialisation en ~45 secondes."},
            {'title': 'Connectez-vous au Wi-Fi', 'description': "SSID et mot de passe sur l'étiquette sous la Box. C'est tout."},
        ],
        'helpTitle': "Besoin d'aide ?",
        'helpText': "Appelez le 71 001 298 — disponible 7j/7, ou visitez l'Espace Topnet le plus proche.",
    },
    'faq': {
        'enabled': True,
        'tagline': 'FAQ',
        'title': 'Questions',
        'titleHighlight': 'fréquentes',
        'items': [
            {'question': 'La Box 5G nécessite-t-elle une ligne ADSL ?', 'answer': "Non. La Box 5G fonctionne uniquement via le réseau mobile (5G/4G). Il suffit d'insérer la carte SIM fournie et de la brancher."},
            {'question': "Que faire si la 5G n'est pas disponible chez moi ?", 'answer': "La Box bascule automatiquement sur le réseau 4G/LTE. Vous restez connecté, avec des débits pouvant atteindre 100 Mbps."},
            {'question': "Combien d'appareils puis-je connecter ?", 'answer': "Jusqu'à 512 appareils simultanés grâce au Wi-Fi 6 et au MU-MIMO. Idéal pour une maison très connectée."},
            {'question': 'La Box est-elle offerte ?', 'answer': 'Oui, la Box D-Link DWR-2000M est offerte pour toute souscription avec engagement de 24 mois.'},
            {'question': 'Comment suivre ma consommation ?', 'answer': "Via votre Espace client Topnet et l'application mobile, où vous pouvez consulter votre débit et votre data en temps réel."},
            {'question': 'Puis-je annuler mon abonnement ?', 'answer': 'Oui, selon la formule choisie. Les offres sans engagement peuvent être résiliées à tout moment sans frais.'},
        ],
    },
    'testimonials': {
        'enabled': True,
        'tagline': 'Avis clients',
        'title': 'Ce que disent',
        'titleHighlight': 'nos clients',
        'items': [
            {'quote': 'Installé en 5 minutes chez moi à Sousse. Le Wi-Fi 6 couvre toute la maison, même le jardin.', 'author': 'Sami A.', 'role': 'Abonné Box 5G 50M', 'rating': 5},
            {'quote': "Fini l'ADSL coupé les jours de pluie. Streaming 4K sans aucune coupure depuis trois mois.", 'author': 'Mehdi B.', 'role': 'Abonné Box 5G 100M', 'rating': 5},
            {'quote': "J'ai remplacé ma fibre en arrivant à Tunis. Installation simple et support très réactif.", 'author': 'Lamia T.', 'role': 'Abonnée Box 5G 30M', 'rating': 4},
        ],
    },
    'news': {
        'enabled': True,
        'tagline': 'Actualités',
        'title': 'Nos dernières',
        'titleHighlight': 'nouvelles',
        'items': [
            {'title': 'Topnet étend son réseau 5G à 8 nouveaux gouvernorats', 'excerpt': "La couverture 5G continue de s'étendre à travers le pays. Vérifiez l'éligibilité dans votre zone.", 'date': '12 Jan 2026', 'link': '#'},
            {'title': 'La Box 5G TOPNET primée meilleur équipement fixe sans fil 2026', 'excerpt': "Récompensée pour son autonomie, sa rapidité d'installation et son Wi-Fi 6.", 'date': '28 Fév 2026', 'link': '#'},
            {'title': 'Offre de lancement : la Box offerte avec engagement 24 mois', 'excerpt': "Profitez d'une offre spéciale pendant la période de lancement. Conditions en agence.", 'date': '15 Mar 2026', 'link': '#'},
        ],
    },
    'cta': {
        'enabled': True,
        'title': 'Prêt à passer à la 5G ?',
        'subtitle': 'Commandez en ligne dès maintenant ou rendez-vous dans votre Espace Topnet.',
        'btnLabel': 'Commandez maintenant', 'btnUrl': '#commander',
        'btnSecondaryLabel': '71 001 298', 'btnSecondaryUrl': 'tel:71001298',
    },
    'order': {
        'enabled': True,
        'tagline': 'Commandez en ligne',
        'title': 'Recevez votre',
        'titleHighlight': 'Box 5G chez vous',
        'subtitle': 'Remplissez le formulaire, un conseiller Topnet vous contacte sous 24h.',
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
    'site_name': 'توبنيت بوكس 5G',
    'phone': '71 001 298',
    'email': 'contact@topnet.tn',
    'address': 'شارع الأرض، المركز الحضري الشمالي، تونس',
    'topbar_left': 'خدمة العملاء 7/7 — 71 001 298',
    'cta_label': 'اطلب الآن',
    'lang_label': 'Français',
    'footer_about': 'الرائدة في خدمات الإنترنت في تونس منذ 2001. أكثر من 200,000 مشترك و12 وكالة في كامل أنحاء البلاد.',
    'copyright': '© 2026 توبنيت S.A. — جميع الحقوق محفوظة.',
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
            {'label': 'توبنيت موبايل', 'url': '#'},
            {'label': 'الشركات', 'url': '#'},
        ]},
        {'title': 'الدعم', 'links': [
            {'label': 'مركز المساعدة', 'url': '#'},
            {'label': 'تحقق من التغطية', 'url': '#'},
            {'label': 'فضاء العميل', 'url': '#'},
            {'label': 'ابحث عن وكالة', 'url': '#'},
            {'label': '71 001 298', 'url': 'tel:71001298'},
        ]},
        {'title': 'توبنيت', 'links': [
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
    'meta_title': 'توبنيت بوكس 5G — إنترنت فائق السرعة بدون أسلاك',
    'meta_description': 'اطلب بوكس 5G من توبنيت : تركيب في دقيقة واحدة، Wi-Fi 6، سرعات تصل إلى 100 ميجابت/ثانية. شبكة هجينة 5G + 4G. توصيل في كامل تونس.',
    'hero': {
        'enabled': True,
        'slides': [
            {
                'badge': 'جديد — متوفر الآن',
                'title': 'بوكس 5G توبنيت\nأوصله. شغّله.',
                'titleHighlight': 'استمتع.',
                'text': 'بوكس 5G من توبنيت : بدون فنّي، بدون كابل. أوصله واتصل واستمتع بسرعة فائقة تصل إلى 100 ميجابت/ثانية منذ الدقيقة الأولى.',
                'btnPrimaryLabel': 'اطلب الآن', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'شاهد الأسعار', 'btnSecondaryUrl': '#offres',
            },
            {
                'badge': 'شبكة هجينة 5G + 4G',
                'title': 'اتصال\nبلا حدود',
                'titleHighlight': 'في كل تونس.',
                'text': 'تغطية 5G مع تحويل تلقائي إلى 4G تضمن اتصالاً مستقراً حتى بعيداً عن الألياف.',
                'btnPrimaryLabel': 'اكتشف العروض', 'btnPrimaryUrl': '#offres',
                'btnSecondaryLabel': 'المساعدة', 'btnSecondaryUrl': '#faq',
            },
            {
                'badge': 'Wi-Fi 6 ثنائي النطاق',
                'title': 'حتى 1.2 جيجابت/ثانية\nمع Wi-Fi 6',
                'titleHighlight': 'سريع وسلس.',
                'text': 'بوكس D-Link DWR-2000M توفر Wi-Fi 6 ثنائي النطاق للبث والألعاب والعمل عن بُعد بسلاسة تامة.',
                'btnPrimaryLabel': 'اطلب الآن', 'btnPrimaryUrl': '#commander',
                'btnSecondaryLabel': 'المواصفات التقنية', 'btnSecondaryUrl': '#specs',
            },
        ],
    },
    'trust': {
        'enabled': True,
        'items': [
            {'value': '5G + 4G', 'label': 'شبكة هجينة'},
            {'value': 'Wi-Fi 6', 'label': 'ثنائي النطاق'},
            {'value': '1 دقيقة', 'label': 'التركيب'},
            {'value': 'البوكس مجاني', 'label': 'مدة الاشتراك'},
            {'value': '24/7', 'label': 'دعم العملاء'},
        ],
    },
    'about': {
        'enabled': True,
        'tagline': 'عن بوكس 5G',
        'title': 'إنترنت فائق السرعة',
        'titleHighlight': 'بدون ألياف وبدون فنّي.',
        'text': 'بوكس 5G من توبنيت يحوّل الشبكة المتنقلة إلى إنترنت منزلي. أدخل شريحة SIM، اربط أجهزتك عبر Wi-Fi 6 واستمتع بسرعة تحميل تصل إلى 100 ميجابت/ثانية مع تحويل تلقائي بين 4G و5G.',
        'features': [
            {'text': 'مودم 5G فائق السرعة'},
            {'text': 'Wi-Fi 6 عالي السرعة'},
            {'text': 'شريحة مسبقة الدفع'},
            {'text': 'تحديثات 5G مشمولة'},
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
            {'icon': '📶', 'title': 'إنترنت المنزل', 'description': 'البديل المثالي لخطوط ADSL لكل العائلة.', 'features': [{'text': 'استخدام يومي'}, {'text': 'EasyMesh مشمول'}, {'text': 'البوكس مجاني'}]},
            {'icon': '💼', 'title': 'العمل والألعاب', 'description': 'اتصال مستقر للمكالمات المرئية والسحابة والألعاب عبر الإنترنت.', 'features': [{'text': 'بث 4K'}, {'text': 'زمن استجابة منخفض'}, {'text': 'Wi-Fi 6'}]},
            {'icon': '🛰️', 'title': 'تغطية واسعة', 'description': '5G في المناطق المغطاة مع تحويل تلقائي إلى 4G في كل مكان.', 'features': [{'text': 'شبكة هجينة'}, {'text': 'سرعة تصل إلى 100 ميجابت/ثانية'}, {'text': 'تنقل'}]},
        ],
    },
    'plans': {
        'enabled': True,
        'tagline': 'أسعارنا',
        'title': 'اختر',
        'titleHighlight': 'عرض 5G الخاص بك',
        'subtitle': 'البوكس مجاني، التركيب مجاني والتزام 24 شهراً.',
        'groups': [
            {'name': '30M', 'cards': [
                plan_card_ar('30', 'M', '55.9', 'الاستخدام اليومي', '', False, ['Wi-Fi 6 ثنائي النطاق', 'بوكس D-Link مجانية', 'استخدام يومي']),
                plan_card_ar('30', 'M', '65.9', 'العائلة المتصلة', '⭐ شائع', True, ['Wi-Fi 6 ثنائي النطاق', 'EasyMesh مشمول', 'دعم ذو أولوية'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('30', 'M', '75.9', 'بدون التزام', '', False, ['Wi-Fi 6 ثنائي النطاق', 'البوكس مجاني', 'إلغاء في أي وقت'], '/ شهرياً · بدون التزام'),
            ]},
            {'name': '50M', 'cards': [
                plan_card_ar('50', 'M', '69.9', 'العائلة المتصلة', '⭐ موصى به', True, ['Wi-Fi 6 ثنائي النطاق', 'EasyMesh مشمول', 'العائلة المتصلة']),
                plan_card_ar('50', 'M', '79.9', 'العمل عن بُعد', '', False, ['Wi-Fi 6 ثنائي النطاق', 'EasyMesh مشمول', 'دعم ذو أولوية'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('50', 'M', '89.9', 'بدون التزام', '', False, ['Wi-Fi 6 ثنائي النطاق', 'البوكس مجاني', 'إلغاء في أي وقت'], '/ شهرياً · بدون التزام'),
            ]},
            {'name': '100M', 'cards': [
                plan_card_ar('100', 'M', '110.9', 'المستخدم القوي', '', False, ['Wi-Fi 6 ثنائي النطاق', 'بث 4K وألعاب وعمل', 'EasyMesh مشمول']),
                plan_card_ar('100', 'M', '120.9', 'ألترا', '⭐ بريميوم', True, ['Wi-Fi 6 ثنائي النطاق', 'السرعة القصوى', 'دعم VIP'], '/ شهرياً · 12 شهراً'),
                plan_card_ar('100', 'M', '135.9', 'بدون التزام', '', False, ['Wi-Fi 6 ثنائي النطاق', 'بث 4K وألعاب وعمل', 'إلغاء في أي وقت'], '/ شهرياً · بدون التزام'),
            ]},
        ],
        'note': 'العروض صالحة حسب المخزون والتغطية. رسوم التركيب مجانية.',
    },
    'specs': {
        'enabled': True,
        'tagline': 'المواصفات التقنية',
        'title': 'D-Link',
        'titleHighlight': 'DWR-2000M',
        'rows': [
            {'label': 'الشبكة', 'value': '5G / 4G / LTE', 'highlight': True},
            {'label': 'معيار Wi-Fi', 'value': 'Wi-Fi 6 (802.11ax)', 'highlight': False},
            {'label': 'سرعة 5 جيجاهرتز', 'value': 'حتى 1.2 جيجابت/ثانية', 'highlight': True},
            {'label': 'سرعة 2.4 جيجاهرتز', 'value': '574 ميجابت/ثانية', 'highlight': False},
            {'label': 'مستخدمون متزامنون', 'value': '512 (MU-MIMO)', 'highlight': False},
            {'label': 'المنافذ', 'value': '1× LAN + 1× WAN/LAN Gigabit', 'highlight': False},
            {'label': 'الأمان', 'value': 'WPA3، 128 بت', 'highlight': False},
            {'label': 'الذاكرة', 'value': '1 جيجابايت', 'highlight': False},
            {'label': 'بروتوكول الشبكة', 'value': 'EasyMesh', 'highlight': False},
            {'label': 'IPv6', 'value': 'مدعوم', 'highlight': False},
        ],
    },
    'steps': {
        'enabled': True,
        'tagline': 'التشغيل',
        'title': 'متصل عبر',
        'titleHighlight': '3 خطوات',
        'steps': [
            {'title': 'أدخل بطاقة micro-SIM', 'description': 'ضع بطاقة SIM المرفقة في المكان المخصص في الجزء الخلفي من البوكس.'},
            {'title': 'أوصله بالكهرباء', 'description': 'اربط المحول بمقبس الحائط. التشغيل يستغرق حوالي 45 ثانية.'},
            {'title': 'اتصل بشبكة Wi-Fi', 'description': 'اسم الشبكة وكلمة المرور موجودان على الملصق أسفل البوكس. هذا كل شيء.'},
        ],
        'helpTitle': 'تحتاج مساعدة؟',
        'helpText': 'اتصل على 71 001 298 — متاح 7/7، أو زر أقرب مركز توبنيت.',
    },
    'faq': {
        'enabled': True,
        'tagline': 'الأسئلة الشائعة',
        'title': 'أسئلة',
        'titleHighlight': 'متكررة',
        'items': [
            {'question': 'هل تحتاج بوكس 5G إلى خط هاتف أو ألياف؟', 'answer': 'لا. تعمل بوكس 5G حصرياً عبر الشبكة المتنقلة (5G/4G). يكفي إدخال بطاقة SIM المرفقة وتشغيلها.'},
            {'question': 'ماذا أفعل إذا لم تتوفر 5G في منطقتي؟', 'answer': 'تتحول البوكس تلقائياً إلى شبكة 4G/LTE. تبقى متصلاً بسرعات قد تصل إلى 100 ميجابت/ثانية.'},
            {'question': 'كم عدد الأجهزة التي يمكن ربطها؟', 'answer': 'حتى 512 جهازاً متزامناً بفضل Wi-Fi 6 وتقنية MU-MIMO. مثالي للمنازل شديدة الاتصال.'},
            {'question': 'هل البوكس مجاني؟', 'answer': 'نعم، بوكس D-Link DWR-2000M مجانية مع أي اشتراك بالتزام 24 شهراً.'},
            {'question': 'كيف أتابع استهلاكي؟', 'answer': 'عبر فضاء العميل وتطبيق الهاتف حيث يمكنك الاطلاع على سرعتك وبياناتك لحظياً.'},
            {'question': 'هل يمكنني إلغاء اشتراكي؟', 'answer': 'نعم، حسب الصيغة المختارة. عروض بدون التزام قابلة للإلغاء في أي وقت دون رسوم.'},
        ],
    },
    'testimonials': {
        'enabled': True,
        'tagline': 'آراء العملاء',
        'title': 'ماذا يقول',
        'titleHighlight': 'عملاؤنا',
        'items': [
            {'quote': 'ركّبته في 5 دقائق في منزلي بسوسة. Wi-Fi 6 يغطي المنزل كله حتى الحديقة.', 'author': 'سامي ع.', 'role': 'مشترك بوكس 5G 50M', 'rating': 5},
            {'quote': 'وداعاً للأدسل الذي ينقطع أيام المطر. بث 4K دون أي انقطاع منذ ثلاثة أشهر.', 'author': 'مهدي ب.', 'role': 'مشترك بوكس 5G 100M', 'rating': 5},
            {'quote': 'استبدلت الألياف عند وصولي إلى تونس. تركيب بسيط ودعم سريع جداً.', 'author': 'لمياء ت.', 'role': 'مشتركة بوكس 5G 30M', 'rating': 4},
        ],
    },
    'news': {
        'enabled': True,
        'tagline': 'الأخبار',
        'title': 'آخر',
        'titleHighlight': 'المستجدات',
        'items': [
            {'title': 'توبنيت توسّع شبكة 5G إلى 8 ولايات جديدة', 'excerpt': 'تواصل تغطية 5G توسعها عبر البلاد. تحقق من التغطية في منطقتك.', 'date': '12 جانفي 2026', 'link': '#'},
            {'title': 'بوكس 5G توبنيت يفوز بجائزة أفضل جهاز ثابت لاسلكي 2026', 'excerpt': 'تقديراً لاستقلاليته وسرعة تركيبه وتقنية Wi-Fi 6.', 'date': '28 فيفري 2026', 'link': '#'},
            {'title': 'عرض الإطلاق : البوكس مجانية مع التزام 24 شهراً', 'excerpt': 'استفد من عرض خاص خلال فترة الإطلاق. الشروط لدى الوكالات.', 'date': '15 مارس 2026', 'link': '#'},
        ],
    },
    'cta': {
        'enabled': True,
        'title': 'مستعد للانتقال إلى 5G؟',
        'subtitle': 'اطلب عبر الإنترنت الآن أو توجه إلى أقرب مركز توبنيت.',
        'btnLabel': 'اطلب الآن', 'btnUrl': '#commander',
        'btnSecondaryLabel': '71 001 298', 'btnSecondaryUrl': 'tel:71001298',
    },
    'order': {
        'enabled': True,
        'tagline': 'اطلب عبر الإنترنت',
        'title': 'استلم',
        'titleHighlight': 'بوكس 5G في منزلك',
        'subtitle': 'املأ الاستمارة وسيتصل بك مستشار توبنيت خلال 24 ساعة.',
        'labelFirstname': 'الاسم *', 'placeholderFirstname': 'مثال : محمد',
        'labelLastname': 'اللقب *', 'placeholderLastname': 'مثال : بن علي',
        'labelPhone': 'رقم الهاتف *', 'placeholderPhone': 'مثال : 55 123 456',
        'labelGovernorate': 'الولاية *', 'placeholderGovernorate': 'اختر',
        'labelAddress': 'العنوان الكامل *', 'placeholderAddress': 'الشارع، البناية، المدينة…',
        'labelExisting': 'هل أنت مشترك توبنيت بالفعل؟ *',
        'optionYes': 'نعم، أنا مشترك', 'optionNo': 'لا، أنا جديد',
        'labelPlan': 'اختر عرضك *', 'submitLabel': 'اطلب',
        'disclaimer': 'بياناتك سرية وتُستخدم فقط في إطار طلب اشتراكك.',
        'msgRequired': 'يرجى ملء جميع الحقول الإلزامية.',
        'msgSuccess': 'تم إرسال طلبك! سيتصل بك مستشار توبنيت خلال 24 ساعة.',
        'msgError': 'حدث خطأ، يرجى إعادة المحاولة.',
        'governorates': [{'text': g} for g in GOVERNORATES_AR],
    },
    'newsletter': {
        'enabled': True,
        'tagline': 'النشرة البريدية',
        'title': 'ابقَ',
        'titleHighlight': 'متابعاً',
        'subtitle': 'استلم آخر العروض وأخبار 5G من توبنيت.',
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


def main():
    log('🌱 Démarrage du seed...')
    seed_superuser()
    seed_site_config()
    seed_home_page()
    log('\n🎉 Seed terminé avec succès !')
    log(f'   Django Admin : http://localhost:8000/django-admin/ ({ADMIN_EMAIL} / {ADMIN_PASSWORD})')
    log('   Custom Admin : http://localhost:3001/admin/')


if __name__ == '__main__':
    main()
