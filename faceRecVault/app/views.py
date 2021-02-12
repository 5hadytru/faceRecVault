from django.shortcuts import render, redirect
import os
from api.models import VaultEntry, ImageComponent, TextComponent, FaceEncoding
from itertools import chain
from operator import attrgetter

# Create your views here
def home(request):
    just_registered = 0

    # checking if the user just registered; if so, allow and encourage them to create an initial face encoding
    if request.user.is_authenticated and not len(FaceEncoding.objects.filter(user=request.user)):
        just_registered = 1
    # if the person is already logged in and has previously stored encodings
    elif request.user.is_authenticated:
        return redirect('vault', username=request.user.username)

    context = {"just_registered": just_registered}
    return render(request, "app/home.html", context=context)


def vault(request, username):

    # checking if the user doesnt yet have a face encoding; if so, redirect to home
    if not len(FaceEncoding.objects.filter(user=request.user)):
        return redirect('home')

    if not request.user.username.endswith(username):
        return redirect('home')
    # After logging in (Django doesn't allow numerical usernames and the username is inaccessible in settings.py)
    if username == '123':
        username = request.user.username
        return redirect('vault', username=username)

    '''Get vault entries and add to context'''
    # Only need to send entry name, time of last edit, and ID to template, but template tags
    # are better used with objects being passed
    entries = VaultEntry.objects.filter(user=request.user).order_by('-last_edited')
    #for entry in VaultEntry.objects.filter(user=request.user).order_by('-last_edited'):
        #entries.append(entry)

    # Deleting an entry sends a DELETE request to the API
    context = {"username": username, "entries": entries}
    return render(request, 'app/vault.html', context=context)


def vaultEntry(request, username, entryID):

    '''
        1. Get all components of entry
        2. Combine them into a single list
        3. Send to template
    '''

    entry = VaultEntry.objects.get(id=entryID)
    entryName = entry.name

    images = ImageComponent.objects.filter(vaultEntry=entry).order_by('id')
    textBoxes = TextComponent.objects.filter(vaultEntry=entry).order_by('id')

    # combine then sort components
    orderedComponents = sorted(chain(images, textBoxes), key=attrgetter('id'))

    # deleting a component sends a DELETE request to the API
    # editing then hitting save will send a PUT request; do VaultEntry.save() to update last edit

    context = {"name": entryName, "components": orderedComponents}
    return render(request, 'app/vaultEntry.html', context=context)