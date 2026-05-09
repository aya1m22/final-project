from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image_url', 'description', 'product_count')

    def get_product_count(self, obj):
        return obj.products.count()


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'price', 'original_price', 'image_url',
            'category', 'category_name', 'is_featured', 'is_new_arrival',
            'is_on_sale', 'sizes', 'colors', 'rating', 'review_count',
        )


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail page."""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
