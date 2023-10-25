from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('token',views.TokenView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('register', views.RegisterView.as_view()),
    path('user_list', views.UserList.as_view()),
    path('profile_detail', views.UpdateProfile.as_view())
]