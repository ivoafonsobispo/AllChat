// Groups and PMs
async function displayUserChats() {
    var chatsList = document.getElementById("chats-list");
    var chatsListHTML = '';

    var currentUser = getUserInfo(); 

    if (currentUser == null){
        chatsList.innerHTML = 'Not loggend in.';
        return;
    }

    // var groups = await getUserGroups(currentUser.id);
    var groups = await getGroups();

    if (groups == null){
        chatsList.innerHTML = 'Something went wrong';
        return;
    }

    if (groups.length == 0){
        chatsList.innerHTML = 'No chats yet!';
        return;
    }

    // TODO - filtrar se nUserNames == 2 (current user + 1) - PM
    groups.forEach(group => {
        console.log(group)

        chatsListHTML += '<div class="btn chat-list-item" >' + group["name"] + '</div>';
    });
    chatsList.innerHTML = chatsListHTML;
}

// Call the displayUserChats function
displayUserChats();
