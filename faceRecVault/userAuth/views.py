from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
import os
from .forms import RegistrationForm

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('login') # if the form is invalid, it'll automatically refresh the view and give info
    else:
        form = RegistrationForm()

    context = {"form": form}
    return render(request, 'userAuth/register.html', context)