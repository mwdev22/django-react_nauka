from django.urls import path
from . import views

urlpatterns = [
    path('', views.RealtorListView.as_view()),
    path('top_seller', views.TopSellerView.as_view()),
    path('<int:pk>', views.RealtorView.as_view())
]
