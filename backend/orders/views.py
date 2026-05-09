from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, CartItem
from .serializers import (
    OrderSerializer, CartItemSerializer, CartItemCreateSerializer
)
from products.models import Product


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related('product', 'product__category')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart."""
        ser = CartItemCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            product = Product.objects.get(id=data['product_id'])
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            size=data['size'],
            color=data.get('color', ''),
            defaults={'quantity': data['quantity']}
        )
        if not created:
            cart_item.quantity += data['quantity']
            cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        """Update cart item quantity."""
        try:
            item = CartItem.objects.get(id=pk, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=404)

        quantity = request.data.get('quantity')
        if quantity is not None and int(quantity) > 0:
            item.quantity = int(quantity)
            item.save()
        return Response(CartItemSerializer(item).data)

    def delete(self, request, pk):
        """Remove item from cart."""
        CartItem.objects.filter(id=pk, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create order from current cart."""
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=400)

        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({'error': 'Shipping address required'}, status=400)

        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart_items)

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total,
            shipping_address=shipping_address,
        )

        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                size=cart_item.size,
                color=cart_item.color,
                price=cart_item.product.price,
            )

        # Clear cart
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related('items__product').get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
        return Response(OrderSerializer(order).data)
