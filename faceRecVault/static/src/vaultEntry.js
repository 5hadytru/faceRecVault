import {saveNewComponents, saveUpdatedComponents, saveDeletedComponents} from './functions'

/*

    Setting appropriate global variables for the page

*/
const buttonContainer = document.querySelector("#buttonContainer");
const componentContainer = document.querySelector('#components');
const entryID = parseInt(window.location.href.substring(window.location.href.length - 3));
let emptyEntryMsg = document.querySelector('#empty');

// arrays for storing the IDs of edited, new, and initial components

let deletedComponentIDs = []; // for DELETE
let deletedComponentDataTypes = [];

let updatedComponentIDs = []; // for PUT

let newComponentIDs = []; // for POST


/*

    Processing initial components upon page load by adding event listeners for PUT requests 
    and delete buttons

*/

// Hiding the log off btn and nav text
document.querySelector('#logBtn').style.display = 'none';
document.querySelector('#anything').style.display = 'none';

// Adding an event listener to each component container to mark them for PUT request
// and adding DELETE btn event listeners
if (!emptyEntryMsg){
    
    // Adding an event listener to each component container to mark them for PUT request if clicked
    const allComponents = document.getElementsByClassName('compContainer');

    for (let i=0; i<allComponents.length; i++){

        const currentComponent = allComponents.item(i); // shoulda used a NodeList instead (forEach)

        currentComponent.addEventListener('click', event => {

            // hiding any visible delete buttons upon clicking the component
            document.querySelectorAll('.deleteBtn').forEach(e => {
                e.style.display = 'none';
            });

            // showing Delete button upon clicking the component
            currentComponent.querySelector('.deleteBtn').style.display = 'inline-block';

            // marking for future PUT request if it wasnt the delete button that was pushed
            if (!event.target.classList.contains('deleteBtn')){

                updatedComponentIDs.push(parseInt(currentComponent.id.slice(12)));
                console.log(`Update pushed ${currentComponent.id.slice(12)}`);
            }
        });
    }

    // Adding Delete btn event listeners for removing components and marking for DELETE requests if 
    // Delete is clicked
    const allDeleteBtns = document.getElementsByClassName('deleteBtn');

    for (let i=0; i<allDeleteBtns.length; i++){

        const currentDeleteBtn = allDeleteBtns.item(i);

        currentDeleteBtn.addEventListener('click', () => {

            // marking for future DELETE request and removing from PUT list if in it
            const deleteBtnContainer = currentDeleteBtn.parentNode.parentNode;
            const currentCompID = parseInt(deleteBtnContainer.id.slice(12));
            deletedComponentIDs.push(currentCompID); // component ID appendage
            
            // logging data type for DELETE request
            if (document.querySelector(`#imgContainer${currentCompID}`)){

                deletedComponentDataTypes.push('Image');
            }
            else{
    
                deletedComponentDataTypes.push('Text');
            }

            // clearing from updated IDs in case it was previously pushed
            updatedComponentIDs = updatedComponentIDs.filter(element => element != currentCompID);

            // removing from DOM
            console.log(`Delete pushed ${currentCompID}`);
            deleteBtnContainer.remove(); // removes container and its contents
            if (!componentContainer.hasChildNodes()){
                emptyEntryMsg = document.createElement('p');
                emptyEntryMsg.id = 'empty';
                emptyEntryMsg.innerText = "This entry is empty!";
                emptyEntryMsg.style = "text-align: center;"
                componentContainer.append(emptyEntryMsg);
            }
        });
    }
}


/*

    Handling the addition of new text components, new image components, and the SAVE button

*/
buttonContainer.addEventListener('click', event => {

    // Create, set up, and display text component
    if (event.target.id == "addText"){

        // create temporary ID for new text and add to newComponents array for
        // a future POST request
        const newTextTempID = -newComponentIDs.length;
        newComponentIDs.push(newTextTempID);

        // create HTML nodes with proper temp ID
        let newTextContainer = document.createElement('div');
        newTextContainer.id = `txtContainer${newTextTempID}`;
        newTextContainer.classList.add('compContainer', 'my-5', 'mx-auto');
        newTextContainer.style = "width: 50%;"

        newTextContainer.innerHTML = `<p id="txtName${newTextTempID}" class="txtName font-weight-bold" style="font-size: x-large; text-align: center" contenteditable="true" spellcheck="false">TEXTBOX NAME</p>
        <p id="txtData${newTextTempID}" class="txtData" contenteditable="true" spellcheck="false">TEXTBOX DATA</p>
        <div class="row justify-content-center">
            <button id="txtDelete${newTextTempID}" class="deleteBtn btn btn-danger">Delete</button>
        </div>`;

        // Hiding all currently visible delete buttons
        document.querySelectorAll('.deleteBtn').forEach(e => {
            e.style.display = 'none';
        });

        // Adding text component to DOM
        componentContainer.append(newTextContainer);

        // Hiding empty entry message if it's visible (for when this is the first component of the entry)
        if (emptyEntryMsg){
            emptyEntryMsg.style.display = "none";
        }

        // Listening for a click on this component as to make the delete button visible if invisible
        newTextContainer.addEventListener('click', () => {

            // Hiding all currently visible delete buttons
            document.querySelectorAll('.deleteBtn').forEach(e => {
                e.style.display = 'none';
            });

            // Showing this component's Delete button
            newTextContainer.lastChild.style.display = 'inline-block';
        })

        // Adding delete button event listener
        newTextContainer.querySelector('.deleteBtn').addEventListener('click', () => {

            // removing from DOM and POST list; no need to send a request
            newComponentIDs = newComponentIDs.filter(element => element != newTextTempID);
            newTextContainer.remove();
            if (!componentContainer.hasChildNodes()){
                emptyEntryMsg = document.createElement('p');
                emptyEntryMsg.id = 'empty';
                emptyEntryMsg.innerText = "This entry is empty!";
                componentContainer.append(emptyEntryMsg);
            }
        });

        // NOTE: new components do not need to be marked for possible PUT or DELETE requests!
    }

    // Create, set up, and display image component
    else if (event.target.id == "addImage"){

        // create temporary ID for new img that will be pushed to newComponentIDs once the img is uploaded
        const newImgTempID = -newComponentIDs.length;

        // create HTML nodes with proper temp ID
        let newImgContainer = document.createElement('div');
        newImgContainer.id = `imgContainer${newImgTempID}`;
        newImgContainer.classList.add('compContainer', 'my-5');

        // create name textbox, img upload button, and caption textbox
        newImgContainer.innerHTML = `<p id="imgName${newImgTempID}" class="imgName my-2 font-weight-bold" style="font-size: x-large; text-align: center;" contenteditable="true" spellcheck="false">NAME</p>
        <div class="row justify-content-center">
            <input type="file" id="imgUpload${newImgTempID}" class="imgData${newImgTempID} my-2" accept="image/jpeg, image/png">
        </div>
        <p id="imgCaption${newImgTempID}" class="imgCaption my-2" style="text-align: center;" contenteditable="true" spellcheck="false">CAPTION</p>
        <div class="row justify-content-center">
            <button id="imgDelete${newImgTempID}" class="deleteBtn btn btn-danger">Delete</button>
        </div>`

        // Adding image component to DOM
        componentContainer.append(newImgContainer);

        // adding state change listener to input tag to get and display uploaded image
        document.querySelector(`#imgUpload${newImgTempID}`).addEventListener('change', event => {

            const uploadedImgURL = URL.createObjectURL(event.target.files[0]); // create document path

            // creating img tag -> removing input tag -> appending img to imgName
            const newImgTag = document.createElement('img');
            newImgTag.src = uploadedImgURL;

            const windowHeight = window.outerHeight;
            newImgTag.height = Math.ceil(windowHeight / 2);
            newImgTag.id = `imgData${newImgTempID}`;
            newImgTag.classList.add('my-2');
            newImgTag.alt = "Failed to load image";

            // outer img div for centering
            let divRow = document.createElement('div');
            divRow.classList.add('row');
            divRow.classList.add('justify-content-center');

            divRow.appendChild(newImgTag);

            event.target.remove(); // removing Choose File button

            // inserting the image between the name and caption within the container
            const imgCaption = document.querySelector(`#imgCaption${newImgTempID}`);
            newImgContainer.insertBefore(divRow, imgCaption);

            // add to newComponents array for a future POST request
            newComponentIDs.push(newImgTempID);
        });

        // Listening for a click on this component as to make the delete button visible if invisible
        newImgContainer.addEventListener('click', () => {

            // Hiding all currently visible delete buttons
            document.querySelectorAll('.deleteBtn').forEach(e => {
                e.style.display = 'none';
            });

            // Showing this component's Delete button
            newImgContainer.lastChild.style.display = 'inline-block';
        });

        // Hiding empty entry message if it's visible
        if (emptyEntryMsg){
            emptyEntryMsg.style.display = "none";
        }

        // Adding delete button event listener
        newImgContainer.querySelector('.deleteBtn').addEventListener('click', () => {

            // removing from DOM and POST lists upon deletion; no need to send a request
            newComponentIDs = newComponentIDs.filter(element => element != newImgTempID);
            newImgContainer.remove();
            if (!componentContainer.hasChildNodes()){
                emptyEntryMsg = document.createElement('p');
                emptyEntryMsg.id = 'empty';
                emptyEntryMsg.innerText = "This entry is empty!";
                componentContainer.append(emptyEntryMsg);
            }
        });

        // NOTE: new components do not need to be marked for possible PUT or DELETE requests!
    }

    // saving contents with the SAVE button
    // add keyboard shortcut Alt + s    
    // send necessary PUT, POST, and DELETE requests
    else if (event.target.id == "saveBtn"){

        // hide save btn (fine since it'll refresh)
        document.querySelector('#saveBtn').style.display = 'none';

        // if emptyEntryMsg DNE or if it has been hidden upon adding new elements
        if (!emptyEntryMsg || emptyEntryMsg.style.display == "none"){

            // will be [1,1,1] when all 3 are done
            let finishedRequests = [0,0,0];

            /* 
                POST
                
                1. Check if any new components exist
                2. Get all new img base64s
                3. Send new shit to server
                4. Verify success
                5. PUT
            */
            if (newComponentIDs.length != 0){

                newComponentIDs = new Set(newComponentIDs); // deleting duplicates

                // Getting new img base64s
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                let newImageB64s = [];
                newComponentIDs.forEach(id => {
                    
                    // checking if this component is an image; if so, get b64
                    const imgTag = document.querySelector(`#imgData${id}`);
                    if (imgTag){

                        canvas.width = imgTag.width;
                        canvas.height = imgTag.height;
                        context.drawImage(imgTag, 0, 0, imgTag.width, imgTag.height);
                        newImageB64s.push(canvas.toDataURL('img/jpeg'));
                    }
                }); 

                saveNewComponents(newComponentIDs, newImageB64s, entryID).then(response => {

                    response.json().then(responseObj => {

                        console.log(`Save new complete: ${responseObj.status}`); 
                        finishedRequests[0] = 1; 
                        if (finishedRequests[1] && finishedRequests[2]){

                            // If the other two requests are done, refresh the page so I don't have to deal with 
                            // classifying and preprocessing components a second time
                            location.reload();
                        }                  
                    });
                }).catch(error => {

                    console.log(`Save new error: ${error}`);
                });
            }
            else{ // if no new components

                finishedRequests[0] = 1;
            }


            /*
                PUT
                1. Delete duplicates
                2. Send all touched components' data to server
                3. Verify success
                4. DELETE!
            */
            if (updatedComponentIDs.length != 0){

                updatedComponentIDs = new Set(updatedComponentIDs); // deleting duplicates

                saveUpdatedComponents(updatedComponentIDs).then(response => {

                    response.json().then(responseObj => {

                        console.log(`Save updates complete: ${responseObj.status}`);
                        finishedRequests[1] = 1;

                        if (finishedRequests[0] && finishedRequests[2]){

                            // If the other two requests are done, refresh the page so I don't have to deal with 
                            // classifying and preprocessing components a second time
                            location.reload();
                        }
                    });
                }).catch(error => {

                    console.log(`Save updates error: ${error}`);
                });
            }
            else{ // if no updated components
                finishedRequests[1] = 1;
            }

            /* 
                DELETE
                1. Send DELETE request
                2. Verify success of server
            */
            if (deletedComponentIDs.length != 0){

                deletedComponentIDs = new Set(deletedComponentIDs);
                saveDeletedComponents(deletedComponentIDs, deletedComponentDataTypes).then(response => {

                    response.json().then(responseObj => {

                        console.log(`Save deleted complete: ${responseObj.status}`);
                        finishedRequests[2] = 1;

                        if (finishedRequests[0] && finishedRequests[1]){

                            // If the other two requests are done, refresh the page so I don't have to deal with 
                            // classifying and preprocessing components a second time
                            location.reload();
                        }
                    });
                }).catch(error => {

                    console.log(`Save deleted error: ${error}`);
                });
            }
            else{ // if no deleted components
                finishedRequests[2] = 1;
            }

        }
        else {
            console.log("No new, updated, or deleted components when saved");
        }
    }
});


/*
    Saving contents that were edited if the page gets closed
    (probably not gonna implement this feature since we've moved onto a save button)
*/

window.onunload = () => {

    document.querySelector('#saveBtn').click();
};


/**
 * Adding 'Beautify' functionality which at present just hides delete btns
 */
document.querySelector('#beautify').addEventListener('click', () => {

    document.querySelectorAll('.deleteBtn').forEach(e => {
        e.style.display = 'none';
    });
});


/**
 * Setting up and handling the log off btn
 */
const logOffBtn = document.querySelector('#logBtn');
logOffBtn.innerText = "Log Off";
logOffBtn.addEventListener('click', () => {

    window.location.href = window.location.href;
})

