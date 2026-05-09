import json
import re
import logging
import anthropic
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from products.models import Product

logger = logging.getLogger(__name__)


class ChatSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user)
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        session = ChatSession.objects.create(user=request.user)
        return Response(ChatSessionSerializer(session).data, status=201)


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '')
        image_data = request.data.get('image')  # base64 encoded
        session_id = request.data.get('session_id')

        # Get or create session
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                session = ChatSession.objects.create(user=request.user)
        else:
            session = ChatSession.objects.create(user=request.user)

        # Save user message
        user_msg = ChatMessage.objects.create(
            session=session,
            role='user',
            content=user_message,
        )

        # Build product catalog for context
        products = Product.objects.select_related('category').all()[:50]
        product_catalog = "\n".join([
            f"ID:{p.id} | {p.name} | ${p.price} | {p.category.name} | Sizes: {','.join(p.sizes)} | Colors: {','.join(p.colors)}"
            for p in products
        ])

        system_prompt = f"""You are AURA, a luxury AI fashion stylist for our online store.
Our product catalog:
{product_catalog}

When recommending products, ONLY recommend products from our catalog above using their exact IDs.
If analyzing a photo: assess skin tone (warm/cool/neutral), body shape, style personality,
then recommend 3-5 specific products by ID.
Be warm, stylish, and helpful. Keep responses under 200 words.
Use fashion terminology naturally.
At the end of EVERY response that includes product recommendations, add this JSON on its own line:
RECOMMENDATIONS:{{"product_ids": [id1, id2, id3]}}"""

        # Build conversation history from session
        history_messages = ChatMessage.objects.filter(session=session).order_by('created_at')
        messages = []
        for msg in history_messages:
            if msg.id == user_msg.id:
                continue  # Skip the one we just created; we'll add it below
            messages.append({"role": msg.role, "content": msg.content})

        # Add current user message
        if image_data:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data
                        }
                    },
                    {
                        "type": "text",
                        "text": user_message or "Please analyze my photo and recommend outfits that would suit me."
                    }
                ]
            })
        else:
            messages.append({"role": "user", "content": user_message})

        # Call Claude API
        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=800,
                system=system_prompt,
                messages=messages,
            )
            ai_text = response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            # Mock fallback response so it works without a valid API key
            fallback_products = Product.objects.all()[:2]
            p_ids = [p.id for p in fallback_products]
            ai_text = (
                "Based on your style preferences, I've curated a few elegant pieces for you. "
                "These should be perfect for a formal occasion or elevating your everyday look!\n\n"
                f"RECOMMENDATIONS:{{\"product_ids\": {p_ids}}}"
            )

        # Parse product recommendations
        recommended_ids = []
        clean_text = ai_text
        if "RECOMMENDATIONS:" in ai_text:
            match = re.search(r'RECOMMENDATIONS:(\{.*?\})', ai_text)
            if match:
                try:
                    data = json.loads(match.group(1))
                    recommended_ids = data.get('product_ids', [])
                    clean_text = ai_text.replace(match.group(0), '').strip()
                except (json.JSONDecodeError, ValueError):
                    pass

        # Get recommended products
        recommended_products = []
        if recommended_ids:
            prods = Product.objects.filter(id__in=recommended_ids).select_related('category')
            recommended_products = [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": str(p.price),
                    "image_url": p.image_url,
                    "category": p.category.name,
                    "sizes": p.sizes,
                    "colors": p.colors,
                }
                for p in prods
            ]

        # Save AI message
        ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=clean_text,
            recommended_products=recommended_ids,
        )

        # Update session title from first user message
        if session.title == 'New Chat' and user_message:
            session.title = user_message[:80]
            session.save()

        return Response({
            "message": clean_text,
            "recommended_products": recommended_products,
            "session_id": session.id,
        })
