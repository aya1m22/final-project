from rest_framework import serializers
from .models import Order, OrderItem, CartItem
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.URLField(source='product.image_url', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'quantity', 'size', 'color', 'price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'total_price', 'status', 'shipping_address', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')


class OrderCreateSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    # Cart items will be pulled from the user's server-side cart


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_detail', 'quantity', 'size', 'color', 'added_at')
        read_only_fields = ('id', 'added_at')


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1)
    size = serializers.CharField(max_length=5)
    color = serializers.CharField(max_length=50, required=False, default='')
