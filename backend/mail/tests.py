from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Mail


User = get_user_model()


class UserAuthTests(APITestCase):

    def setUp(self):
        self.register_url = "/api/auth/users/"
        self.token_url = "/api/auth/token/login/"
        self.current_user_url = "/api/auth/users/me/"

        self.user_data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'StrongPassword123',
            're_password': 'StrongPassword123',
        }

    def login_user(self):
        """
        Вспомогательный метод для авторизации пользователя
        Возвращает токен
        """
        # Убедимся, что пользователь есть
        User.objects.create_user(
            email=self.user_data['email'],
            username=self.user_data['username'],
            password=self.user_data['password'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
        )

        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }

        response = self.client.post(self.token_url, login_data, format='json')
        token = response.data['auth_token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        return token

    def test_user_registration(self):
        """
        Тест успешной регистрации пользователя
        """
        response = self.client.post(
            self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(
            email=self.user_data['email']).exists())

    def test_user_registration_with_existing_email(self):
        """
        Тест регистрации пользователя с уже существующим email
        """
        User.objects.create_user(
            email=self.user_data['email'],
            username='anotheruser',
            password='SomePassword123',
            first_name='Existing',
            last_name='User'
        )
        response = self.client.post(
            self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_user_login(self):
        """
        Тест успешного входа пользователя и получения токена
        """
        User.objects.create_user(
            email=self.user_data['email'],
            username=self.user_data['username'],
            password=self.user_data['password'],
            first_name='Test',
            last_name='User'
        )

        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }

        response = self.client.post(self.token_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('auth_token', response.data)

    def test_login_with_invalid_credentials(self):
        """
        Тест входа с неверными учетными данными
        """
        # Создать пользователя
        User.objects.create_user(
            email=self.user_data['email'],
            username=self.user_data['username'],
            password=self.user_data['password'],
            first_name='Test',
            last_name='User'
        )

        login_data = {
            'email': 'wrong@example.com',
            'password': 'wrongpassword',
        }

        response = self.client.post(self.token_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_get_current_user(self):
        """
        Тест получения данных текущего пользователя через /users/me/
        """
        self.login_user()

        response = self.client.get(self.current_user_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertEqual(response.data['username'], self.user_data['username'])


class MailTests(APITestCase):

    def setUp(self):
        """
        Настройка пользователей и тестовых данных для почты
        """
        self.user1 = User.objects.create_user(
            email='user1@example.com', username='user1', password='password123'
        )
        self.user2 = User.objects.create_user(
            email='user2@example.com', username='user2', password='password123'
        )

        self.client.force_authenticate(
            user=self.user1)  # Авторизация от имени user1

    def test_create_mail(self):
        """
        Тест на создание письма
        """
        data = {
            'recipient_email': 'user2@example.com',
            'subject': 'Test Mail',
            'body': 'This is a test email.',
        }
        response = self.client.post('/api/mails/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Mail.objects.count(), 1)
        self.assertEqual(Mail.objects.first().sender, self.user1)
        self.assertEqual(Mail.objects.first().recipient.email,
                         'user2@example.com')

    def test_get_mail_list_pagination(self):
        """
        Тест на получение списка писем для текущего пользователя
        с учетом пагинации
        """

        PAGE_SIZE = 5
        for i in range(PAGE_SIZE):
            Mail.objects.create(
                sender=self.user1,
                recipient=self.user2,
                subject=f'Test Mail {i + 1}',
                body=f'Body of Test Mail {i + 1}'
            )

        response = self.client.get(f'/api/mails/?page=1&page_size={PAGE_SIZE}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results')), PAGE_SIZE)

        # Проверка пагинации
        # Проверка наличия ключа "next" в ответе
        self.assertIn('next', response.data)
        # Проверка наличия ключа "previous" в ответе
        self.assertIn('previous', response.data)

    def test_mark_mail_as_read(self):
        """
        Тест на пометку письма как прочитанное
        """
        mail = Mail.objects.create(
            sender=self.user1,
            recipient=self.user2,
            subject='Test Mail',
            body='Body of Test Mail'
        )

        response = self.client.post(f'/api/mails/{mail.id}/mark_as_read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mail.refresh_from_db()
        self.assertTrue(mail.is_read)

    def test_delete_mail(self):
        """
        Тест на удаление письма
        """
        mail = Mail.objects.create(
            sender=self.user1,
            recipient=self.user2,
            subject='Test Mail',
            body='Body of Test Mail'
        )

        response = self.client.post(f'/api/mails/{mail.id}/delete_mail/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mail.refresh_from_db()
        # Письмо должно быть удалено отправителем
        self.assertTrue(mail.is_deleted_by_sender)
