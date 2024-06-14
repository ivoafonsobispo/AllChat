// Modal Create Group
// ----- Current selected users
var selectedUsers = [];
// ----- Get the modal component
var createGroupModal = document.getElementById("createGroupModal");
// ----- Get the button that opens the modal
var createGroupButton = document.getElementById("create_group");
// ----- Get the <span> element that closes the modal
var createGroupClose = document.getElementById("create_group_modal_close");
// ----- Get the modal '+' button
var createGroupAddUser = document.getElementById("create_group_modal_select_add");
// ----- Get the modal span component with the names of the current selected users
var createGroupSelectedUsersText = document.getElementById("create_group_modal_selected_users");
// ----- Get the modal select component with all the users
var createGroupSelect = document.getElementById("create_group_modal_users_select");
// ----- Get the modal "clear" button
var createGroupClear = document.getElementById("create_group_modal_clear");
// ----- Get the modal "create group" button
var createGroupCreateGroup = document.getElementById("create_group_modal_create_group");
// ----- Get the modal error message element
var createGroupErrorMessage = document.getElementById("create_group_modal_error_message");

function selectedUsersContains(username){
    for (var j=0; j<selectedUsers.length; j++) {
        if (selectedUsers[j].match(username)) return true;
    }
    return false;
}

// ----- When the user clicks on the button, open the modal
async function getUsers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving users:', error);
                resolve(null);
            }
        });
    });
}

async function displayUsers() {
    var usersListHTML = '';
    var users = await getUsers();

    if (users != null) {
        if (users.length == 0) {
            createGroupSelect.innerHTML = '<option value="nousers">No more users yet 😢</option>';
        } else {
            users.forEach(user => {
                usersListHTML += '<option value="' + user["username"] + '">' + user["name"] + '</option>';
            });
            createGroupSelect.innerHTML = usersListHTML;
        }
    }
}

createGroupButton.onclick = function() {
    displayUsers();
    createGroupModal.style.display = "block";
}

// ----- When the user clicks on <span> (x), close the modal
createGroupClose.onclick = function() {
    selectedUsers = [];
    createGroupModal.style.display = "none";
    createGroupSelectedUsersText.innerText = "";
}

// ----- When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == createGroupModal) {
        selectedUsers = [];
        createGroupModal.style.display = "none";
        createGroupSelectedUsersText.innerText = "";
    }
}

// ----- When the user clicks in the modal '+' button
createGroupAddUser.onclick = function() {
    if (selectedUsersContains(createGroupSelect.options[createGroupSelect.selectedIndex].text)) return;
    selectedUsers.push(createGroupSelect.options[createGroupSelect.selectedIndex].text);
    createGroupSelectedUsersText.innerText = selectedUsers.join(", ");
}

// ----- When the user clicks in the modal "clear" button
createGroupClear.onclick = function() {
    selectedUsers = [];
    createGroupSelectedUsersText.innerText = "";
}

// ----- When the user clicks in the modal "create group" button
createGroupCreateGroup.onclick = function() {
    if (selectedUsers.length === 0){
        createGroupErrorMessage.style.display = "flex";
        return;
    }

    createGroupErrorMessage.style.display = "none";

    // Todo - chamar função de create group
}