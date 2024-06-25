// Modal Create Group
// ----- Current selected users
var selectedUsers = [];
// ----- Get the modal component
var createGroupModal = document.getElementById("createGroupModal");
var createGroupModalComponentWithUsers = document.getElementById("create-group-modal-with-users");
var createGroupModalComponentWithoutUsers = document.getElementById("create-group-modal-without-users");
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

function selectedUsersContains(name){
    for (var j=0; j<selectedUsers.length; j++) {
        if (selectedUsers[j]["name"].match(name)) return true;
    }
    return false;
}

// ----- When the user clicks on the button, open the modal
async function getUsersForSelect() {
    var users = await getUsers();
    var userData = getUserInfo();

    users = users.filter(user => user["name"] !== userData.name);
    
    if (users.length == 0) {
        return 0;
    } else {
        return users;
    }
}

async function displayUsersCreateGroupModal(users) {
    var usersListHTML = '';

    users.forEach(user => {
        usersListHTML += '<option value="' + user["name"] + '">' + user["name"] + '</option>';
    });
    createGroupSelect.innerHTML = usersListHTML;
}



createGroupButton.onclick = async function() {
    var otherUsers = await getUsersForSelect(); 
    if (otherUsers == 0){
        createGroupModalComponentWithoutUsers.style.display = "flex";
        createGroupModalComponentWithUsers.style.display = "none";
    } else {
        createGroupModalComponentWithoutUsers.style.display = "none";
        createGroupModalComponentWithUsers.style.display = "inline-block";
        displayUsersCreateGroupModal(otherUsers);
    }
    createGroupModal.style.display = "block";
}

function closeCreateGroupModal(){
    selectedUsers = [];
    createGroupModal.style.display = "none";
    createGroupSelectedUsersText.innerText = "";
}

// ----- When the user clicks on <span> (x), close the modal
createGroupClose.onclick = function() {
    closeCreateGroupModal();
}

// ----- When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == createGroupModal) {
        closeCreateGroupModal();
    }
}

// ----- When the user clicks in the modal '+' button
createGroupAddUser.onclick = function() {
    if (selectedUsersContains(createGroupSelect.options[createGroupSelect.selectedIndex].text)) return;
    selectedUsers.push({"name": createGroupSelect.options[createGroupSelect.selectedIndex].text});
    createGroupSelectedUsersText.innerText = selectedUsers.map(user => user["name"]).sort().join(", ");
}

// ----- When the user clicks in the modal "clear" button
createGroupClear.onclick = function() {
    selectedUsers = [];
    createGroupSelectedUsersText.innerText = "";
}

// ----- When the user clicks in the modal "create group" button
createGroupCreateGroup.onclick = function() {
    if (selectedUsers.length === 0){
        createGroupErrorMessage.innerHTML = "You must select at least 1 user"
        createGroupErrorMessage.style.display = "flex";
        return;
    }

    JSON.parse(localStorage.getItem("userPMs")).forEach(pm => {
        hasPM = true;
        pm["users"].forEach(user => {
            if (!selectedUsers.includes(user.name)){
                hasPM = false;
            }
        });

        if (hasPM){
            createGroupErrorMessage.innerHTML = "PM already exists"
            createGroupErrorMessage.style.display = "flex";
            return;
        }
    });

    createGroupErrorMessage.style.display = "none";
    
    // Add currentUser
    var userData = getUserInfo();
    selectedUsers.push({"name": userData.name});

    createGroupPost(selectedUsers);
    displayUserChats();

    closeCreateGroupModal();
}