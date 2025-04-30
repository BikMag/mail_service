from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Mail
from .serializers import (
    MailListSerializer, MailDetailSerializer, MailCreateSerializer
)
from rest_framework.pagination import PageNumberPagination
from rest_framework import status


class MailPagination(PageNumberPagination):
    page_size = 10  # можно настроить количество писем на страницу
    page_size_query_param = 'page_size'
    max_page_size = 100


class MailViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с письмами
    """
    queryset = Mail.objects.all()
    pagination_class = MailPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращаем только письма текущего пользователя
        """
        user = self.request.user
        return Mail.objects.filter(sender=user) | (
            Mail.objects.filter(recipient=user)
        )

    def get_serializer_class(self):
        """
        Выбираем сериализатор в зависимости от операции
        """
        if self.action == 'create':
            return MailCreateSerializer
        elif self.action == 'list':
            return MailListSerializer
        return MailDetailSerializer

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        """
        Пометить письмо как прочитанное
        """
        mail = self.get_object()
        mail.is_read = True
        mail.save()
        return Response(
            {'status': 'mail marked as read'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['patch'])
    def delete_or_restore_mail(self, request, pk=None):
        """
        Удалить или восстановить письмо. 
        Используется как отправителем, так и получателем.
        """
        mail = self.get_object()
        if mail.sender == request.user:
            mail.is_deleted_by_sender = not mail.is_deleted_by_sender
        elif mail.recipient == request.user:
            mail.is_deleted_by_recipient = not mail.is_deleted_by_recipient
        mail.save()
        serializer = MailListSerializer(mail, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='category')
    def categorized_mails(self, request):
        """
        Выборка писем по категориям.
        """
        user = request.user
        category = request.query_params.get('type')

        if category == 'inbox':
            mails = Mail.objects.filter(
                recipient=user, is_deleted_by_recipient=False, is_spam=False
            )

        elif category == 'sent':
            mails = Mail.objects.filter(
                sender=user, is_deleted_by_sender=False, is_spam=False
            )

        elif category == 'deleted':
            mails = Mail.objects.filter(
                (Q(sender=user) & Q(is_deleted_by_sender=True)) |
                (Q(recipient=user) & Q(is_deleted_by_recipient=True))
            )

        elif category == 'spam':
            mails = Mail.objects.filter(
                is_spam=True
            )

        else:
            mails = self.get_queryset()

        mails = mails.order_by('-sent_at')

        page = self.paginate_queryset(mails)
        if page is not None:
            serializer = MailListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = MailListSerializer(mails, many=True)
        return Response(serializer.data)
