// Groups and PMs
var configData;
(async () => {
    try {
        fetch('/config')
    .then(response => response.json())
    .then(config => {
        console.log(config)
        configData = config

    })
    .catch(error => console.error('Error fetching config:', error));



async function displayUserChats() {
    var chatsList = document.getElementById("chats-list");
    var chatsListHTML = '';

    var currentUser = getUserInfo(); 

    if (currentUser == null){
        chatsList.innerHTML = 'Not loggend in.';
        return;
    }

    var groups = await getUserGroups(currentUser.id);

    if (groups == null || groups.length == 0){
        chatsList.innerHTML = 'No chats yet!';
        return;
    }

    groups.forEach(group => {
        if(group["is_pm_group"]){
            // PM
            chatsListHTML += '<a class="btn chat-list-item" href="' + configData.frontendURL + 'pm/' + group["id"] +'"> PM - ' + group["name"] + '</a>';
        } else {
            // Group
            chatsListHTML += '<a class="btn chat-list-item" href="'+ configData.frontendURL + 'group/' + group["id"] +'"> Group - ' + group["name"] + '</a>';
        }
    });
    chatsList.innerHTML = chatsListHTML;

}

// Call the displayUserChats function
displayUserChats();

} catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error during fetchConfigData execution:', error);
}
})();
