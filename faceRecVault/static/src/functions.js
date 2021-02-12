import 'regenerator-runtime/runtime'

/*

    home page functions

*/
export const createEncoding = async (imageB64) => {

    let data = {
        imageb64: imageB64
    };
    data = JSON.stringify(data);

    const response = await fetch('http://127.0.0.1:8000/api/encoding/create/', {
        method: "POST",
        body: data,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
}

export const handleEncodingResponse = (responseObj) => {

    const responseText = responseObj.response;

    if (responseText.startsWith('redirect')){
        const redirectText = responseText.slice(responseText.indexOf('redirect') + 9);
        window.location.href = `http://127.0.0.1:8000/${redirectText}`;
    }
    else{
        hideLoadingWheel();
        const errorContainer = document.querySelector('#errorMsg');
        errorContainer.innerText = "Try again";
    }
};

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const hideLoadingWheel = () => {
    const loader = document.querySelector('.loader');
    loader.classList.remove('loader');
};

/*

    vault overview page functions

*/

export const deleteVaultEntry = async (username, entryId) => {

    const response = await fetch(`http://127.0.0.1:8000/api/vault/${username}/delete/${entryId}/`, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};

export const createVaultEntry = async (username) => {

    const response = await fetch(`http://127.0.0.1:8000/api/vault/${username}/create/`, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};

/*

    vaultEntry page functions

*/

/**
 * NOTES
 * - Obviously should have had a unified function for getting data for POST and PUTs but whatevs
 */

export const saveNewComponents = async (newComponentIDs, newImageB64s, vaultEntry) => {

    console.log(`Save new ${newComponentIDs.size}`);

    // the request body will contain the vault entry ID and a list of components to be POSTed
    let requestBody = {
        vaultEntry: vaultEntry,
        compData: []
    };

    let imgCount = 0;
    newComponentIDs.forEach(compID => {

        // getting component and data type
        const component = document.querySelector(`[id$='Container${compID}']`);
        if (component.id.startsWith('t')){

            // component name and main data
            const nameData = component.querySelector(`#txtName${compID}`).innerText;
            const mainData = component.querySelector(`#txtData${compID}`).innerText;

            requestBody.compData.push({
                dataType: 'Text',
                name: nameData,
                data: mainData
            });
        }
        else {

            // checking if the "Choose File" button still exists for this image; if so, skip this component
            if (component.querySelector(`.imgData${compID}`)){
                console.log(`Continued on ${compID}; image was never uploaded!`);
                return; // advance the forEach
            }

            // img name and caption
            const nameData = component.querySelector(`#imgName${compID}`).innerText;
            const captionData = component.querySelector(`#imgCaption${compID}`).innerText;
            
            // get raw image b64
            // assumes the order of images in newComponentIDs is the same as newImageB64s
            const rawImgB64 = newImageB64s[imgCount];

            requestBody.compData.push({
                dataType: 'Image',
                name: nameData,
                imageB64: rawImgB64,
                caption: captionData
            })

            imgCount += 1;
        }  
    });

    // if no images were actually uploaded
    if (requestBody.compData.length == 0){

        return "{status: 'Saved 0'}";
    }

    // sending request
    console.log(`POST body: ${requestBody}`);
    requestBody = JSON.stringify(requestBody);
    const response = await fetch('http://127.0.0.1:8000/api/vaultEntry/createComponents/', {
        method: "POST",
        body: requestBody,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};

export const saveUpdatedComponents = async (updatedComponentIDs) => {

    // the request body will contain the vault entry ID and a list of components to be POSTed
    let requestBody = {
        compData: []
    };

    let imgCount = 0;
    updatedComponentIDs.forEach(compID => {

        // getting component and data type
        const component = document.querySelector(`[id$='Container${compID}']`);
        if (component.id.startsWith('t')){

            // component name and main data
            const nameData = component.querySelector(`#txtName${compID}`).innerText;
            const mainData = component.querySelector(`#txtData${compID}`).innerText;

            requestBody.compData.push({
                dataType: 'Text',
                name: nameData,
                data: mainData,
                id: compID
            });
        }
        else {

            // checking if the "Choose File" button still exists for this image; if so, skip this component
            if (component.querySelector(`.imgData${compID}`)){ // input tags have imgData classes instead of ids
                console.log(`Continued on ${compID}; image was never uploaded!`);
                return; // advance the forEach
            }

            // img name and caption
            const nameData = component.querySelector(`#imgName${compID}`).innerText;
            const captionData = component.querySelector(`#imgCaption${compID}`).innerText;

            requestBody.compData.push({
                dataType: 'Image',
                name: nameData,
                caption: captionData,
                id: compID
            })

            imgCount += 1;
        }  
    });

    // if no images were actually uploaded
    if (requestBody.compData.length == 0){

        return "{status: 'Updated 0'}";
    }

    // sending request
    requestBody = JSON.stringify(requestBody);
    console.log(`PUT body: ${requestBody}`);
    const response = await fetch('http://127.0.0.1:8000/api/vaultEntry/updateComponents/', {
        method: "PUT",
        body: requestBody,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};

export const saveDeletedComponents = async (deletedComponentIDs, deletedComponentDataTypes) => {

    let requestBody = {
        deletedComponentDataTypes: deletedComponentDataTypes,
        deletedComponentIDs: Array.from(deletedComponentIDs)
    }

    requestBody = JSON.stringify(requestBody);
    console.log(`DELETE body: ${requestBody}`);
    const response = await fetch('http://127.0.0.1:8000/api/vaultEntry/deleteComponents/', {
        method: "DELETE",
        body: requestBody,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};


/*
export const createImageComponent = (imageB64, orderKey, entryID) => {

    let data = {
        imageb64: imageB64,
        entryID: entryID,
        orderKey: orderKey
    };
    data = JSON.stringify(data);

    const response = await fetch('http://127.0.0.1:8000/api/vault/create/', {
        method: "POST",
        body: data,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
};

export const createTextComponent = (name, text, orderKey, entryID) => {

    let data = {
        name: name, 
        text: text,
        orderKey: orderKey,
        entryID: entryID
    };
    data = JSON.stringify(data);

    const response = await fetch('http://127.0.0.1:8000/api/vault/create/', {
        method: "POST",
        body: data,
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // getting the csrf token that django cookiefies
        }
    });

    return response;
}

*/
