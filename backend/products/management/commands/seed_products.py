import json
from django.core.management.base import BaseCommand
from products.models import Category, Product

PRODUCTS = [
    # WOMEN'S CATEGORY
    {
        "name": "Silk Slip Midi Dress",
        "price": 89.99, "original_price": 129.99,
        "category": "Women", "is_on_sale": True, "is_new_arrival": True,
        "sizes": ["XS","S","M","L","XL"], "colors": ["champagne","black","ivory"],
        "rating": 4.8, "review_count": 247,
        "tags": ["dress","silk","evening","date night","summer"],
        "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
        "description": "A beautifully draped slip dress in lustrous silk-feel fabric. The adjustable spaghetti straps and fluid silhouette make it effortlessly chic for any occasion.",
    },
    {
        "name": "Linen Wide-Leg Trousers",
        "price": 64.99,
        "category": "Women", "is_new_arrival": True,
        "sizes": ["XS","S","M","L","XL"], "colors": ["sand","white","olive","black"],
        "rating": 4.6, "review_count": 183,
        "tags": ["trousers","linen","summer","casual","office"],
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4b4f74?w=600&q=80",
        "description": "Relaxed wide-leg trousers in breathable linen blend. High-rise waist with side pockets — the perfect summer essential.",
    },
    {
        "name": "Oversized Blazer",
        "price": 134.99,
        "category": "Women", "is_featured": True,
        "sizes": ["XS","S","M","L"], "colors": ["camel","black","cream","gray"],
        "rating": 4.9, "review_count": 312,
        "tags": ["blazer","office","power dressing","autumn","layering"],
        "image_url": "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
        "description": "The blazer that does everything. Oversized fit, structured shoulders, single button closure. Wear open over a tee or buttoned up solo.",
    },
    {
        "name": "Ribbed Cashmere Turtleneck",
        "price": 119.99,
        "category": "Women", "is_featured": True,
        "sizes": ["XS","S","M","L","XL"], "colors": ["cream","camel","black","rust"],
        "rating": 4.7, "review_count": 198,
        "tags": ["knitwear","cashmere","winter","cozy","luxury"],
        "image_url": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
        "description": "Luxuriously soft ribbed cashmere turtleneck. A forever piece in a classic silhouette that gets better with every wear.",
    },
    {
        "name": "Pleated Satin Midi Skirt",
        "price": 74.99, "original_price": 99.99,
        "category": "Women", "is_on_sale": True,
        "sizes": ["XS","S","M","L","XL"], "colors": ["champagne","blush","black","cobalt"],
        "rating": 4.5, "review_count": 156,
        "tags": ["skirt","satin","evening","wedding guest","elegant"],
        "image_url": "https://images.unsplash.com/photo-1583496661160-fb5218b4f3af?w=600&q=80",
        "description": "A flowing pleated skirt in lustrous satin. Midi length with an elastic waist — dress it up or down effortlessly.",
    },
    {
        "name": "Broderie Anglaise Mini Dress",
        "price": 79.99,
        "category": "Women", "is_new_arrival": True,
        "sizes": ["XS","S","M","L"], "colors": ["white","powder blue"],
        "rating": 4.6, "review_count": 94,
        "tags": ["dress","mini","summer","brunch","white"],
        "image_url": "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
        "description": "Delicate broderie anglaise fabric in a breezy mini silhouette. Perfect for warm days and sunlit terraces.",
    },
    {
        "name": "Structured Leather Belt Bag",
        "price": 59.99,
        "category": "Women",
        "sizes": ["One Size"], "colors": ["black","tan","cognac"],
        "rating": 4.7, "review_count": 201,
        "tags": ["bag","leather","belt bag","accessory"],
        "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        "description": "Compact belt bag in structured faux leather. Adjustable strap, zip closure, interior card slots.",
    },
    {
        "name": "Open-Back Satin Cami Top",
        "price": 44.99,
        "category": "Women", "is_new_arrival": True,
        "sizes": ["XS","S","M","L"], "colors": ["ivory","black","forest green","wine"],
        "rating": 4.4, "review_count": 127,
        "tags": ["top","satin","cami","evening","going out"],
        "image_url": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
        "description": "Silky satin cami with a dramatic open back. Adjustable straps, relaxed but elevated.",
    },
    # MEN'S CATEGORY
    {
        "name": "Slim Fit Oxford Shirt",
        "price": 69.99,
        "category": "Men", "is_featured": True,
        "sizes": ["S","M","L","XL","XXL"], "colors": ["white","light blue","pink","stripe"],
        "rating": 4.7, "review_count": 284,
        "tags": ["shirt","oxford","office","smart casual","classic"],
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
        "description": "A refined Oxford button-down in premium cotton. Slim fit through the body, perfect for work or weekend.",
    },
    {
        "name": "Italian Wool Suit Jacket",
        "price": 189.99,
        "category": "Men", "is_featured": True,
        "sizes": ["S","M","L","XL"], "colors": ["charcoal","navy","black"],
        "rating": 4.8, "review_count": 143,
        "tags": ["suit","jacket","formal","wedding","office"],
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
        "description": "Single-breasted suit jacket in Italian wool blend. Tailored fit, notch lapel, two-button closure. A cornerstone piece.",
    },
    {
        "name": "Merino Crew-Neck Sweater",
        "price": 94.99,
        "category": "Men",
        "sizes": ["S","M","L","XL","XXL"], "colors": ["navy","grey marl","camel","burgundy"],
        "rating": 4.6, "review_count": 219,
        "tags": ["knitwear","merino","winter","smart","layering"],
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
        "description": "Fine-gauge merino wool crew-neck. Barely-there weight with real warmth. The ultimate smart casual layer.",
    },
    {
        "name": "Slim Chino Trousers",
        "price": 59.99, "original_price": 79.99,
        "category": "Men", "is_on_sale": True,
        "sizes": ["S","M","L","XL","XXL"], "colors": ["khaki","navy","olive","stone"],
        "rating": 4.5, "review_count": 317,
        "tags": ["trousers","chino","casual","office","everyday"],
        "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
        "description": "Clean-cut slim chinos in premium stretch cotton. Flat front, slim leg — works with everything.",
    },
    {
        "name": "Relaxed Linen Shirt",
        "price": 64.99,
        "category": "Men", "is_new_arrival": True,
        "sizes": ["S","M","L","XL","XXL"], "colors": ["white","sky blue","sage","ecru"],
        "rating": 4.7, "review_count": 178,
        "tags": ["shirt","linen","summer","holiday","casual"],
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4b4f74?w=600&q=80",
        "description": "Relaxed-fit linen shirt for warm weather. Slightly oversized with a curved hem and chest pocket.",
    },
    {
        "name": "Leather Chelsea Boots",
        "price": 149.99,
        "category": "Men", "is_featured": True,
        "sizes": ["40","41","42","43","44","45"], "colors": ["black","tan"],
        "rating": 4.8, "review_count": 267,
        "tags": ["boots","chelsea","leather","shoes","smart casual"],
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        "description": "Classic Chelsea boots in full-grain leather. Elastic side panels, leather lining, rubber sole. Built to last.",
    },
    # ACCESSORIES CATEGORY
    {
        "name": "Structured Top Handle Bag",
        "price": 129.99,
        "category": "Accessories", "is_featured": True,
        "sizes": ["One Size"], "colors": ["black","cognac","cream","forest"],
        "rating": 4.8, "review_count": 321,
        "tags": ["bag","handbag","luxury","work bag","leather"],
        "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        "description": "A structured top-handle bag in pebbled faux leather. Detachable shoulder strap, suede lining, gold hardware.",
    },
    {
        "name": "Cashmere Wrap Scarf",
        "price": 79.99,
        "category": "Accessories",
        "sizes": ["One Size"], "colors": ["camel","cream","grey","blush","navy"],
        "rating": 4.7, "review_count": 189,
        "tags": ["scarf","cashmere","winter","gift","luxury"],
        "image_url": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
        "description": "An oversized wrap scarf in pure cashmere. Buttery soft, with fringed edges and a generous drape.",
    },
    {
        "name": "Delicate Gold Layering Necklace Set",
        "price": 34.99,
        "category": "Accessories", "is_new_arrival": True,
        "sizes": ["One Size"], "colors": ["gold","silver"],
        "rating": 4.6, "review_count": 412,
        "tags": ["necklace","jewelry","gold","layering","gift"],
        "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
        "description": "Three dainty necklaces designed to be layered. 18k gold-plated chains with subtle pendant details.",
    },
    {
        "name": "Minimalist Leather Watch",
        "price": 159.99,
        "category": "Accessories", "is_featured": True,
        "sizes": ["One Size"], "colors": ["black/silver","tan/gold","white/rose gold"],
        "rating": 4.8, "review_count": 298,
        "tags": ["watch","leather","minimalist","gift","luxury"],
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        "description": "Slim minimalist watch with a genuine leather strap and clean dial. Japanese movement. Timeless design.",
    },
    {
        "name": "Tortoiseshell Cat-Eye Sunglasses",
        "price": 44.99,
        "category": "Accessories",
        "sizes": ["One Size"], "colors": ["tortoise","black","clear"],
        "rating": 4.5, "review_count": 267,
        "tags": ["sunglasses","cat-eye","summer","retro","accessory"],
        "image_url": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80",
        "description": "Classic cat-eye frames in warm tortoiseshell. UV400 lenses, lightweight acetate frame.",
    },
    {
        "name": "Wide-Brim Straw Hat",
        "price": 39.99, "original_price": 54.99,
        "category": "Accessories", "is_on_sale": True,
        "sizes": ["One Size"], "colors": ["natural","black","white"],
        "rating": 4.6, "review_count": 143,
        "tags": ["hat","straw","summer","beach","vacation"],
        "image_url": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
        "description": "Woven straw wide-brim hat with a ribbon band. Packable and perfect for every summer destination.",
    },
]

class Command(BaseCommand):
    help = 'Seeds the database with initial products and categories'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')
        
        # Ensure categories exist
        cats = {}
        for cat_name in ['Women', 'Men', 'Accessories']:
            cat, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': cat_name.lower()}
            )
            cats[cat_name] = cat
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category {cat_name}'))

        # Add products
        for prod_data in PRODUCTS:
            cat_name = prod_data.pop('category')
            category = cats[cat_name]
            
            product, created = Product.objects.update_or_create(
                name=prod_data['name'],
                defaults={
                    'price': prod_data['price'],
                    'original_price': prod_data.get('original_price'),
                    'category': category,
                    'image_url': prod_data['image_url'],
                    'description': prod_data['description'],
                    'sizes': prod_data['sizes'],
                    'colors': prod_data['colors'],
                    'is_featured': prod_data.get('is_featured', False),
                    'is_new_arrival': prod_data.get('is_new_arrival', False),
                    'is_on_sale': prod_data.get('is_on_sale', False),
                    'rating': prod_data.get('rating', 4.5),
                    'review_count': prod_data.get('review_count', 0),
                    'tags': prod_data.get('tags', [])
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product {product.name}'))
            else:
                self.stdout.write(f'Updated product {product.name}')
                
        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
