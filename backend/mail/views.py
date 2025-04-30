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
        elif self.action == 'retrieve' or self.action == 'list':
            return MailDetailSerializer
        return MailListSerializer

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
    def delete_mail(self, request, pk=None):
        """
        Удалить письмо. Может быть удалено как отправителем, так и получателем.
        """
        mail = self.get_object()
        if mail.sender == request.user:
            mail.is_deleted_by_sender = True
        elif mail.recipient == request.user:
            mail.is_deleted_by_recipient = True
        mail.save()
        return Response({'status': 'mail deleted'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='category')
    def categorized_mails(self, request):
        """
        Выборка писем по категориям.
        """
        user = request.user
        category = request.query_params.get('type')

        if category == 'inbox':
            mails = Mail.objects.filter(
                recipient=user, is_deleted_by_recipient=False
            ).order_by('-sent_at')

        elif category == 'sent':
            mails = Mail.objects.filter(
                sender=user, is_deleted_by_sender=False
            ).order_by('-sent_at')

        elif category == 'deleted':
            mails = Mail.objects.filter(
                (Q(sender=user) & Q(is_deleted_by_sender=True)) |
                (Q(recipient=user) & Q(is_deleted_by_recipient=True))
            ).order_by('-sent_at')

        elif category == 'spam':
            # Если планируется отдельная метка, можно добавить флаг is_spam
            mails = Mail.objects.filter(
                recipient=user, is_spam=True
            ).order_by('-sent_at')

        else:
            mails = self.get_queryset()

        serializer = MailListSerializer(mails, many=True)
        return Response(serializer.data)
