from rest_framework.serializers import ModelSerializer
from .models import Sale, Transaction

class SaleSerializer(ModelSerializer):
    
    class Meta:
        model = Sale
        fields = '__all__'

class TransactionSerializer(ModelSerializer):

    class Meta:
        model = Transaction
        fields = ['seller','item','buyer']
