from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Mail, User, Attachment


class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 1
    autocomplete_fields = ('mail',)


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
    inlines = (AttachmentInline,)


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = (
        'mail', 'filename', 'uploaded_at'
    )
    search_fields = ('filename',)


admin.site.register(User, UserAdmin)
