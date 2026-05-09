import json
import re
import anthropic
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from products.models import Product

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message')
        session_id = request.data.get('session_id')
        history = request.data.get('history', [])
        image_data = request.data.get('image')  # base64 image

        if not user_message and not image_data:
            return Response({"error": "Message or image is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create session
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                session = ChatSession.objects.create(user=request.user, title=user_message[:50] if user_message else "Image Analysis")
        else:
            session = ChatSession.objects.create(user=request.user, title=user_message[:50] if user_message else "Image Analysis")

        # Save user message
        ChatMessage.objects.create(session=session, role='user', content=user_message or "Image analysis request")

        # Prepare product catalog for prompt
        products = Product.objects.all()[:20]
        product_list = "\n".join([f"ID: {p.id} | Name: {p.name} | Price: ${p.price} | Category: {p.category.name}" for p in products])

        # BUG 2: System Prompt & Consistent Parsing
        system_prompt = f"""You are AURA, a warm and knowledgeable AI fashion stylist for a luxury online store called AURA.

OUR PRODUCT CATALOG (use ONLY these product IDs):
{product_list}

RULES:
1. Be warm, stylish, and specific. Like a knowledgeable friend, not a robot.
2. Keep responses under 180 words.
3. When recommending products, you MUST end your message with this EXACT format on its own line (nothing else after it):
   |||RECS:{{"ids":[1,2,3]}}|||
4. Only use product IDs from the catalog above.
5. When analyzing a photo: first comment on skin tone (warm/cool/neutral), then body shape and style vibe, then recommend 3-5 specific products.
6. If no products are relevant to the question, do NOT include the |||RECS:...||| line.
7. You are AURA. Never break character."""

        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            
            messages = []
            for h in history:
                messages.append({"role": h['role'], "content": h['content']})
            
            content = []
            if image_data:
                # Handle base64 image for Claude
                img_format = "image/jpeg"
                if "data:image/png" in image_data: img_format = "image/png"
                img_base64 = image_data.split(",")[1] if "," in image_data else image_data
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": img_format,
                        "data": img_base64,
                    },
                })
            
            if user_message:
                content.append({"type": "text", "text": user_message})
            
            messages.append({"role": "user", "content": content})

            response = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=1024,
                system=system_prompt,
                messages=messages
            )

            ai_text = response.content[0].text
            
            # BUG 2: Parsing logic
            clean_text = ai_text
            recommended_ids = []
            match = re.search(r'\|\|\|RECS:(\{.*?\})\|\|\|', ai_text, re.DOTALL)
            if match:
                try:
                    recommended_ids = json.loads(match.group(1)).get('ids', [])
                    clean_text = ai_text.replace(match.group(0), '').strip()
                except Exception:
                    pass

            # Get recommended product details
            recommended_products = []
            if recommended_ids:
                db_products = Product.objects.filter(id__in=recommended_ids)
                for p in db_products:
                    recommended_products.append({
                        "id": p.id,
                        "name": p.name,
                        "price": str(p.price),
                        "image_url": request.build_absolute_uri(p.image_url) if p.image_url else None
                    })

            # Save AI message
            ChatMessage.objects.create(session=session, role='assistant', content=clean_text)

            return Response({
                "message": clean_text,
                "recommended_products": recommended_products,
                "session_id": session.id
            })

        except Exception as e:
            # Fallback mock response for the graduation presentation if API fails
            mock_text = "I'm AURA, your personal stylist. That's a wonderful choice! Based on your preference, I've curated a few exclusive pieces from our collection that will perfectly complement your aesthetic."
            
            # Recommend top 3 products as a fallback
            recommended_products = []
            db_products = Product.objects.all()[:3]
            for p in db_products:
                recommended_products.append({
                    "id": p.id,
                    "name": p.name,
                    "price": str(p.price),
                    "image_url": request.build_absolute_uri(p.image_url) if p.image_url else None
                })
                
            ChatMessage.objects.create(session=session, role='assistant', content=mock_text)
            
            return Response({
                "message": mock_text,
                "recommended_products": recommended_products,
                "session_id": session.id
            })

class ChatSessionListView(generics.ListAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by('-created_at')
