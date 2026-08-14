from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('fr', 'Français'), ('ar', 'عربي')], max_length=5, unique=True)),
                ('meta_title', models.CharField(blank=True, max_length=200)),
                ('meta_description', models.TextField(blank=True)),
                ('hero', models.JSONField(blank=True, default=dict)),
                ('trust', models.JSONField(blank=True, default=dict)),
                ('about', models.JSONField(blank=True, default=dict)),
                ('services', models.JSONField(blank=True, default=dict)),
                ('plans', models.JSONField(blank=True, default=dict)),
                ('specs', models.JSONField(blank=True, default=dict)),
                ('steps', models.JSONField(blank=True, default=dict)),
                ('faq', models.JSONField(blank=True, default=dict)),
                ('testimonials', models.JSONField(blank=True, default=dict)),
                ('news', models.JSONField(blank=True, default=dict)),
                ('cta', models.JSONField(blank=True, default=dict)),
                ('order', models.JSONField(blank=True, default=dict)),
                ('newsletter', models.JSONField(blank=True, default=dict)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': "Page d'accueil",
                'verbose_name_plural': "Pages d'accueil",
            },
        ),
        migrations.CreateModel(
            name='SiteConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('fr', 'Français'), ('ar', 'عربي')], max_length=5, unique=True)),
                ('site_name', models.CharField(blank=True, max_length=100)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='config/')),
                ('favicon', models.FileField(blank=True, null=True, upload_to='config/')),
                ('primary_color', models.CharField(default='#e2418c', max_length=20)),
                ('primary_dark', models.CharField(default='#e08e00', max_length=20)),
                ('heading_color', models.CharField(default='#251444', max_length=20)),
                ('text_color', models.CharField(default='#737177', max_length=20)),
                ('light_bg', models.CharField(default='#F7F5F1', max_length=20)),
                ('border_color', models.CharField(default='#E6E2D9', max_length=20)),
                ('dark_bg', models.CharField(default='#251444', max_length=20)),
                ('body_font', models.CharField(default='Outfit', max_length=100)),
                ('heading_font', models.CharField(default='Outfit', max_length=100)),
                ('arabic_font', models.CharField(default='Cairo', max_length=100)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('address', models.CharField(blank=True, max_length=255)),
                ('topbar_left', models.CharField(blank=True, max_length=255)),
                ('cta_label', models.CharField(blank=True, max_length=100)),
                ('cta_url', models.CharField(blank=True, max_length=255)),
                ('lang_label', models.CharField(blank=True, max_length=50)),
                ('footer_about', models.TextField(blank=True)),
                ('copyright', models.CharField(blank=True, max_length=255)),
                ('nav_items', models.JSONField(blank=True, default=list)),
                ('socials', models.JSONField(blank=True, default=list)),
                ('footer_columns', models.JSONField(blank=True, default=list)),
                ('legal_links', models.JSONField(blank=True, default=list)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Configuration du site',
                'verbose_name_plural': 'Configurations du site',
            },
        ),
    ]
