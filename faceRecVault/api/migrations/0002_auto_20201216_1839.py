# Generated by Django 3.1.2 on 2020-12-17 00:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserEncoding',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('encoding', models.BinaryField()),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='encodings',
        ),
        migrations.DeleteModel(
            name='UserEncodings',
        ),
        migrations.AddField(
            model_name='userencoding',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
    ]
