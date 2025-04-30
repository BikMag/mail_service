from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.validators import EmailValidator
from django.db import models


class User(AbstractUser):
    email = models.EmailField(
        'Адрес электронной почты',
        unique=True,
        null=False,
        blank=False,
        validators=[EmailValidator()],
        error_messages={
            'unique': 'Пользователь с таким email уже существует.',
        }
    )


class Mail(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_mails',
        verbose_name='Отправитель'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_mails',
        verbose_name='Получатель'
    )
    subject = models.CharField('Тема', max_length=255)
    body = models.TextField('Текст')
    sent_at = models.DateTimeField('Дата отправки', auto_now_add=True)
    is_read = models.BooleanField('Прочитано', default=False)
    is_spam = models.BooleanField('Спам', default=False)
    is_deleted_by_sender = models.BooleanField(
        'Удалено отправителем',
        default=False
    )
    is_deleted_by_recipient = models.BooleanField(
        'Удалено получателем',
        default=False
    )

    class Meta:
        verbose_name = 'Письмо'
        verbose_name_plural = 'Письма'

        ordering = ('-sent_at', )

    def __str__(self):
        return (
            f'От {self.sender.username} '
            f'к {self.recipient.username} - {self.subject}'
        )
