from rest_framework.fields import empty
from rest_framework_simplejwt.tokens import Token
from .models import User, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, validators
from sales.models import Sale
from django.shortcuts import get_object_or_404

# pracuje tak jak django form
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TokenSerializer(TokenObtainPairSerializer):
    
#   przypisanie dodatkowych parametrów do tokenu
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

#   każdy użytkownik ma profil, jest tworzony podczas rejestracji
        p = get_object_or_404(Profile,user=user)
        
#   zdekodowany token daje dostęp do poniższych informacji
        token['full_name'] = p.username
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = p.bio
        token['image'] = str(p.img)
        token['verified'] = p.verified

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, required=True
    )
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']  
    
#   sprawdzanie, czy powtórzone hasło jest zgodne
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields do not match"}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = '__all__'

    


    
        