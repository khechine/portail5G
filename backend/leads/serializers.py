from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id', 'firstname', 'lastname', 'phone',
            'governorate', 'address', 'existing_subscriber',
            'plan', 'locale', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_firstname(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Le prénom est obligatoire.')
        return value.strip()

    def validate_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Le téléphone est obligatoire.')
        return value.strip()

    def validate_governorate(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Le gouvernorat est obligatoire.')
        return value.strip()

    def validate_plan(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("L'offre est obligatoire.")
        return value.strip()


class LeadListSerializer(serializers.ModelSerializer):
    """Serializer léger pour la liste admin."""
    class Meta:
        model = Lead
        fields = [
            'id', 'firstname', 'lastname', 'phone',
            'governorate', 'plan', 'locale', 'created_at',
        ]
