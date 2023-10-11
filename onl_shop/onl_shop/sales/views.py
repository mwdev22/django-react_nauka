from rest_framework import generics
from .models import Sale, Transaction
from .serializers import SaleSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework import status


class SaleList(generics.ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = (AllowAny,)
    
class SaleCreate(generics.CreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = Sale.objects.all()
    serializer_class.meta.fields = ['name', 'category', 'description', 'price', 'img']
    authentication_classes = [IsAuthenticated,]

    def perform_create(self, serializer):
    #   przypisuje użytkownika jako sprzedawce
        serializer.save(seller=self.request.user)

class SaleUpdate(generics.UpdateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    serializer_class.meta.fields = ['name', 'category', 'description', 'price', 'img','is_active']
        
class SaleDelete(generics.DestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

class CreateTransaction(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
