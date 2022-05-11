# Generated by Django 3.1.2 on 2020-12-24 01:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0005_auto_20201219_1706'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faceencoding',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='userFE', to=settings.AUTH_USER_MODEL),
        ),
    ]