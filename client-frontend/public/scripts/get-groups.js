function getGroups(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/api/groups',
        contentType: 'application/json',
        success: function (response) {
            // Handle success response
            alert('Groups!');
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error('Error retrieveing groups:', error);
            alert('Error retrieveing groups. Please try again');
        }
    });
}