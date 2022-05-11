# Generated by Django 3.1.2 on 2021-01-20 03:03

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20210108_2221'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imagecomponent',
            name='order_key',
        ),
        migrations.RemoveField(
            model_name='textcomponent',
            name='order_key',
        ),
        migrations.AlterField(
            model_name='vaultentry',
            name='last_edited',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2021, 1, 20, 3, 3, 30, 62016, tzinfo=utc), null=True),
        ),
    ]