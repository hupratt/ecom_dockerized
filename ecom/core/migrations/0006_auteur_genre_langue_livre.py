# Generated by Django 2.2.9 on 2020-01-26 15:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_orderitem_item_variations'),
    ]

    operations = [
        migrations.CreateModel(
            name='Auteur',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Langue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Livre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titree', models.CharField(max_length=50)),
                ('isbne', models.CharField(max_length=50)),
                ('date_publication', models.DateTimeField()),
                ('prix', models.FloatField()),
                ('date_achat', models.DateTimeField()),
                ('date_lecture', models.DateTimeField()),
                ('date_entree', models.DateTimeField()),
                ('note', models.IntegerField()),
                ('nb_pages', models.IntegerField()),
                ('date_maj', models.DateTimeField(auto_now_add=True)),
                ('id_auteur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Auteur')),
                ('id_genre', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Genre')),
                ('id_langue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Langue')),
            ],
        ),
    ]
