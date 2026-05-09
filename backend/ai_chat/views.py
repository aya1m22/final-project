import re
import json
import os
import requests
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import ChatSession, ChatMessage
from products.models import Product
from products.serializers import ProductListSerializer

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message')
        session_id = request.data.get('session_id')
        image_data = request.data.get('image')  # Base64 image
        history = request.data.get('history', [])

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
        ChatMessage.objects.create(session=session, role='user', content=user_message or "[Image Uploaded]")

        # Prepare product catalog for context
        products = Product.objects.all()[:20]
        product_catalog = "\n".join([
            f"ID: {p.id} | Name: {p.name} | Price: ${p.price} | Category: {p.category.name} | Description: {p.description[:100]}..."
            for p in products
        ])

        system_prompt = f"""You are AURA, a warm and knowledgeable AI fashion stylist for a luxury online store called AURA.

OUR PRODUCT CATALOG (use ONLY these products):
{product_catalog}

RULES:
1. Be warm, stylish, and specific. Like a knowledgeable friend, not a robot.
2. Keep responses under 180 words.
3. When recommending products, you MUST end your message with this EXACT format on its own line (nothing else after it):
   |||RECS:{{"ids":[1,2,3]}}|||
4. Only use product IDs from the catalog above.
5. When analyzing a photo: first comment on skin tone (warm/cool/neutral), then body shape and style vibe, then recommend 3-5 specific products.
6. If no products are relevant to the question, do NOT include the |||RECS:...||| line.
7. You are AURA. Never break character."""

        # Call Anthropic API (or fallback to mock)
        api_key = os.getenv('ANTHROPIC_API_KEY')
        ai_text = ""
        
        if api_key and api_key != "your_anthropic_api_key_here":
            try:
                headers = {
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }
                
                messages = []
                # Add history
                for h in history[-5:]:
                    messages.append({"role": h['role'], "content": h['content']})
                
                # Current message
                content = []
                if user_message:
                    content.append({"type": "text", "text": user_message})
                if image_data:
                    # image_data is "data:image/jpeg;base64,..."
                    try:
                        base64_img = image_data.split(",")[1]
                        media_type = image_data.split(";")[0].split(":")[1]
                        content.append({
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64_img
                            }
                        })
                    except: pass
                
                messages.append({"role": "user", "content": content})

                payload = {
                    "model": "claude-3-sonnet-20240229",
                    "max_tokens": 1024,
                    "system": system_prompt,
                    "messages": messages
                }
                
                response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
                if response.status_code == 200:
                    ai_text = response.json()['content'][0]['text']
                else:
                    raise Exception(f"API Error: {response.text}")
            except Exception as e:
                print(f"Anthropic API Error: {e}")
                ai_text = "I'm having a little trouble connecting to my creative side right now. Let me recommend some classic pieces from our collection! |||RECS:{\"ids\":[1,2,3]}|||"
        else:
            # Fallback Mock
            if image_data:
                ai_text = "I've analyzed your photo. You have a warm skin tone that looks stunning with earthy neutrals and gold accents. Based on your style vibe, I recommend these pieces: |||RECS:{\"ids\":[1,3,5]}|||"
            else:
                ai_text = "That sounds like a wonderful style choice! To achieve that look, I've selected a few key pieces from our AURA collection that I think you'll love. |||RECS:{\"ids\":[2,4,6]}|||"

        # BUG 2 FIX: Parsing logic
        clean_text = ai_text
        recommended_ids = []
        match = re.search(r'\|\|\|RECS:(\{.*?\})\|\|\|', ai_text, re.DOTALL)
        if match:
            try:
                recommended_ids = json.loads(match.group(1)).get('ids', [])
                clean_text = ai_text.replace(match.group(0), '').strip()
            except Exception:
                pass

        # Get actual product objects
        rec_products = Product.objects.filter(id__in=recommended_ids)
        serializer = ProductListSerializer(rec_products, many=True)

        # Save AI response
        ChatMessage.objects.create(session=session, role='assistant', content=clean_text)

        return Response({
            "message": clean_text,
            "recommended_products": serializer.data,
            "session_id": session.id
        })

class ChatSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user).order_by('-created_at')
        return Response([
            {"id": s.id, "title": s.title, "created_at": s.created_at}
            for s in sessions
        ])
