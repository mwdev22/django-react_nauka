from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    username = models.CharField(max_length=30)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', ]

    def __str__(self) -> str:
        return self.username
    
class Profile(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile')
    username = models.CharField(max_length=30,null=True)
    bio = models.TextField(max_length=255)
    img = models.ImageField(upload_to='media/profiles', default='profile.jpg')
    verified = models.BooleanField(default=False)

# tworzenie profilu dla użytkownika w momencie rejestracji
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance, defaults={'username': instance.username})