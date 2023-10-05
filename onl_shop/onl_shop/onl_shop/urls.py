from django.contrib import admin
from django.urls import path,include
from rest_framework import routers

from sales.views import SaleViewSet

# viewset musze dodać do urli poprzez router managera
router = routers.DefaultRouter()

router.register(r'sales', SaleViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/',include(router.urls))
]
