from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.shortcuts import render
import debug_toolbar
from .views import index, ServiceWorkerView


urlpatterns = [
    path("api-auth/", include("rest_framework.urls")),
    path("accounts/", include("allauth.urls")),
    path("accounts/", include("coreaccount.googleurls")),
    path("rest-auth/registration/", include("rest_auth.registration.urls")),
    path("rest-auth/", include("rest_auth.urls")),
    path("admin/", admin.site.urls),
    path("api/", include("core.api.urls")),
    # The service worker cannot be in /static because its scope will be limited to /static.
    # Since we want it to have a scope of the full application, we rely on this TemplateView
    # trick to make it work.
    path("sw.js", ServiceWorkerView.as_view(), name=ServiceWorkerView.name),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# make sure this is always last
urlpatterns += [re_path(r"^.*", index, name="home")]

if settings.DEBUG:
    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
