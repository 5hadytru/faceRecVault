# Generated by Django 3.1.2 on 2021-01-09 04:21

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20210107_0044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagecomponent',
            name='caption',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='imagecomponent',
            name='name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='textcomponent',
            name='name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='vaultentry',
            name='last_edited',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2021, 1, 9, 4, 21, 10, 411870, tzinfo=utc), null=True),
        ),
    ]