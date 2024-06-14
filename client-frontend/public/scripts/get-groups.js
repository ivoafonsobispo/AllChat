async function getGroups() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving groups:', error);
                resolve(null);
            }
        });
    });
}

async function displayGroups() {
    var chatsList = document.getElementById("chats-list");
    var chatsListHTML = '';
    var groups = await getGroups();

    if (groups != null) {
        if (groups.length == 0) {
            chatsList.innerHTML = 'No chats yet!';
        } else {
            groups.forEach(group => {
                chatsListHTML += '<div class="btn chat-list-item" >' + group["name"] + '</div>';
            });
            chatsList.innerHTML = chatsListHTML;
        }
    }
}

// Call the displayGroups function
displayGroups();
