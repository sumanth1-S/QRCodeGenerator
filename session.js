let sessionCheckInterval; // Global variable to store session check interval
let countdownInterval;


// Function to handle generating the QR Code
function generateQRCode() {
    const apiUrl = 'http://3.109.48.70:21465/api/thechitrakars/start-session';
    const token = '$2b$10$RPdm4fAPEByh_d5Rfc_druVKZZ7CgVUzyJZffd.iZfsbLQnWKuNye';

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({});

    fetch(apiUrl, { method: 'POST', headers: headers, body: body })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'QRCODE') {
                const qrImage = document.createElement('img');
                qrImage.src = data.qrcode;
                qrImage.alt = 'QR Code';

                const qrCodeContainer = document.getElementById('qrCodeContainer');
                qrCodeContainer.innerHTML = '';
                document.getElementById('statusMessage').innerHTML = '';
                qrCodeContainer.appendChild(qrImage);

               

                setTimeout(() => {
                    qrCodeContainer.innerHTML = '';
                    //countdownElement.textContent = `Time is up!`;
                }, 50000);
                startCountdown();
            } else if (data.status === 'CLOSED' || data.status === 'INITIALIZING') {
               
                setTimeout(()=>{
                    console.log('Session is closed. Trying again...');
                    generateQRCode();
                }, 1000);
            } else {
                alert('QR code not ready. Current status: ' + data.status);
            }
        })
        // .catch(error => {
        //     console.error('Error fetching QR code:', error);
        //     alert('Failed to fetch the QR code.');
        // });
}

// Function to handle logout the session
function closeSession() {
    const closeApiUrl = 'http://3.109.48.70:21465/api/thechitrakars/logout-session';
    const token = '$2b$10$RPdm4fAPEByh_d5Rfc_druVKZZ7CgVUzyJZffd.iZfsbLQnWKuNye';

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    fetch(closeApiUrl, { method: 'POST', headers: headers })
        .then(response => response.json())
        .then(data => {
            const statusMessageElement = document.getElementById('statusMessage');
            if (data.status === true) {
                document.getElementById('statusMessage').innerHTML = '';
                statusMessageElement.textContent = 'Logout Successful!';

                setTimeout(() => {
                    statusMessageElement.textContent = 'Logout Successful!'; // Stop checking session after countdown ends
                }, 5000); // 50 seconds (matching the timeout for QR code clearing)

                // Hide the Logout and Send Message buttons again
                document.getElementById('closeSessionButton').style.display = 'none';
                document.getElementById('sendMessageButton').style.display = 'none';
                document.getElementById('sendImageForm').style.display = 'none';
                document.getElementById('openFormButton').style.display='none';
                document.getElementById('ImageFormButton').style.display='none';
             


                // Show the Generate QR Code button again
                document.getElementById('generateButton').style.display = 'inline-block';
                
                // Clear QR Code and Countdown
                document.getElementById('qrCodeContainer').innerHTML = '';
                document.getElementById('countdown').innerHTML = '';
            } else {
                alert('Failed to logout session.');
            }
        })
        .catch(error => {
            console.error('Error closing session:', error);
            alert('Failed to logout the session.');
        });
}

// Event listeners
document.getElementById('generateButton').addEventListener('click', generateQRCode);
document.getElementById('closeSessionButton').addEventListener('click', closeSession);



function startCountdown() {
    let timeLeft = 50; // Countdown starts from 50 seconds
    const countdownElement = document.getElementById('countdown'); // Get the countdown display element

    // Display the initial countdown time
    countdownElement.textContent = `Time remaining: ${timeLeft} seconds`;

    // Start the countdown
    countdownInterval = setInterval(() => {
        timeLeft--;  // Decrease the time by 1 every second
        countdownElement.textContent = `Time remaining: ${timeLeft} seconds`;

        //When the countdown reaches 0, clear the interval and reset the countdown
        if (timeLeft <= 0) {

            clearInterval(countdownInterval);  // Stop the countdown
             countdownElement.textContent = 'Time is up!';
            // Optionally, clear the QR code here if needed
            document.getElementById('qrCodeContainer').innerHTML = ''; // Clear the QR code container
        }

    }, 1000); // Update the countdown every 1000 milliseconds (1 second)

    sessionCheckInterval = setInterval(() => {
        checkSessionStatus(); // Check session status every 10 seconds
    }, 10000); // 10000 milliseconds = 10 seconds

    // Clear the session check interval if the countdown ends
    setTimeout(() => {
        clearInterval(sessionCheckInterval); // Stop checking session after countdown ends
    }, 50000); // 50 seconds (matching the timeout for QR code clearing)
}


// Function to check the session status after the countdown ends
function checkSessionStatus() {
    const statusApiUrl = 'http://3.109.48.70:21465/api/thechitrakars/status-session'; // Replace with your actual API URL
    const token = '$2b$10$RPdm4fAPEByh_d5Rfc_druVKZZ7CgVUzyJZffd.iZfsbLQnWKuNye'; // Replace with your actual Bearer token

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Fetch the status of the session
    fetch(statusApiUrl, { method: 'GET', headers: headers })
        .then(response => response.json())
        .then(data => {
            const statusMessageElement = document.getElementById('statusMessage');

            if (data.status === 'CONNECTED') {
                // Session is connected, clear the QR code and show success message
                document.getElementById('qrCodeContainer').innerHTML = ''; // Clear the QR code
                document.getElementById('countdown').innerHTML = ''; // Clear countdown
                statusMessageElement.textContent = 'Login Successful!';

                   // Show the Logout and Send Message buttons
                   document.getElementById('closeSessionButton').style.display = 'inline-block';
                   document.getElementById('sendMessageButton').style.display = 'inline-block';
                   document.getElementById('sendImageButton').style.display = 'inline-block';
                   document.getElementById('openFormButton').style.display='inline-block';
                   document.getElementById('ImageFormButton').style.display='inline-block';
                

   
                   // Hide the Generate QR Code button
                   document.getElementById('generateButton').style.display = 'none';


                clearInterval(sessionCheckInterval);
                clearInterval(countdownInterval)
            } else {
                console.log('Session is not connected yet.');
            }
        })
        .catch(error => {
            console.error('Error checking session status:', error);
            const statusMessageElement = document.getElementById('statusMessage');
            statusMessageElement.textContent = 'Error checking session status.';
        });
}

window.onload = checkSessionStatus();// when the page is reloded

