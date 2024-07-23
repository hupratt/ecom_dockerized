import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

SECRET_KEY = os.environ.get("SECRET_KEY_books")

DEBUG = False

if os.environ.get("DJANGO_DEVELOPMENT") is not None:
    DEBUG = True

ALLOWED_HOSTS = [
    "shop.lapetiteportugaise.eu",
    "127.0.0.1",
    "localhost",
    "10.5.5.1",
    "lapetiteportugaise2-api.thekor.eu",
    "lapetiteportugaise-api.thekor.eu",
]

ALLOWED_HOSTS += ['172.103.{}.{}'.format(i,j) for i in range(256) for j in range(256)]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "django.contrib.postgres",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",
    "allauth.socialaccount.providers.facebook",
    "corsheaders",
    "rest_auth",
    "rest_auth.registration",
    "rest_framework",
    "rest_framework.authtoken",
    "debug_toolbar",
    "frontend",
    "home",
    "storages",
    "core",
    "coreaccount",
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # 'whitenoise.middleware.WhiteNoiseMiddleware'
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "home.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

# for the debug toolbar middleware
INTERNAL_IPS = ["127.0.0.1", "localhost"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ecom",
        "USER": os.environ.get("dbuser"),
        "PASSWORD": os.environ.get("dbpassword"),
        "HOST": os.environ.get("hostip"),
        "PORT": os.environ.get("pnumber"),
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Luxembourg"
USE_I18N = True
USE_L10N = True
USE_TZ = True

SITE_ID = 2
USE_S3 = True

if USE_S3:
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    AWS_ACCESS_KEY_ID = os.getenv("MINIO_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("MINIO_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.getenv("MINIO_STORAGE_BUCKET_NAME")
    AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_URL")
    AWS_S3_CUSTOM_DOMAIN = (
        f"https://minio-api.thekor.eu/bookshop-images-f1492f08-f236-4a55-afb7-70ded209cb27"
    )
    MINIO_ACCESS_URL = os.getenv("MINIO_ACCESS_URL")
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    # s3 static settings
    STATIC_LOCATION = "static"
    STATIC_URL = "/static/"
    STATIC_ROOT = os.path.join(BASE_DIR, "static")
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
    # STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/"
    STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = "media"
    # MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/"
    MEDIA_URL = "/media/"
else:
    STATIC_URL = "/static/"
    MEDIA_URL = "/media/"


REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
}


ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
LOGIN_REDIRECT_URL = "/"

# dev

WSGI_APPLICATION = "home.wsgi.application"

CORS_ORIGIN_ALLOW_ALL = True


CORS_ORIGIN_WHITELIST = [
    "https://minio-api.thekor.eu",
    "https://posthog.thekor.eu",
    "https://lapetiteportugaise2.thekor.eu",
    "https://lapetiteportugaise.thekor.eu",
]


# Stripe

STRIPE_PUBLIC_KEY = "pk_test_eRajPaamV4LUIhBv3oFmauqn"
STRIPE_SECRET_KEY = "sk_test_XILCGBz8vPvjJtMWvrwD0jtS"

# prod

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Posthog
POSTHOG_KEY = os.environ.get("POSTHOG_KEY", "")
POSTHOG_DOMAIN = os.environ.get("POSTHOG_DOMAIN", "")


SESSION_COOKIE_SAMESITE = "Strict"
LANGUAGE_COOKIE_SAMESITE = "Strict"


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(name)s.%(funcName)s:%(lineno)s- %(message)s"
        },
        "simple": {"format": "{levelname} {message}", "style": "{"},
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "error.log"),
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            # output logs to the console and to the file
            "level": "INFO",
            "handlers": ["file", "console"],
            "propagate": True,
        }
    },
}
