# Почтовый сервис (Mail Service)


[![Python](https://img.shields.io/badge/-Python-464646?style=flat&logo=Python&logoColor=ffdd00&color=0055ee)](https://www.python.org/)
[![Django](https://img.shields.io/badge/-Django-464646?style=flat&logo=Django&logoColor=ffffff&color=006060)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/-Django%20REST%20Framework-464646?style=flat&logoColor=56C0C0&color=006060)](https://www.django-rest-framework.org/)
[![gunicorn](https://img.shields.io/badge/-gunicorn-464646?style=flat&logo=gunicorn&logoColor=ffffff&color=535754)](https://gunicorn.org/)
<br>
[![React](https://img.shields.io/badge/-React-464646?style=flat&logo=React&logoColor=B1EDFF&color=333333)](https://www.python.org/)
[![Bootstrap](https://img.shields.io/badge/-Bootstrap-464646?style=flat&logo=Bootstrap&logoColor=B1EDFF&color=0075E2)](https://getbootstrap.com)
<br>
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-464646?style=flat&logo=PostgreSQL&logoColor=56e0e0&color=2550b2)](https://www.postgresql.org/)
<br>
[![Docker](https://img.shields.io/badge/-Docker-464646?style=flat&logo=Docker&logoColor=B1EDFF&color=0075E2)](https://www.docker.com/)
[![Docker-compose](https://img.shields.io/badge/-Docker%20compose-464646?style=flat&logo=Docker&logoColor=FF82FF&color=555555)](https://www.docker.com/)
[![Docker Hub](https://img.shields.io/badge/-Docker%20Hub-464646?style=flat&logo=Docker&logoColor=ffffff&color=0030a5)](https://www.docker.com/products/docker-hub)
<br>
[![Nginx](https://img.shields.io/badge/-Nginx-464646?style=flat&logo=NGINX&logoColor=00ff00&color=005000)](https://nginx.org/ru/)
[![Yandex Cloud](https://img.shields.io/badge/-Yandex%20Cloud-464646?style=flat&logo=Yandex%20Cloud&logoColor=ffffff&color=4e79eb)](https://cloud.yandex.ru/)



## Описание проекта Mail Service
Клиент-серверное приложение, разработанное в рамках курсовой работы по дисциплине "Разработка клиент-серверных приложений".
В приложении можно посмотреть список писем, перейти на страницу с письмом, 
переместить письмо в спам или в корзину, изменить статус "прочитано" и отправить письмо.

![image](https://github.com/user-attachments/assets/72e13d0a-2d4c-4cb3-9c91-b23473f37375)


## Запуск проекта через Docker

Установить Docker, используя инструкции с официального сайта:
- для [Windows и MacOS](https://www.docker.com/products/docker-desktop)
- для [Linux](https://docs.docker.com/engine/install/ubuntu/). Отдельно потребуется установть [Docker Compose](https://docs.docker.com/compose/install/)

---

- Клонируйте репозиторий с проектом на свой компьютер. В терминале из рабочей директории выполните команду:
```bash
git clone https://github.com/BikMag/mail_service.git
```

- Перейти в папку с бэкендом
```bash
cd mail_service/backend
```

- Установить и активировать виртуальное окружение

```bash
source /venv/bin/activate
```

- Установить зависимости из файла requirements.txt

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```
- Создать файл .env в папке проекта:
```.env
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_NAME=postgres
DB_HOST=db
DB_PORT=5432
DEBUG=False
SECRET_KEY=django-insecure-...
```

- В папке proxy выполнить команду для запуска контейнера в фоновом режиме:
```bash
docker-compose up -d --build
```

- В результате должны быть собрано три контейнера (контейнер с фронтендом собирает статику и выключается), при введении следующей команды получаем список запущенных контейнеров:  
```bash
docker-compose ps
```
### Назначение контейнеров:  

|         NAMES        |          IMAGES                  |        DESCRIPTIONS         |
|:--------------------:|:--------------------------------:|:---------------------------:|
| mailservice-proxy    | nginx:1.25.4-alpine              |   контейнер веб-сервера     |
| mailservice-db       | postgres:13.10                   |   контейнер базы данных     |
| mailservice-back     | proxy-backend:latest             | контейнер приложения Django |
| mailservice-front    | proxy-frontend:latest            | контейнер приложения React  |

- Выполнить миграции:
```bash
docker-compose exec backend manage.py migrate
```

- Собрать статику и перенести ее в папку static:
```bash
docker-compose exec backend python manage.py collectstatic
docker-compose exec backend cp -r /app/collected_static/. /static/static/
```

- Создать нового супер пользователя 
```bash
python manage.py createsuperuser
```


### Основные адреса: 

| Адрес                | Описание                          |
|:---------------------|:----------------------------------|
| localhost            | Главная страница                  |
| localhost/admin/     | Для входа в панель администратора |
| localhost/api/docs/  | Описание работы API               |
