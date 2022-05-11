import face_recognition
import base64
from io import BytesIO
import urllib
import numpy as np

STATIC_FILES = '/Users/truman/School/LSDM/faceRecVault/faceRecVault/static/'

# takes base64 jpg data and converts to image then generates and returns encoding
def generateEncoding(b64img):

    # storing b64 image in temp directory
    imageUrl = STATIC_FILES + 'images/encodingBuffer/image.jpg'
    response = urllib.request.urlopen(b64img)
    with open(imageUrl, 'wb') as f:
        f.write(response.file.read())

    # generating encoding
    img = face_recognition.load_image_file(imageUrl) # loads into numpy array
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        return np.array([])

    return encodings[0]

def compareFaces(imageEncoding, knownEncoding):
    compare = face_recognition.compare_faces(knownEncoding, imageEncoding)
    '''
    "compare" is actually an array of arrays and each element of the innermost arrays corresponds to a single element of a known          encoding
    '''

    for i in compare:
        if i:
            return True
    return False

    '''
    # iterating thru comparison outcome array and returning index of first match relative to the known encodings array
    print(type(compare), print(compare))
    for i in range(len(compare)):
        for trueOrFalse in compare[i]:
            if trueOrFalse:
                matchCount += 1 # this corresponds to a single element of a single known encoding matching a single element of the new
        if matchCount > 114:
            return i
        matchCount = 0
    return -1
    '''
    '''
    # suspected a boolean but its a list of a single boolean
    if compare:
        return 1
    return -1
    '''

def getAndReturnFaceEncoding(imageLocation):
    img = face_recognition.load_image_file(imageLocation)
    encodings = face_recognition.face_encodings(img)
    return encodings