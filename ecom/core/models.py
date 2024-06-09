from django.db.models.signals import post_save
from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.shortcuts import reverse
from django.shortcuts import get_object_or_404
from django_countries.fields import CountryField
from datetime import datetime
import os, logging
from django.utils.html import format_html

logger = logging.getLogger("django")


CATEGORY_CHOICES = (("S", "Shirt"), ("SW", "Sport wear"), ("OW", "Outwear"))

LABEL_CHOICES = (("P", "primary"), ("S", "secondary"), ("D", "danger"))

ADDRESS_CHOICES = (("B", "Billing"), ("S", "Shipping"))


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class ImageAuteur(models.Model):
    image = models.FileField(
        blank=True, null=True, help_text="(optional) author image field"
    )
    auteur = models.ForeignKey(
        "Auteur",
        on_delete=models.CASCADE,
        related_name="room_image",
        help_text="(automatic) room model linkage",
    )
    created = models.DateTimeField(
        auto_now_add=True, help_text="(automatic) created date"
    )
    alt = models.CharField(
        max_length=120,
        default="blank",
        help_text="(required) SEO for images in order to provide accessibility for the visually impaired",
    )

    def __str__(self):
        return self.alt

    def __unicode__(self):
        return self.alt

    def get_ordering_queryset(self):
        return self.auteur.images.all()


class LivreItem(models.Model):
    date_achat = models.DateTimeField(blank=True, null=True)
    date_lecture = models.DateTimeField(blank=True, null=True)
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    date_entree = models.DateTimeField(blank=True, null=True)
    livre = models.ForeignKey(
        "Livre", on_delete=models.CASCADE, related_name="book_quantity", default=0
    )
    created = models.DateTimeField(
        auto_now_add=True, help_text="(automatic) created date"
    )

    class Meta:
        ordering = ("-created",)

    def get_isbn(self):
        return self.livre.isbn

    def get_titre(self):
        return self.livre.titre

    def get_auteur_nom(self):
        return self.livre.auteur_nom

    def __str__(self):
        return f"Book {self.id}"

    def __unicode__(self):
        return f"Book {self.id}"


class Livre(models.Model):
    titre = models.CharField(max_length=100)
    auteur_nom = models.CharField(max_length=50, default="unknown", null=True)
    langue_nom = models.CharField(max_length=50, default="unknown", null=True)
    genre_nom = models.CharField(max_length=50, default="unknown", null=True)
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    isbn = models.CharField(max_length=50, unique=True, default="unknown")
    date_publication = models.DateTimeField(blank=True, null=True)
    prix = models.FloatField(blank=True, null=True)
    prix_barre = models.FloatField(blank=True, null=True)
    note = models.IntegerField(blank=True, null=True)
    nb_pages = models.IntegerField(blank=True, null=True)
    date_maj = models.DateTimeField(auto_now_add=True)
    description = models.TextField(default="", null=True, blank=True)
    created = models.DateTimeField(
        auto_now_add=True, help_text="(automatic) created date"
    )

    class Meta:
        ordering = ("-created",)

    def get_absolute_url(self):
        return reverse("core:product", kwargs={"id": self.id})

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={"id": self.id})

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={"id": self.id})

    def get_item_id_list(self):
        queryset = self.book_quantity.get_queryset().all()
        list_of_ids = [bookitem.id for bookitem in queryset]
        return list_of_ids

    def get_quantity(self):
        return self.book_quantity.count()

    def show_homepage(self):
        if self.book_quantity.count() > 0:
            return True

    def edit_book_url(self):
        return format_html(
            '<a href="%s">%s</a>'
            % (f"{os.getenv('REACT_APP_BASE')}/books/{self.id}", "Edit this book")
        )

    def __str__(self):
        return f"Book {self.isbn}"

    def __unicode__(self):
        return f"Book {self.isbn}"

    def picture(self):
        image = self.livre_name.get_queryset().order_by("-updated").first()
        # logger.info(f"Image exists: {len(str(image)) > 0}")
        if image is not None and len(str(image)) > 0:
            # logger.info(
            #     f"Image name: {settings.AWS_S3_CUSTOM_DOMAIN}/lppshop/{image.image.name}"
            # )
            # Fix me: image.url is wrong for some reason, appends https twice
            image_name = image.image.name
            path = f"{settings.AWS_S3_CUSTOM_DOMAIN}/{image_name}".replace(
                "https://https://", "https://"
            )
            return path
        else:
            return f"{settings.AWS_S3_CUSTOM_DOMAIN}/resources/no-image-icon.jpg"

    def pictureid(self):
        image = self.livre_name.get_queryset().order_by("-updated").first()
        if image is not None:
            return image.id
        return 0


class Auteur(models.Model):
    nom = models.CharField(max_length=50)
    livre = models.ForeignKey(Livre, on_delete=models.CASCADE, default=1)


class ImageLivre(models.Model):
    image = models.FileField(
        blank=True, null=True, help_text="(optional) book image field"
    )
    livre = models.ForeignKey(
        "Livre",
        on_delete=models.CASCADE,
        related_name="livre_name",
        help_text="(automatic) book model linkage",
    )
    created = models.DateTimeField(
        auto_now_add=True, help_text="(automatic) created date"
    )
    alt = models.CharField(
        max_length=120,
        default="blank",
        help_text="(required) SEO for images in order to provide accessibility for the visually impaired",
    )
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return f"{self.image}"

    def __unicode__(self):
        return f"{self.image}"

    def get_isbn(self):
        if self.livre:
            return f"{self.livre}"

    def auteur(self):
        if self.livre:
            return f"{self.livre.auteur_nom}"

    def genre_nom(self):
        if self.livre:
            return f"{self.livre.genre_nom}"

    def titre(self):
        if self.livre:
            return f"{self.livre.titre}"

    def langue_nom(self):
        if self.livre:
            return f"{self.livre.langue_nom}"

    def get_image(self):
        if self.image:
            return f"{self.image.url[8:]}"


def create_image(sender, **kwargs):
    if kwargs["created"]:
        book = kwargs["instance"]
        image_instance = ImageLivre.objects.create(
            livre=book, alt=f"Book import image for isbn: {book.isbn}"
        )


post_save.connect(create_image, sender=Livre)


class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=2)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={"slug": self.slug})

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={"slug": self.slug})

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={"slug": self.slug})


class Variation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # size

    class Meta:
        unique_together = ("item", "name")

    def __str__(self):
        return self.name


class ItemVariation(models.Model):
    variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
    value = models.CharField(max_length=50)  # S, M, L
    attachment = models.ImageField(blank=True)

    class Meta:
        unique_together = ("variation", "value")

    def __str__(self):
        return self.value


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    livre = models.ForeignKey(Livre, on_delete=models.CASCADE, default=1)
    item_variations = models.ManyToManyField(ItemVariation)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.livre.titre}"

    def get_total_item_price(self):
        return self.quantity * self.livre.prix

    def get_total_discount_item_price(self):
        return self.quantity * self.livre.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        # if self.livre.discount_price:
        #     return self.get_total_discount_item_price()
        return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        "Address",
        related_name="shipping_address",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    billing_address = models.ForeignKey(
        "Address",
        related_name="billing_address",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    payment = models.ForeignKey(
        "Payment", on_delete=models.SET_NULL, blank=True, null=True
    )
    coupon = models.ForeignKey(
        "Coupon", on_delete=models.SET_NULL, blank=True, null=True
    )
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    """
    1. Item added to cart
    2. Adding a billing address
    (Failed checkout)
    3. Payment
    (Preprocessing, processing, packaging etc.)
    4. Being delivered
    5. Received
    6. Refunds
    """

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return total


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = "Addresses"


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True
    )
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return self.user.username
        return "couldnotfind"


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
