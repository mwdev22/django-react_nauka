from rest_framework.response import Response
from rest_framework import viewsets
from .models import Sale
from .serializers import SaleSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class SaleViewSet(viewsets.ModelViewSet):

    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    
        
