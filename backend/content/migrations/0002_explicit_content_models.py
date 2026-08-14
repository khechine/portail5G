from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FaqItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=300, verbose_name='Question')),
                ('answer', models.TextField(verbose_name='Réponse')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Question / Réponse FAQ',
                'verbose_name_plural': 'FAQ - Questions / Réponses',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='HeroSlide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('badge', models.CharField(blank=True, max_length=200, verbose_name='Badge')),
                ('title', models.TextField(blank=True, verbose_name='Titre principal')),
                ('title_highlight', models.CharField(blank=True, max_length=200, verbose_name='Titre surbrillance')),
                ('text', models.TextField(blank=True, verbose_name='Texte descriptif')),
                ('image', models.ImageField(blank=True, null=True, upload_to='hero/', verbose_name='Image du slide')),
                ('btn_primary_label', models.CharField(blank=True, max_length=100, verbose_name='Libellé Bouton 1')),
                ('btn_primary_url', models.CharField(blank=True, max_length=255, verbose_name='URL Bouton 1')),
                ('btn_secondary_label', models.CharField(blank=True, max_length=100, verbose_name='Libellé Bouton 2')),
                ('btn_secondary_url', models.CharField(blank=True, max_length=255, verbose_name='URL Bouton 2')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Slide Hero',
                'verbose_name_plural': 'Hero - Slides (Bannières)',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='NewsItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Titre article')),
                ('excerpt', models.TextField(blank=True, verbose_name='Extrait / Résumé')),
                ('date', models.CharField(blank=True, max_length=100, verbose_name="Date d'affichage")),
                ('image', models.ImageField(blank=True, null=True, upload_to='news/', verbose_name='Image article')),
                ('link', models.CharField(default='#', max_length=255, verbose_name='Lien vers article')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Actualité / Article',
                'verbose_name_plural': 'Actualités / Nouveautés',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='PlanGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name="Nom de l'onglet (ex: 30M, 50M)")),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': "Groupe d'offres",
                'verbose_name_plural': "Offres - Onglets (30M, 50M, 100M)",
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='ServiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('icon', models.CharField(blank=True, max_length=50, verbose_name='Icône / Emoji')),
                ('title', models.CharField(max_length=200, verbose_name='Titre du service')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('features', models.JSONField(blank=True, default=list, verbose_name='Liste des points')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Service / Usage',
                'verbose_name_plural': 'Services - Cartes usages',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='SpecRow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=150, verbose_name='Libellé spécification')),
                ('value', models.CharField(max_length=200, verbose_name='Valeur')),
                ('highlight', models.BooleanField(default=False, verbose_name='Mettre en valeur ?')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Ligne spécification',
                'verbose_name_plural': 'Fiche technique - Lignes',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='StepItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titre étape')),
                ('description', models.TextField(blank=True, verbose_name='Description étape')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Étape de mise en marche',
                'verbose_name_plural': 'Étapes de mise en marche',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='TestimonialItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quote', models.TextField(verbose_name='Citation / Avis')),
                ('author', models.CharField(max_length=150, verbose_name='Nom client')),
                ('role', models.CharField(blank=True, max_length=150, verbose_name='Statut / Offre souscrite')),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='avatars/', verbose_name='Photo client')),
                ('rating', models.PositiveIntegerField(default=5, verbose_name='Note (1 à 5)')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Avis client',
                'verbose_name_plural': 'Témoignages / Avis clients',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='TrustItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=100, verbose_name='Valeur / Stat')),
                ('label', models.CharField(max_length=100, verbose_name='Libellé')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Élément de confiance',
                'verbose_name_plural': 'Bandeau Confiance (Stats)',
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_button_label',
            field=models.CharField(blank=True, max_length=100, verbose_name='À propos - Libellé Bouton'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_button_url',
            field=models.CharField(blank=True, max_length=255, verbose_name='À propos - URL Bouton'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_enabled',
            field=models.BooleanField(default=True, verbose_name='Section À propos activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_features',
            field=models.JSONField(blank=True, default=list, verbose_name='À propos - Caractéristiques'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_image',
            field=models.ImageField(blank=True, null=True, upload_to='about/', verbose_name='À propos - Image'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='À propos - Tagline / Surtitre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_text',
            field=models.TextField(blank=True, verbose_name='À propos - Texte de présentation'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='À propos - Titre principal'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='about_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='À propos - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_background',
            field=models.ImageField(blank=True, null=True, upload_to='cta/', verbose_name='CTA - Image de fond'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_btn_label',
            field=models.CharField(blank=True, max_length=100, verbose_name='CTA - Libellé Bouton 1'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_btn_secondary_label',
            field=models.CharField(blank=True, max_length=100, verbose_name='CTA - Libellé Bouton 2'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_btn_secondary_url',
            field=models.CharField(blank=True, max_length=255, verbose_name='CTA - URL Bouton 2'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_btn_url',
            field=models.CharField(blank=True, max_length=255, verbose_name='CTA - URL Bouton 1'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_enabled',
            field=models.BooleanField(default=True, verbose_name='Section CTA activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_subtitle',
            field=models.TextField(blank=True, verbose_name='CTA - Sous-titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='cta_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='CTA - Titre principal'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='faq_enabled',
            field=models.BooleanField(default=True, verbose_name='Section FAQ activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='faq_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='FAQ - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='faq_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='FAQ - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='faq_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='FAQ - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='hero_enabled',
            field=models.BooleanField(default=True, verbose_name='Hero Slider activé ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='news_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Actualités activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='news_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Actualités - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='news_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Actualités - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='news_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Actualités - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Offres activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_note',
            field=models.TextField(blank=True, verbose_name='Offres - Note de bas de page'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_subtitle',
            field=models.TextField(blank=True, verbose_name='Offres - Sous-titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Offres - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Offres - Titre principal'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Offres - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Services activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_subtitle',
            field=models.TextField(blank=True, verbose_name='Services - Sous-titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Services - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Services - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Services - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Fiche Technique activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_image',
            field=models.ImageField(blank=True, null=True, upload_to='specs/', verbose_name='Specs - Image du routeur'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Specs - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Specs - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Specs - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Étapes activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_help_text',
            field=models.TextField(blank=True, verbose_name='Étapes - Texte encadré aide'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_help_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Étapes - Titre encadré aide'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Étapes - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Étapes - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Étapes - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='testimonials_enabled',
            field=models.BooleanField(default=True, verbose_name='Section Avis activée ?'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='testimonials_tagline',
            field=models.CharField(blank=True, max_length=150, verbose_name='Avis - Tagline'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='testimonials_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Avis - Titre'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='testimonials_title_highlight',
            field=models.CharField(blank=True, max_length=200, verbose_name='Avis - Titre surbrillance'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='trust_enabled',
            field=models.BooleanField(default=True, verbose_name='Bandeau Confiance activé ?'),
        ),
        migrations.AlterField(
            model_name='homepage',
            name='meta_description',
            field=models.TextField(blank=True, verbose_name='Méta Description SEO'),
        ),
        migrations.AlterField(
            model_name='homepage',
            name='meta_title',
            field=models.CharField(blank=True, max_length=200, verbose_name='Méta Titre SEO'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='address',
            field=models.CharField(blank=True, max_length=255, verbose_name='Adresse postale'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='arabic_font',
            field=models.CharField(default='Cairo', max_length=100, verbose_name='Police arabe'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='body_font',
            field=models.CharField(default='Outfit', max_length=100, verbose_name='Police du corps'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='border_color',
            field=models.CharField(default='#E6E2D9', max_length=20, verbose_name='Couleur des bordures'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='copyright',
            field=models.CharField(blank=True, max_length=255, verbose_name='Copyright'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='cta_label',
            field=models.CharField(blank=True, max_length=100, verbose_name='Header - Libellé Bouton'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='cta_url',
            field=models.CharField(blank=True, max_length=255, verbose_name='Header - URL Bouton'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='dark_bg',
            field=models.CharField(default='#251444', max_length=20, verbose_name='Fond sombre'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Email de contact'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='favicon',
            field=models.FileField(blank=True, null=True, upload_to='config/', verbose_name='Favicon'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='footer_about',
            field=models.TextField(blank=True, verbose_name='Footer - Texte à propos'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='footer_columns',
            field=models.JSONField(blank=True, default=list, verbose_name='Colonnes du footer'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='heading_color',
            field=models.CharField(default='#251444', max_length=20, verbose_name='Couleur des titres'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='heading_font',
            field=models.CharField(default='Outfit', max_length=100, verbose_name='Police des titres'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='lang_label',
            field=models.CharField(blank=True, max_length=50, verbose_name='Libellé sélecteur de langue'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='legal_links',
            field=models.JSONField(blank=True, default=list, verbose_name='Liens légaux'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='light_bg',
            field=models.CharField(default='#F7F5F1', max_length=20, verbose_name='Fond clair'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to='config/', verbose_name='Logo'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='nav_items',
            field=models.JSONField(blank=True, default=list, verbose_name='Liens de navigation'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='phone',
            field=models.CharField(blank=True, max_length=30, verbose_name='Téléphone'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='primary_color',
            field=models.CharField(default='#e2418c', max_length=20, verbose_name='Couleur principale'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='primary_dark',
            field=models.CharField(default='#e08e00', max_length=20, verbose_name='Couleur sombre principale'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='site_name',
            field=models.CharField(blank=True, max_length=100, verbose_name='Nom du site'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='socials',
            field=models.JSONField(blank=True, default=list, verbose_name='Réseaux sociaux'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='text_color',
            field=models.CharField(default='#737177', max_length=20, verbose_name='Couleur du texte'),
        ),
        migrations.AlterField(
            model_name='siteconfig',
            name='topbar_left',
            field=models.CharField(blank=True, max_length=255, verbose_name='Texte topbar gauche'),
        ),
        migrations.CreateModel(
            name='PlanCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('speed', models.CharField(max_length=50, verbose_name='Débit')),
                ('speed_unit', models.CharField(default='M', max_length=20, verbose_name='Unité débit')),
                ('speed_label', models.CharField(default='Débit descendant', max_length=100, verbose_name='Libellé débit')),
                ('title', models.CharField(max_length=200, verbose_name='Nom du forfait')),
                ('price', models.CharField(max_length=50, verbose_name='Prix')),
                ('currency', models.CharField(default='DT', max_length=20, verbose_name='Devise')),
                ('period', models.CharField(default='/ mois · 24 mois', max_length=100, verbose_name='Période')),
                ('badge', models.CharField(blank=True, max_length=100, verbose_name='Badge')),
                ('recommended', models.BooleanField(default=False, verbose_name='Recommandé ?')),
                ('image', models.ImageField(blank=True, null=True, upload_to='plans/', verbose_name='Image forfait')),
                ('button_label', models.CharField(default='Commander', max_length=100, verbose_name='Libellé Bouton')),
                ('button_url', models.CharField(default='#commander', max_length=255, verbose_name='URL Bouton')),
                ('features', models.JSONField(blank=True, default=list, verbose_name='Caractéristiques')),
                ('order', models.PositiveIntegerField(default=0)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cards', to='content.plangroup')),
            ],
            options={
                'verbose_name': "Carte d'offre",
                'verbose_name_plural': "Offres - Cartes de tarifs",
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='homepage',
            name='faq_items',
            field=models.ManyToManyField(blank=True, to='content.faqitem', verbose_name='Questions / Réponses'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='hero_slides',
            field=models.ManyToManyField(blank=True, to='content.heroslide', verbose_name='Slides du Hero'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='news_items',
            field=models.ManyToManyField(blank=True, to='content.newsitem', verbose_name="Articles d'actualité"),
        ),
        migrations.AddField(
            model_name='homepage',
            name='plans_groups',
            field=models.ManyToManyField(blank=True, to='content.plangroup', verbose_name="Onglets d'offres"),
        ),
        migrations.AddField(
            model_name='homepage',
            name='services_items',
            field=models.ManyToManyField(blank=True, to='content.serviceitem', verbose_name='Cartes de service'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='specs_rows',
            field=models.ManyToManyField(blank=True, to='content.specrow', verbose_name='Lignes de spécifications'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='steps_items',
            field=models.ManyToManyField(blank=True, to='content.stepitem', verbose_name='Liste des étapes'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='testimonials_items',
            field=models.ManyToManyField(blank=True, to='content.testimonialitem', verbose_name='Liste des avis'),
        ),
        migrations.AddField(
            model_name='homepage',
            name='trust_items',
            field=models.ManyToManyField(blank=True, to='content.trustitem', verbose_name='Stats de confiance'),
        ),
    ]
