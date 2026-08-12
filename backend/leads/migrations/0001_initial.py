from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Lead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstname', models.CharField(max_length=100, verbose_name='Prénom')),
                ('lastname', models.CharField(blank=True, max_length=100, verbose_name='Nom')),
                ('phone', models.CharField(max_length=30, verbose_name='Téléphone')),
                ('governorate', models.CharField(max_length=100, verbose_name='Gouvernorat')),
                ('address', models.TextField(blank=True, verbose_name='Adresse')),
                ('existing_subscriber', models.CharField(blank=True, max_length=10, verbose_name='Déjà abonné Topnet ?')),
                ('plan', models.CharField(max_length=50, verbose_name='Offre choisie')),
                ('locale', models.CharField(choices=[('fr', 'Français'), ('ar', 'عربي')], default='fr', max_length=5, verbose_name='Langue')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date')),
            ],
            options={
                'verbose_name': 'Demande de commande',
                'verbose_name_plural': 'Demandes de commande',
                'ordering': ['-created_at'],
            },
        ),
    ]
