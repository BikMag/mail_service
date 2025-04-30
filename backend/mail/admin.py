from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Mail, User


@admin.register(Mail)
class MailAdmin(admin.ModelAdmin):
    list_display = (
        'sender', 'recipient',
        'subject',
        'sent_at', 'is_read',
        'is_deleted_by_sender', 'is_deleted_by_recipient',
    )
    search_fields = (
        'subject',
        'sender__username',
        'recipient__username',
    )


admin.site.register(User, UserAdmin)
