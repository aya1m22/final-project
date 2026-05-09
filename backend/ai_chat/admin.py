from django.contrib import admin
from .models import ChatSession, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('role', 'content', 'image_url', 'created_at')


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'message_count', 'created_at')
    search_fields = ('user__username', 'title')
    inlines = [ChatMessageInline]

    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = 'Messages'


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'role', 'short_content', 'created_at')
    list_filter = ('role', 'created_at')

    def short_content(self, obj):
        return obj.content[:80]
    short_content.short_description = 'Content'
