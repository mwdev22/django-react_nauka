from django.urls import path
from . import views

urlpatterns = [
#   SALES ENDPOINTS
    path('list', views.SaleList.as_view()),
    path('new_sale', views.SaleCreate.as_view()),
    path('sale_update/<int:pk>/', views.SaleUpdate.as_view()),
    path('sale_delete/<int:pk>/', views.SaleDelete.as_view()),
    path('sale_detail/<int:pk>/', views.SaleDetail.as_view()),

#   TRANSACTIONS ENDPOINTS
    path('transactions_list', views.UserTransactionList.as_view()),
    path('new_transaction', views.CreateTransaction.as_view()),
    path('transaction_detail/<int:pk>/', views.TransactionDetail.as_view())
]
