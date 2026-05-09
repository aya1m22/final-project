from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all categories without pagination


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.select_related('category').all()

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)

        # Filter by featured
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        # Filter by new arrivals
        new_arrivals = self.request.query_params.get('new_arrivals')
        if new_arrivals == 'true':
            queryset = queryset.filter(is_new_arrival=True)

        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        # Sort
        sort = self.request.query_params.get('sort', '-created_at')
        valid_sorts = ['price', '-price', '-created_at', 'name', '-name']
        if sort in valid_sorts:
            queryset = queryset.order_by(sort)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
