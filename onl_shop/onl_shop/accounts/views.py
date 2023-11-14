from .models import Profile, User
from .serializers import UserSerializer, TokenSerializer, RegisterSerializer, ProfileSerializer
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated,BasePermission
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status

# customowy permission model, pozwala uzyskać dostęp do edycji określonego profilu tylko jego właścicielowi
class IsProfileOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return obj.user == request.user
        return False

class TokenView(TokenObtainPairView):
    serializer_class = TokenSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer
    

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

@api_view(['GET', 'PATCH'])
def profile_detail(request, pk):
#   pobieranie profilu użytkownika na podstawie otrzymanego w requescie id użytkownika
    if request.method == 'GET':
        user = User.objects.get(pk=pk)
        if user:
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)

# aktualizuje dane, by zwracały ścieżkę bezwzględną do obrazka
            img_url = request.build_absolute_uri(profile.img.url)
            profile_data = serializer.data
            profile_data['img'] = img_url  

            return Response(profile_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
# aktualizacja profilu
    elif request.method == 'PATCH':
        user = User.objects.get(pk=pk)
        print(user)
        if user:
            profile = Profile.objects.get(user=user)
            print(profile)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                    
# aktualizuje dane, by zwracały ścieżkę bezwzględną do obrazka
                img_url = request.build_absolute_uri(profile.img.url)
                profile_data = serializer.data
                profile_data['img'] = img_url 

                return Response(profile_data)
            
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    