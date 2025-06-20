from django.urls import path
from .views import RegisterView, CustomLoginView, CustomerListView, SendConfirmationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('customers/', CustomerListView.as_view(), name='customer-list'),
    path('customers/send/', SendConfirmationView.as_view(), name='customer-send'),
]