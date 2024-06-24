async function getGroupMessages(group_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `http://localhost:8002/chat/${group_id}`,
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving user groups:', error);
                resolve(null);
            }
        });
    });
}


async function sendMessageToGroup(group_id, message){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: `http://localhost:8002/chat`,
            contentType: 'application/json',
            data: JSON.stringify({ groupId: group_id, message: {"username": message.username, "content": message.content} }),
            error: function (xhr, status, error) {
                console.error('Error sending message:', error);
            }
        });
    });
}