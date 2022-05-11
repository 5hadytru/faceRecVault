from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import FaceEncoding, Customer, VaultEntry, TextComponent, ImageComponent
from .face_rec import generateEncoding, compareFaces
import json
import numpy as np
from django.http import JsonResponse
from django.contrib.auth import login
from os import listdir, remove, path
import urllib

STATIC_FILES = '/Users/truman/School/LSDM/faceRecVault/faceRecVault/static/'

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'CreateEncoding': 'encoding-create'
    }
    return Response(api_urls)


'''
    face recognition endpoints
'''
@api_view(['POST'])
def createEncoding(request):
    # create encoding for webcam image
    base64img = request.data["imageb64"] # getting dataURL
    imgEncoding = generateEncoding(base64img) # generates ndarray
    print(imgEncoding.size)
    # if no faces found, generateEncoding returns False
    if imgEncoding.size == 0:
        print("NO FACE")
        return JsonResponse({"response": "No face in image"})
    imgEncodingString = np.array2string(imgEncoding)
    imgByteEncoding = bytes(imgEncodingString, 'utf-8') # converts ndarray to bytes

    if request.user.is_authenticated:
        print(request.user.username)
        print("STORING")
        # store -> return success and log in or return failure object
        currentUser = request.user
        FaceEncoding.objects.create(user=currentUser, encoding=imgByteEncoding)
        # return redirect('vault', currentUser.username) getting rid of this so i dont have to deal with redirect objects rn
        return JsonResponse({"response": f"redirect vault/{currentUser.username}"})
    else:
        print("COMPARING")
        # compare -> store if/when matched -> log in and redirect or return failure
        allEncodings = FaceEncoding.objects.all()
        for e in allEncodings:
            # converting stored encoding (e) bytes -> npndarray
            eString = str(e.encoding).replace("b'[", '').replace("]'", '').replace("\\", '').replace('n', '')
            eArray = eString.split()
            for i in range(len(eArray)):
                eArray[i] = float(eArray[i])
            eArray = np.array(eArray)

            # comparing the current stored encoding to the new encoding and logging in if true
            if compareFaces(imgEncoding, [eArray]):
                FaceEncoding.objects.create(user=e.user, encoding=imgByteEncoding)
                print(e.user.username)
                login(request, e.user)
                return JsonResponse({"response": f"redirect vault/{e.user.username}"})
        # once all stored encodings have been run thru
        return JsonResponse({"response": "No match"})


'''
    vault endpoints (vault overview page)
'''
@api_view(['DELETE'])
def deleteVaultEntry(request, username, entryID):
    VaultEntry.objects.get(id=entryID).delete()
    return JsonResponse({"response": "success"})

@api_view(['POST'])
def createVaultEntry(request, username):
    newEntry = VaultEntry.objects.create(user=request.user)
    return JsonResponse({"id": newEntry.id})


'''
    vaultEntry endpoints
'''
@api_view(['POST'])
def createComponents(request):
    
    vault_entry_id = request.data["vaultEntry"]
    save_count = 0
    for component in request.data["compData"]:

        if component["dataType"] == "Text":

            TextComponent.objects.create(
                name=component["name"],
                data=component["data"], 
                vaultEntry=VaultEntry.objects.get(id=vault_entry_id)
            )
            save_count+=1
        else:

            # get imageID (last imageID in static image dir +1)
            # only works if there is already an image in the dir
            imageID = int(listdir(f'{STATIC_FILES}images/userImages')[-1].split('image')[1].split('.')[0]) + 1

            # create and save image in static image dir with the imageID
            absImageUrl = f'{STATIC_FILES}images/userImages/image{imageID}.jpg'
            imgResponse = urllib.request.urlopen(component["imageB64"])
            with open(absImageUrl, 'wb') as f:
                f.write(imgResponse.file.read())

            ImageComponent.objects.create(
                name=component["name"],
                imgURL=f'images/userImages/image{imageID}.jpg',
                caption=component["caption"],
                vaultEntry=VaultEntry.objects.get(id=vault_entry_id)
            )
            save_count+=1

    return JsonResponse({"status": f"Saved {save_count}"})

@api_view(['PUT'])
def updateComponents(request):

    update_count = 0
    for component in request.data["compData"]:

        if component["dataType"] == "Text":

            TextComponent.objects.filter(id=component["id"]).update(
                name=component["name"],
                data=component["data"]
            )
            update_count+=1
        else:

            ImageComponent.objects.filter(id=component["id"]).update(
                name=component["name"],
                caption=component["caption"]
            )
            update_count+=1

    return JsonResponse({"status": f"Updated {update_count}"})

@api_view(['DELETE'])
def deleteComponents(request):
    
    # zipping the component data types and IDs into a single array of tuples
    data = list(zip(
        request.data["deletedComponentDataTypes"], request.data["deletedComponentIDs"]))

    print(data)

    delete_count = 0
    for compData in data:
        if compData[0] == "Text":

            deleted = TextComponent.objects.get(id=compData[1]).delete()

            if deleted[0] == 1:
                delete_count += 1
            else:
                print(f'Failed to delete Text {compData[1]}')

        else:

            component = ImageComponent.objects.get(id=compData[1])
            absImagePath = f'{STATIC_FILES}{component.imgURL}'

            if path.exists(absImagePath):
                remove(absImagePath)
            else:
                print(f'The image at {absImagePath} does not exist')

            deleted = component.delete()
            if deleted[0] == 1:
                delete_count += 1
            else:
                print(f'Failed to delete Image {compData[1]}')

    return JsonResponse({"status": f"Deleted {delete_count}"})


'''
@api_view(['POST'])
def createEntryText(request, username, entryID):
    return JsonResponse({})

@api_view(['PUT'])
def updateEntryImage(request, username, entryID):
    base64img = request.data["imageb64"] # getting dataURL

    return JsonResponse({})

@api_view(['PUT'])
def updateEntryText(request, username, entryID):
    return JsonResponse({})

@api_view(['DELETE'])
def deleteEntryImage(request, username, entryID):
    return JsonResponse({})

@api_view(['DELETE'])
def deleteEntryText(request, username, entryID):
    return JsonResponse({})
'''


'''
# User
@api_view(['GET'])
def usersList(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def userDetail(request, key):
    user = User.objects.get(userID=key)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def userCreate(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    # send user's ID in response so you can store the encoding and generate dash with ID
    return Response(serializer.data)

@api_view(['PUT'])
def userUpdate(request, key):
    user = User.objects.get(userID=key)
    serializer = UserSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def userDelete(request, key):
    user = User.objects.get(userID=key)
    serialized = UserSerializer(user, many=False)
    user.delete()
    return Response(serialized.data)

@api_view(['PUT'])
def userUpdate(request, key):
    user = User.objects.get(userID=key)
    serializer = UserSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def userDelete(request, key):
    user = User.objects.get(userID=key)
    serialized = UserSerializer(user, many=False)
    user.delete()
    return Response(serialized.data)
'''