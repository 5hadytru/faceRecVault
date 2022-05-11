from django.urls import path, include
from . import views

urlpatterns =[
    path('', views.home, name='home'),
    path('vault/<str:username>/', include([
        path('', views.vault, name='vault'),
        path('<int:entryID>/', views.vaultEntry, name='vault-entry')
    ])),
]