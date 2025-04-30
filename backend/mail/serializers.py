from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from djoser.serializers import (
    UserSerializer, UserCreatePasswordRetypeSerializer
)
from rest_framework import serializers
from .models import Mail


User = get_user_model()


class CustomUserSerializer(UserSerializer):
    """
    Кастомный сериализатор для отображения пользователя через Djoser
    """
    class Meta(UserSerializer.Meta):
        fields = ('id', 'email', 'username')


class CustomUserCreateSerializer(UserCreatePasswordRetypeSerializer):
    """
    Кастомный сериализатор для регистрации пользователя через Djoser
    """
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        fields = ('email', 'id', 'username', 'password')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'password': {'required': True},
        }


class MailListSerializer(serializers.ModelSerializer):
    """
    Сериализатор для отображения списка писем (краткий вид)
    """
    sender = CustomUserSerializer(read_only=True)
    recipient = CustomUserSerializer(read_only=True)

    class Meta:
        model = Mail
        fields = ('id', 'sender', 'recipient', 'subject',
                  'body', 'sent_at', 'is_read')


class MailDetailSerializer(serializers.ModelSerializer):
    """
    Сериализатор для просмотра одного письма (полный вид)
    """
    sender = CustomUserSerializer(read_only=True)
    recipient = CustomUserSerializer(read_only=True)

    class Meta:
        model = Mail
        fields = ('id', 'sender', 'recipient', 'subject',
                  'body', 'sent_at', 'is_read')


class MailCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания письма
    """
    recipient_email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        model = Mail
        fields = ('recipient_email', 'subject', 'body')

    def create(self, validated_data):
        """
        При создании письма мы устанавливаем отправителя
        как текущего пользователя.
        """
        recipient_email = validated_data.pop('recipient_email')
        recipient = get_object_or_404(User, email=recipient_email)

        # Создаем письмо с отправителем и получателем
        mail = Mail.objects.create(
            sender=self.context['request'].user,
            recipient=recipient,
            **validated_data
        )
        return mail
