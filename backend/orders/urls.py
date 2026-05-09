from django.urls import path
from .views import CartView, CartItemDetailView, ClearCartView, OrderListView, OrderDetailView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
