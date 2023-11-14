from rest_framework.serializers import ModelSerializer
from accounts.serializers import UserSerializer
from .models import Sale, Transaction
from accounts.models import User

class SaleSerializer(ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'
        extra_fields = ['seller']

#   overriding wyświetlania atrybutów użytkownika
    def to_representation(self, instance):
        representation = super(SaleSerializer, self).to_representation(instance)
        seller_data = UserSerializer(instance.seller).data
        representation['seller'] = seller_data
        return representation
        

class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        extra_fields=['seller','buyer','sale']

#   overriding realted fields
    def to_representation(self, instance):
        representation = super(TransactionSerializer, self).to_representation(instance)
        seller_data = UserSerializer(instance.seller).data
        buyer_data = UserSerializer(instance.buyer).data
        sale_data = SaleSerializer(instance.sale).data
        representation['seller'] = seller_data
        representation['buyer'] = buyer_data
        representation['sale'] = sale_data
        return representation
    
    
    