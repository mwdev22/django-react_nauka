from rest_framework import generics
from .models import Sale, Transaction
from .serializers import SaleSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from django.db.models import Q
from django.shortcuts import get_object_or_404
from accounts.models import User




class SaleList(generics.ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTTokenUserAuthentication]
    search_fields = ['name', 'description', 'category']  

    def get_queryset(self):
        # sprawdzam, czy są kryteria wyszukiwania
        search_query = self.request.query_params.get('search')
        # filtrowanie odpowiednio aktywnych aukcji, oraz wg parametrów wyszukiwania
        if search_query != 'null':
            self.filter_backends = [SearchFilter]
            queryset = Sale.objects.filter(Q(name__icontains=search_query, is_active=True) | Q(description__icontains=search_query, is_active=True) | Q(category__icontains=search_query, is_active=True))
        else:
            queryset = Sale.objects.filter(is_active=True)
        return queryset

        
class SaleCreate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [JWTTokenUserAuthentication]

    def post(self, request, format=None):
    #   przypisanie użytkownika jako sprzedawcy przedmiotu
        user_id = self.request.user.id
        sale_data = request.data.copy()
        sale_data['seller'] = user_id
        serializer = SaleSerializer(data=sale_data)
        if serializer.is_valid():
            serializer.save(is_active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSales(generics.ListAPIView):
    queryset = Sale.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SaleSerializer
    authentication_classes = [JWTTokenUserAuthentication]

    def get_queryset(self):
        user = User.objects.get(id=self.request.user.id)
        queryset = Sale.objects.filter(seller=user, is_active=True)
        return queryset

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
    

class SaleDetail(generics.RetrieveAPIView):
    queryset = Sale.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SaleSerializer



class CreateTransaction(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTTokenUserAuthentication]

#   przypisanie odpowiednich parametró obiektowi transakcji
    def post(self, request, format=None):
    #   odpowiednie ustalanie zawartości pk fields
        sale_id = request.data.get('sale')
        sale = get_object_or_404(Sale, pk=sale_id)
    #   sprzedający-->twórca aukcji, kupujący-->użytkownik
        seller = sale.seller
        buyer = request.user
        price = sale.price
        transaction_data = {
            'sale': sale_id,
            'seller': seller.id,
            'buyer': buyer.id,
            'price': price,
        }

        serializer = TransactionSerializer(data=transaction_data)

        if serializer.is_valid():
            sale.is_active = False
            sale.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserTransactionList(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTTokenUserAuthentication]

    def get_queryset(self):
        user = User.objects.get(pk=self.request.user.id)
    #   filtrowanie wyników zapytania, by użytkownik otrzymywał info tylko o swoich transakcjach
        queryset = Transaction.objects.filter(Q(seller=user) | Q(buyer=user))
        return queryset


class TransactionDetail(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    permission_classes = [IsAuthenticated,]
    authentication_classes = [JWTTokenUserAuthentication]
    serializer_class = TransactionSerializer
