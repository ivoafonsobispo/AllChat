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
    var pms = []

    if (groups == null){
        chatsList.innerHTML = 'Something went wrong';
        return;
    }

    if (groups.length == 0){
        chatsList.innerHTML = 'No chats yet!';
        
        localStorage.setItem("userPMs", JSON.stringify(pms));
        return;
    }

    // TODO - filtrar se nUserNames == 2 (current user + 1) - PM
    groups.forEach(group => {
        const users = group["name"].split(',');
        if(users.length == 2){
            // PM
            pms.push({"id": group["id"], "name": group["name"], "users": group["users"]})
            chatsListHTML += '<a class="btn chat-list-item" href="http://localhost:3000/pm/' + group["id"] +'"> PM - ' + group["name"] + '</a>';
        } else {
            // Group
            chatsListHTML += '<a class="btn chat-list-item" href="http://localhost:3000/group/' + group["id"] +'"> Group - ' + group["name"] + '</a>';
        }
    });
    chatsList.innerHTML = chatsListHTML;

    localStorage.setItem("userPMs", JSON.stringify(pms));

}

// Call the displayUserChats function
displayUserChats();
