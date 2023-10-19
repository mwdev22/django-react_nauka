from rest_framework.serializers import ModelSerializer
from accounts.serializers import UserSerializer
from .models import Sale, Transaction

class SaleSerializer(ModelSerializer):
    seller = UserSerializer()
    class Meta:
        model = Sale
        fields = '__all__'
        

class TransactionSerializer(ModelSerializer):
    seller = UserSerializer()
    buyer = UserSerializer()
    sale = SaleSerializer()
    class Meta:
        model = Transaction
        fields = ['id','seller','sale','buyer','price',]
