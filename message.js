document.getElementById('openFormButton').addEventListener('click', function() {
    const form = document.getElementById('messageForm');
    sendImageForm.style.display = "none";
    document.getElementById('statusMessage').innerHTML = ''; // Clear message
    form.style.display = 'block';  // Show the form
});

// Function to close the form when "Close" button is clicked
document.getElementById('closeFormButton').addEventListener('click', function() {
    const form = document.getElementById('messageForm');
    form.style.display = 'none';  // Hide the form
});



















// Function to send a message using an API and check if the status is true
function sendMessage() {
    const apiUrl = 'http://3.109.48.70:21465/api/thechitrakars/send-message'; 
    const token = '$2b$10$RPdm4fAPEByh_d5Rfc_druVKZZ7CgVUzyJZffd.iZfsbLQnWKuNye'; 

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;   

    const requestBody = {
        phone: phone,  // Receiver's phone number
        message: message 
    };

     // Check if both fields are filled out
            if (!phone || !message) {
                alert('Please fill in both phone number and message!');
                return;
            }

    fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(requestBody) })
        .then(response => response.json())
        .then(data => {
            const statusMessageElement = document.getElementById('statusMessage');
            if (data.status === 'success') {
                statusMessageElement.textContent = 'Message delivered successfully!';
            } else {
                statusMessageElement.textContent = 'Message not delivered. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            const statusMessageElement = document.getElementById('statusMessage');
            statusMessageElement.textContent = 'Error sending message. Please try again.';
        });
}

document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
