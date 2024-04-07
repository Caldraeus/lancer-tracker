// Get cached user data.
const cachedUserData = localStorage.getItem('userData');

// A function to redirect the user to the character builder page
function returnToIndex() {
    window.location.href = "/html/index.html";
}

// A function to show a modal.
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

// A function to hide a modal.
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Bounce logged out users.
fetch('/profile', { credentials: 'same-origin' })
    .then(response => {
        if (!response.ok) {
            throw new Error('User not authenticated');
        }
        return response.text();
    })
    .then(profileHtml => {
        // Replace the content of the body with the profile HTML
        document.body.innerHTML = profileHtml;

        // Function to display the user's email in the email box.
        const emailText = document.getElementById('current-email');
        if (cachedUserData) {
            // If user data is cached, parse it and update the profile button accordingly
            const userData = JSON.parse(cachedUserData);
            emailText.textContent = userData.email;
        } else {
            // If user data is not cached, fetch it from the server
            fetch('/profile/info')
                .then(response => response.json())
                .then(data => {
                    console.log('Data received:', data);
                    // Update the profile button with the received user data
                    emailText.textContent = userData.email;
                    // Store the user data in local storage for future access
                    localStorage.setItem('userData', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                });
        }

        // Function to log user out.
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                });

                if (response.ok) {
                    console.log("Remove");
                    // Clear any user-related data stored in the client-side
                    localStorage.removeItem('userData'); // Clear user data from local storage

                    // Redirect the user to the login page or any other desired page
                    window.location.replace('/html/login.html'); // Redirect to login page
                } else {
                    // Handle logout error
                    console.error('Logout failed:', response.statusText);
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Error logging out:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        });
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
        // Redirect to login page or handle unauthorized access
        window.location.replace('/html/login.html');
    });

// Function to change password
async function changePassword(currentPassword, newPassword, confirmPassword) {
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        console.error('New password and confirm password do not match');
        alert('New passwords do not match. Please try again.');
        return;
    }

    try {
        const response = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Log success message
            alert('Password successfully changed!');
        } else {
            alert('Password change failed. Please make sure you\'re entering the correct current password.');
            throw new Error('Failed to change password');
        }
    } catch (error) {
        alert('Password change failed.');
        console.error('Error changing password:', error.message);
    }
}

// Function to handle change password form submission
function handleChangePasswordFormSubmit(event) {
    const currentPassword = document.getElementById('modal-current-password').value;
    const newPassword = document.getElementById('modal-new-password').value;
    const confirmPassword = document.getElementById('modal-confirm-password').value;
    changePassword(currentPassword, newPassword, confirmPassword);
}

// Function to handle change email form submission
function handleChangeEmailFormSubmit() {
    const newEmail = document.getElementById('modal-new-email').value;
    const password = document.getElementById('modal-current-password-email').value; // Assuming the password field is named 'modal-current-password'
    changeEmail(newEmail, password);
}
  
// Function to change email
async function changeEmail(newEmail, password) {
    try {
        const response = await fetch('/change-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newEmail, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Log success message
            
            // Update local storage with the new email
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.email = newEmail;
            localStorage.setItem('userData', JSON.stringify(userData));

            alert("Email successfully changed.");
            hideModal('change-email-modal'); // Hide the modal after successful email change
            document.getElementById('current-email').textContent = newEmail; // Update displayed email in the DOM
        } else {
            throw new Error('Failed to change email');
        }
    } catch (error) {
        console.error('Error changing email:', error.message);
    }
}