from django.db import models
from ..accounts.models import Profile

class Sale(models.Model):
    seller = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="sales")
    name = models.CharField(max_length=60)
    description = models.TextField()
    price = models.FloatField()
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name