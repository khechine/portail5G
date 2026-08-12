from django.db import models


class Lead(models.Model):
    """
    Équivalent de la Collection Type Strapi 'lead'.
    Stocke les demandes de commande et les inscriptions newsletter.
    """
    LOCALE_CHOICES = [('fr', 'Français'), ('ar', 'عربي')]

    firstname = models.CharField(max_length=100, verbose_name='Prénom')
    lastname = models.CharField(max_length=100, blank=True, verbose_name='Nom')
    phone = models.CharField(max_length=30, verbose_name='Téléphone')
    governorate = models.CharField(max_length=100, verbose_name='Gouvernorat')
    address = models.TextField(blank=True, verbose_name='Adresse')
    existing_subscriber = models.CharField(
        max_length=10, blank=True,
        verbose_name='Déjà abonné Topnet ?'
    )
    plan = models.CharField(max_length=50, verbose_name='Offre choisie')
    locale = models.CharField(
        max_length=5, default='fr',
        choices=LOCALE_CHOICES,
        verbose_name='Langue'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date')

    class Meta:
        verbose_name = 'Demande de commande'
        verbose_name_plural = 'Demandes de commande'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.firstname} {self.lastname} — {self.plan} ({self.governorate})'
