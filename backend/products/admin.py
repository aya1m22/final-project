from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count')
    prepopulated_fields = {'slug': ('name',)}

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_featured', 'is_new_arrival', 'created_at')
    list_filter = ('category', 'is_featured', 'is_new_arrival')
    search_fields = ('name', 'description')
    list_editable = ('price', 'stock', 'is_featured', 'is_new_arrival')
