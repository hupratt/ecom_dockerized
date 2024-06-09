from django_countries.serializer_fields import CountryField
from django.utils import timezone
from rest_framework import serializers
from core.models import (
    Address,
    Item,
    Order,
    OrderItem,
    Coupon,
    Variation,
    ItemVariation,
    Payment,
    Livre,
    ImageLivre,
    LivreItem,
)
from django.contrib.auth.models import User


class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ("id", "code", "amount")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "is_staff")


class BookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageLivre
        fields = ("image", "alt")


class BookItemSerializer(serializers.ModelSerializer):
    date_achat = serializers.DateField(required=False)
    date_lecture = serializers.DateField(required=False)
    id = serializers.IntegerField(required=True)

    class Meta:
        model = LivreItem
        fields = ("id", "date_achat", "date_lecture")

    def create(self, validated_data):
        l = Livre.objects.get(id=validated_data.get("id"))
        if l.date_publication is None:
            l.date_publication = timezone.now()
            l.save()
        item = LivreItem(livre=l, date_entree=timezone.now())
        item.save()
        return validated_data


class BookSerializer(serializers.ModelSerializer):
    titre = serializers.CharField(required=True, max_length=100)
    isbn = serializers.CharField(required=True, max_length=50)
    # prix = serializers.IntegerField(required=False)
    # note = serializers.IntegerField(required=False)
    auteur_nom = serializers.CharField(required=False, max_length=50)
    langue_nom = serializers.CharField(required=False, max_length=50)
    genre_nom = serializers.CharField(required=False, max_length=50)
    # get_quantity = serializers.IntegerField(required=False)
    # prix_barre = serializers.IntegerField(required=False)
    description = serializers.CharField(required=False)
    picture = serializers.CharField(required=False)
    # pictureid = serializers.IntegerField(required=False)
    get_item_id_list = serializers.ListField(required=False)
    book_quantity = BookItemSerializer(many=True, required=False)

    class Meta:
        model = Livre
        depth = 1
        fields = (
            "id",
            "titre",
            "isbn",
            "prix",
            "note",
            "auteur_nom",
            "langue_nom",
            "genre_nom",
            "get_quantity",
            "prix_barre",
            "description",
            "picture",
            "pictureid",
            "get_item_id_list",
            "book_quantity",
        )


class ItemSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            "id",
            "title",
            "price",
            "discount_price",
            "category",
            "label",
            "slug",
            "description",
            "image",
        )

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()


class VariationDetailSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = ("id", "name", "item")

    def get_item(self, obj):
        return ItemSerializer(obj.item).data


class ItemVariationDetailSerializer(serializers.ModelSerializer):
    variation = serializers.SerializerMethodField()

    class Meta:
        model = ItemVariation
        fields = ("id", "value", "attachment", "variation")

    def get_variation(self, obj):
        return VariationDetailSerializer(obj.variation).data


class OrderItemSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()
    livre = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ("id", "livre", "item_variations", "quantity", "final_price")

    def get_livre(self, obj):
        return BookSerializer(obj.livre).data

    def get_item_variations(self, obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(), many=True).data

    def get_final_price(self, obj):
        return obj.get_final_price()


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ("id", "order_items", "total", "coupon")

    def get_order_items(self, obj):
        if isinstance(obj, Order):
            return OrderItemSerializer(obj.items.all(), many=True).data

    def get_total(self, obj):
        if isinstance(obj, Order):
            return obj.get_total()

    def get_coupon(self, obj):
        if isinstance(obj, Order):
            if obj.coupon is not None:
                return CouponSerializer(obj.coupon).data
            return None


class ItemVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = ("id", "value", "attachment")


class VariationSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = ("id", "name", "item_variations")

    def get_item_variations(self, obj):
        return ItemVariationSerializer(obj.itemvariation_set.all(), many=True).data


class ItemDetailSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            "id",
            "title",
            "price",
            "discount_price",
            "category",
            "label",
            "slug",
            "description",
            "image",
            "variations",
        )

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

    def get_variations(self, obj):
        return VariationSerializer(obj.variation_set.all(), many=True).data


class AddressSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Address
        fields = (
            "id",
            "user",
            "street_address",
            "apartment_address",
            "country",
            "zip",
            "address_type",
            "default",
        )


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "amount", "timestamp")
