// Open the image form when "Open Form" button is clicked
document.getElementById('ImageFormButton').addEventListener('click', function() {
    const form = document.getElementById('sendImageForm');
    messageForm.style.display = "none";
    document.getElementById('statusMessage').innerHTML = ''; // Clear message
    form.style.display = 'block';  // Show the form
});

// Close the image form when "Close" button is clicked
document.getElementById('closeImageFormButton').addEventListener('click', function() {
    const form = document.getElementById('sendImageForm');
    form.style.display = 'none';  // Hide the form
});


// Function to send an image using an API
function sendImage() {
    const apiUrl = 'http://3.109.48.70:21465/api/thechitrakars/send-image'; // API endpoint for sending an image
    const token = '$2b$10$RPdm4fAPEByh_d5Rfc_druVKZZ7CgVUzyJZffd.iZfsbLQnWKuNye'; // Bearer token

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };


            const phone = document.getElementById('imagePhone').value;
            const caption = document.getElementById('caption').value;
            const imageUrl = document.getElementById('imageUrl').value;

         // Check if all fields are filled
         if (!phone || !caption || !imageUrl) {
            alert('Please fill in all the fields!');
            return;
        }


    // Example image object

    const body = JSON.stringify({
        phone: phone,
        caption: caption,
        path: imageUrl,  // The image URL entered by the user
        isGroup: false  // Assuming it's a one-on-one message
    });
    // Send the image using the POST method
    fetch(apiUrl, { method: 'POST', headers: headers, body: body })
        .then(response => response.json())
        .then(data => {
            const statusMessageElement = document.getElementById('statusMessage');

            if (data.status === 'success') {
                statusMessageElement.textContent = 'Image sent successfully!';
                statusMessageElement.style.color = 'green';
            } else {
                statusMessageElement.textContent = 'Failed to send image. Please try again.';
                statusMessageElement.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error sending image:', error);
            const statusMessageElement = document.getElementById('statusMessage');
            statusMessageElement.textContent = 'Error sending image. Please try again.';
        });
}

// Add event listener for the "Send Image" button
document.getElementById('sendImageButton').addEventListener('click', sendImage);
