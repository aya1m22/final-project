from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'role', 'content', 'image_url', 'recommended_products', 'created_at')


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = ('id', 'title', 'messages', 'message_count', 'created_at', 'updated_at')

    def get_message_count(self, obj):
        return obj.messages.count()
