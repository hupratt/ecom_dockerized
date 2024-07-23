import os, sys, dotenv
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

sys.path.append("/app")
# sys.path.append("/home/ubuntu/Dev/ecom/ecom")

if os.environ.get("DJANGO_DEVELOPMENT") == "True":
    print("running dev settings")
    dotenv.read_dotenv(
        os.path.join(
            os.path.dirname((os.path.dirname(__file__))),
            ".env.development",
        )
    )
else:
    dotenv.read_dotenv(
        os.path.join(
            os.path.dirname((os.path.dirname(__file__))), ".env"
        )
    )

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home.settings")

# application = get_wsgi_application()
application = get_wsgi_application()
application = WhiteNoise(application, root="./static")
