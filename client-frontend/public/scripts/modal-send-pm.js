// Modal Create Group
// ----- Current selected users
var selectedUser = "";
// ----- Get the modal component
var sendPMModal = document.getElementById("sendPMModal");
// ----- Get the button that opens the modal
var sendPMButton = document.getElementById("send_pm");
// ----- Get the <span> element that closes the modal
var sendPMClose = document.getElementById("send_pm_modal_close");
// ----- Get the modal '+' button
var sendPMAddUser = document.getElementById("send_pm_modal_select_add");
// ----- Get the modal span component with the names of the current selected users
var sendPMSelectedUserText = document.getElementById("send_pm_modal_selected_user");
// ----- Get the modal select component with all the users
var sendPMSelect = document.getElementById("send_pm_modal_users_select");
// ----- Get the modal "clear" button
var sendPMClear = document.getElementById("send_pm_modal_clear");
// ----- Get the modal "create group" button
var sendPMSendPM = document.getElementById("send_pm_modal_send_pm");
// ----- Get the modal error message element
var sendPMErrorMessage = document.getElementById("send_pm_modal_error_message");


// ----- When the user clicks on the button, open the modal
sendPMButton.onclick = function() {
    sendPMModal.style.display = "block";
}

// ----- When the user clicks on <span> (x), close the modal
sendPMClose.onclick = function() {
    selectedUser = "";
    sendPMModal.style.display = "none";
    sendPMSelectedUserText.innerText = "";
}

// ----- When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == sendPMModal) {
        selectedUser = "";
        sendPMModal.style.display = "none";
        sendPMSelectedUserText.innerText = "";
    }
}

// ----- When the user clicks in the modal '+' button
sendPMAddUser.onclick = function() {
    if (selectedUsersContains(sendPMSelect.options[sendPMSelect.selectedIndex].text)) return;
    selectedUser = sendPMSelect.options[sendPMSelect.selectedIndex].text;
    sendPMSelectedUserText.innerText = selectedUser;
}

// ----- When the user clicks in the modal "clear" button
sendPMClear.onclick = function() {
    selectedUser = "";
    sendPMSelectedUserText.innerText = "";
}

// ----- When the user clicks in the modal "send pm" button
sendPMSendPM.onclick = function() {
    if (selectedUser === ""){
        sendPMErrorMessage.style.display = "flex";
        return;
    }

    sendPMErrorMessage.style.display = "none";
    window.location.replace("http://localhost:3000/pm/1");
    // Todo - chamar função de create group
}