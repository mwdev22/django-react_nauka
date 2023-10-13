from rest_framework import generics
from .models import Sale, Transaction
from .serializers import SaleSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404



class SaleList(generics.ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = (AllowAny,)
    
class SaleCreate(generics.CreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    serializer_class.Meta.fields = ['name', 'category', 'description', 'price', 'img']
    authentication_classes = [IsAuthenticated,]

    def perform_create(self, serializer):
    #   przypisuje użytkownika jako sprzedawce
        serializer.save(seller=self.request.user)

class SaleUpdate(generics.UpdateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    serializer_class.Meta.fields = ['name', 'category', 'description', 'price', 'img','is_active']
        
class SaleDelete(generics.DestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

class CreateTransaction(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer, pk):
        serializer.save(sale=get_object_or_404(Sale, pk=pk))

class UserTransactionList(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
    #   filtrowanie wyników zapytania, by użytkownik otrzymywał info tylko o swoich transakcjach
        queryset = Transaction.objects.filter(Q(seller=user) | Q(buyer=user))
        return queryset