'use strict'
import {deleteVaultEntry, createVaultEntry} from './functions'

const createEntryBtn = document.querySelector('#createEntry');
const entryList = document.querySelector('#entryList');
const greeting = document.querySelector('#greeting').innerText;
const username = greeting.slice(14, -1);
const errorMsg = document.querySelector("#errorMsg");
const logOutBtn = document.querySelector('#logBtn');

// Setting up the log out btn (lazy af i know)
logOutBtn.innerText = 'Log Out';
logOutBtn.classList.remove('btn-success');
logOutBtn.classList.add('btn-danger');
logOutBtn.addEventListener('click', () => {
    window.location.href = "http://127.0.0.1:8000/userAuth/logout";
})

createEntryBtn.addEventListener('click', () => {

    createVaultEntry(username).then(response => {
        response.json().then(response => {
            window.location.href = window.location.href + response.id;
        })
    }).catch(error => {
        console.log(error);
        errorMsg.innerText = "Server error; try again.";
    });
});

entryList.addEventListener('click', event => {
    
    let target = event.target;
    if (target.tagName == "BUTTON"){
        if (target.id[0] == "o"){
            window.location.href = window.location.href + target.id.slice(1);
        }
        else{
            deleteVaultEntry(username, parseInt(target.id.slice(1)));
            let liElement = document.getElementById(`li${target.id.slice(1)}`);
            liElement.remove();

            if (entryList.getElementsByTagName('li').length == 0){
                const emptyMsg = document.createElement("li");
                emptyMsg.innerText = "No entries available";
                entryList.appendChild(emptyMsg);
            }
        }
    }
});