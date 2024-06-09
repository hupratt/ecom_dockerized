from django.db.models.signals import post_save
from .models import Livre, ImageLivre


def create_image(sender, **kwargs):
    if kwargs["created"]:
        book = kwargs["instance"]
        image_instance = ImageLivre(
            livre=book, alt=f"Book import image for isbn: {book.isbn}"
        )
        image_instance.save()


post_save.connect(create_image, sender=Livre)
