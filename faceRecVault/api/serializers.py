from rest_framework import serializers
from .models import FaceEncoding, User

# UserEncoding
'''
class FaceEncodingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceEncoding
        fields = ['encoding']
'''

# User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'