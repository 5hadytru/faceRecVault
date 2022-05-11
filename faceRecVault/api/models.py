from django.db import models
import random
from django.contrib.auth.models import User
from django.utils import timezone


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    
class FaceEncoding(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, related_name="userFE") 
    encoding = models.BinaryField()

class VaultEntry(models.Model):
    name = models.CharField(default="", max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_edited = models.DateTimeField(default=timezone.now(), blank=True, null=True)

class TextComponent(models.Model):
    dataType = models.CharField(default="Text", max_length=20)
    name = models.CharField(blank=True, max_length=100)
    data = models.TextField(null=True, blank=True)
    vaultEntry = models.ForeignKey(VaultEntry, on_delete=models.CASCADE)

class ImageComponent(models.Model):
    dataType = models.CharField(default="Image", max_length=20)
    name = models.CharField(blank=True, max_length=100)
    imgURL = models.CharField(blank=True, null=True, max_length=40)
    caption = models.TextField(null=True, blank=True)
    vaultEntry = models.ForeignKey(VaultEntry, on_delete=models.CASCADE, null=True)
