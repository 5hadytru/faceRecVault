from django.urls import path
from . import views
from django.urls import include

urlpatterns =[
    path('', views.apiOverview, name='api-overview'),
    path('encoding/', include([
        path('create/', views.createEncoding, name='create-encoding')
    ])),
    path('vault/<str:username>/', include([
        path('delete/<int:entryID>/', views.deleteVaultEntry, name='delete-vault-entry'),
        path('create/', views.createVaultEntry, name='create-vault-entry')
    ])),
    path('vaultEntry/', include([
        path('createComponents/', views.createComponents, name='create-entry-components'),
        path('updateComponents/', views.updateComponents, name='update-entry-components'),
        path('deleteComponents/', views.deleteComponents, name='delete-entry-components'),
    ]))
]