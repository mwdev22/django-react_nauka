from rest_framework import generics
from .models import Sale, Transaction
from .serializers import SaleSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication, TokenUser
from django.db.models import Q
from django.shortcuts import get_object_or_404
from accounts.models import User




class SaleList(generics.ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    
class SaleCreate(generics.CreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    serializer_class.Meta.fields = ['id','name', 'category', 'description', 'price', 'img']
    authentication_classes = [JWTTokenUserAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
    #   przypisuje użytkownika jako sprzedawce
        user = get_object_or_404(User, id=self.request.user.id)
        serializer.save(seller=user, is_active=True)


class SaleUpdate(generics.UpdateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    authentication_classes = [JWTTokenUserAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        sale_id = self.kwargs.get('pk')  
        sale = get_object_or_404(Sale, id=sale_id)

        if sale.seller.id == self.request.user.id:
            serializer.save()
        else:
            raise PermissionDenied("You are not the seller!")

class SaleDelete(generics.DestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTTokenUserAuthentication]
    # zwraca 204


class CreateTransaction(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated,]
    authentication_classes = [JWTTokenUserAuthentication]

    def perform_create(self, serializer):
        sale = get_object_or_404(Sale, pk=self.request.sale.id)
        seller = get_object_or_404(User, pk=sale.seller.id)
        buyer = get_object_or_404(User, pk=self.request.user.id)
        price = sale.price
        serializer.save(seller=seller, sale=sale, buyer=buyer, price=price)
        

class UserTransactionList(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTTokenUserAuthentication]

    def get_queryset(self):
        user = get_object_or_404(User, id=self.request.user.id)
    #   filtrowanie wyników zapytania, by użytkownik otrzymywał info tylko o swoich transakcjach
        queryset = Transaction.objects.filter(Q(seller=user) | Q(buyer=user))
        return queryset