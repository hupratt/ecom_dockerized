from django.apps import AppConfig
from django.conf import settings
import posthog, stripe


class PostHogConfig(AppConfig):
    verbose_name = "PostHog Config"
    name = "core"

    def ready(self):
        posthog.api_key = settings.POSTHOG_KEY
        posthog.host = settings.POSTHOG_DOMAIN
        stripe.api_key = settings.STRIPE_SECRET_KEY
