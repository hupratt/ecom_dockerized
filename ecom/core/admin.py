from django.contrib import admin
from django.contrib.sessions.models import Session

from .models import (
    Item,
    OrderItem,
    Order,
    Payment,
    Coupon,
    Refund,
    Address,
    UserProfile,
    Variation,
    ItemVariation,
    Livre,
    ImageLivre,
    LivreItem,
)


def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)


class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()

    list_display = ["session_key", "_session_data", "expire_date"]


class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "ordered",
        "being_delivered",
        "received",
        "refund_requested",
        "refund_granted",
        "shipping_address",
        "billing_address",
        "payment",
        "coupon",
    ]
    list_display_links = [
        "user",
        "shipping_address",
        "billing_address",
        "payment",
        "coupon",
    ]
    list_filter = [
        "ordered",
        "being_delivered",
        "received",
        "refund_requested",
        "refund_granted",
    ]
    search_fields = ["user__username", "ref_code"]
    actions = [make_refund_accepted]


class AddressAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "street_address",
        "apartment_address",
        "country",
        "zip",
        "address_type",
        "default",
    ]
    list_filter = ["default", "address_type", "country"]
    search_fields = ["user", "street_address", "apartment_address", "zip"]


class ItemVariationAdmin(admin.ModelAdmin):
    list_display = ["variation", "value", "attachment"]
    list_filter = ["variation", "variation__item"]
    search_fields = ["value"]


class ItemVariationInLineAdmin(admin.TabularInline):
    model = ItemVariation
    extra = 1


class LivreInLineAdmin(admin.ModelAdmin):
    list_display = [
        "titre",
        "date_publication",
        "isbn",
        "get_quantity",
        "prix",
        "auteur_nom",
        "langue_nom",
        "genre_nom",
        "description",
        "updated",
        "id",
        "created",
        "edit_book_url",
    ]
    list_filter = ["auteur_nom"]
    search_fields = [
        "titre",
        "date_publication",
        "isbn",
        "prix",
        "auteur_nom",
        "langue_nom",
        "genre_nom",
        "description",
    ]
    model = Livre


class ImageLivreInLineAdmin(admin.ModelAdmin):
    model = ImageLivre
    list_display = [
        "livre",
        "auteur",
        "genre_nom",
        "titre",
        "langue_nom",
        "alt",
        "created",
        "get_image",
        "updated",
        "get_isbn",
        "id",
    ]
    search_fields = ["livre__isbn", "livre__auteur_nom", "livre__titre"]


class LivreItemInLineAdmin(admin.ModelAdmin):
    model = LivreItem
    list_display = [
        "get_isbn",
        "get_auteur_nom",
        "get_titre",
        "date_achat",
        "date_lecture",
        "date_entree",
        "updated",
        "id",
    ]
    search_fields = ["livre__isbn", "livre__auteur_nom", "livre__titre"]


class VariationAdmin(admin.ModelAdmin):
    list_display = ["item", "name"]
    list_filter = ["item"]
    search_fields = ["name"]
    inlines = [ItemVariationInLineAdmin]


admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Livre, LivreInLineAdmin)
admin.site.register(LivreItem, LivreItemInLineAdmin)
admin.site.register(ImageLivre, ImageLivreInLineAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserProfile)
admin.site.register(Session, SessionAdmin)
