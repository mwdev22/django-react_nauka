from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Sale, Transaction
from accounts.models import User

class SaleSerializer(serializers.ModelSerializer):
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
    

class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'

    def to_representation(self, instance):
        representation = super(TransactionSerializer, self).to_representation(instance)


        representation['seller'] = UserSerializer(instance.seller).data
        representation['buyer'] = UserSerializer(instance.buyer).data
        representation['sale'] = SaleSerializer(instance.sale).data

        

        return representation
    
    