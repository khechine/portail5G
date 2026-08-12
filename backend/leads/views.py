import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Lead
from .serializers import LeadSerializer, LeadListSerializer


class LeadCreateView(APIView):
    """
    POST /api/leads/
    Crée un nouveau lead (demande de commande ou newsletter).
    Accessible publiquement (le site Express y poste).
    Compatible avec le payload envoyé par site/server.js.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # Support both flat payload and Strapi-style { data: {...} }
        payload = request.data.get('data', request.data)

        # Map Strapi field names → Django field names
        data = {
            'firstname': payload.get('firstname', ''),
            'lastname': payload.get('lastname', ''),
            'phone': payload.get('phone', ''),
            'governorate': payload.get('governorate', ''),
            'address': payload.get('address', ''),
            'existing_subscriber': payload.get('existingSubscriber', ''),
            'plan': payload.get('plan', ''),
            'locale': payload.get('locale', 'fr'),
        }

        # Validation minimale (miroir de site/server.js)
        required = ['firstname', 'phone', 'governorate', 'plan']
        missing = [f for f in required if not data.get(f, '').strip()]
        if missing:
            return Response({'ok': False, 'error': 'required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LeadSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'ok': True}, status=status.HTTP_201_CREATED)
        return Response({'ok': False, 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LeadListView(APIView):
    """
    GET /api/leads/              → liste paginée (admin uniquement)
    GET /api/leads/?export=csv   → export CSV (admin uniquement)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Lead.objects.all()

        # Filtres
        locale = request.query_params.get('locale')
        plan = request.query_params.get('plan')
        governorate = request.query_params.get('governorate')
        search = request.query_params.get('search')

        if locale:
            qs = qs.filter(locale=locale)
        if plan:
            qs = qs.filter(plan__icontains=plan)
        if governorate:
            qs = qs.filter(governorate__icontains=governorate)
        if search:
            qs = qs.filter(
                firstname__icontains=search
            ) | qs.filter(
                lastname__icontains=search
            ) | qs.filter(
                phone__icontains=search
            )

        # Export CSV
        if request.query_params.get('export') == 'csv':
            return self._export_csv(qs)

        # Pagination simple
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size
        total = qs.count()

        serializer = LeadListSerializer(qs[start:end], many=True)
        return Response({
            'count': total,
            'page': page,
            'page_size': page_size,
            'results': serializer.data,
        })

    def _export_csv(self, qs):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="leads.csv"'
        response.write('\ufeff')  # BOM UTF-8 pour Excel

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Prénom', 'Nom', 'Téléphone', 'Gouvernorat',
            'Adresse', 'Déjà abonné', 'Offre', 'Langue', 'Date',
        ])
        for lead in qs:
            writer.writerow([
                lead.id, lead.firstname, lead.lastname, lead.phone,
                lead.governorate, lead.address, lead.existing_subscriber,
                lead.plan, lead.locale,
                lead.created_at.strftime('%Y-%m-%d %H:%M'),
            ])
        return response


class LeadDetailView(APIView):
    """
    GET    /api/leads/<id>/   → détail (admin)
    DELETE /api/leads/<id>/   → suppression (admin)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Lead.objects.get(pk=pk)
        except Lead.DoesNotExist:
            return None

    def get(self, request, pk):
        lead = self.get_object(pk)
        if not lead:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(LeadSerializer(lead).data)

    def delete(self, request, pk):
        lead = self.get_object(pk)
        if not lead:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        lead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
