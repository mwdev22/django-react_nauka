from rest_framework.serializers import ModelSerializer
from accounts.serializers import UserSerializer
from .models import Sale, Transaction
from accounts.models import User

class SaleSerializer(ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'
        extra_fields = ['seller']

#   listowanie wszystkich atrybutów użytkownika, zamiast samego użytkownika
    def to_representation(self, instance):
        representation = super(SaleSerializer, self).to_representation(instance)
        seller_data = UserSerializer(instance.seller).data
        representation['seller'] = seller_data
        return representation
        

class TransactionSerializer(ModelSerializer):
    seller = UserSerializer()
    buyer = UserSerializer()
    sale = SaleSerializer()
    class Meta:
        model = Transaction
        fields = ['id','seller','sale','buyer','price',]
