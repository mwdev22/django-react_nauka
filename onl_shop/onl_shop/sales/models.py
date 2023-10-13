from django.db import models
from accounts.models import User
from rest_framework.exceptions import ValidationError

class Sale(models.Model):
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sales")
    name = models.CharField(max_length=60)
    category = models.CharField(max_length=60)
    description = models.TextField()
    price = models.FloatField()

    img = models.ImageField(default='media/sale.jpg')
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name
    
class Transaction(models.Model):
    seller = models.ForeignKey(User, related_name='sold', on_delete=models.SET_NULL, null=True)
    sale = models.ForeignKey(Sale, related_name='transaction', on_delete=models.SET_NULL, null=True)
    buyer = models.ForeignKey(User, related_name='bought', on_delete=models.SET_NULL, null=True)
    transaction_date = models.DateTimeField(auto_now_add=True)  
    price = models.FloatField()

    def clean(self):
        if self.seller == self.buyer:
            raise ValidationError("Seller and buyer cannot be the same user.")

    def save(self, *args, **kwargs):
        self.clean()  
        super().save(*args, **kwargs)
