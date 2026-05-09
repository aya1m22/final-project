from django.urls import path
from .views import AIChatView, ChatSessionListView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai-chat'),
    path('sessions/', ChatSessionListView.as_view(), name='chat-sessions'),
]
