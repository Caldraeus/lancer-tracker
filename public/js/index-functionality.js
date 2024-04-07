//index-functionality.js

// Get cached user data.
const cachedUserData = localStorage.getItem('userData');

// A function to redirect the user to the encounter runner page
function goToEncounter() {
    window.location.href = "encounter-runner.html";
}
  
// A function to redirect the user to the character builder page
function goToCharacter() {
    window.location.href = "character-builder.html";
}

function goToLoginOrProfile() {
    // Check if there's an active session for the user
    fetch('/session/status')
        .then(response => {
            if (response.ok) {
                // If the session status is okay, the user is logged in, so redirect to the profile page
                window.location.href = '/redirect/profile';
            } else {
                // If there's no active session, redirect to the login page
                window.location.href = '/redirect/login';
            }
        })
        .catch(error => {
            console.error('Error checking session status:', error);
            // In case of an error, also redirect to the login page for safety
            window.location.href = '/redirect/login';
        });
}

function toggleDarkMode() {
    var element = document.getElementsByClassName("menu-button");
    element.classList.toggle("dark-mode-button");
    document.body.classList.toggle("dark-mode");
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    
    // Check if user data is cached in local storage
    if (cachedUserData) {
        // If user data is cached, parse it and update the profile button accordingly
        const userData = JSON.parse(cachedUserData);
        
        fetch('/session/status')
            .then(response => {
                if (!response.ok) {
                    // If there's no active session, clear the cached user data
                    localStorage.removeItem('userData');
                    throw new Error('Session not authorized');
                }
            })
            .then(() => {
                // If there's an active session, update the profile button
                updateProfileButton(userData);
            })
            .catch(error => {
                console.error('Error checking session status:', error);
            });

    } else {
        // If user data is not cached, fetch it from the server, and handle a dead session.
        fetch('/profile/info')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Dead user session: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                // Update the profile button with the received user data
                updateProfileButton(data);
                // Store the user data in local storage for future access
                localStorage.setItem('userData', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }    
});

// Function to update the profile button based on user data
function updateProfileButton(data) {
    const profileButton = document.getElementById('profile-button');
    const span = profileButton.querySelector('span'); // Get the span element inside the button

    if (data.email && data.uid) {
        // If email and uid are present in data, user is logged in
        console.log('User is logged in');
        span.innerText = 'PROFILE';
        span.dataset.value = 'PROFILE';
    } else {
        // If email and uid are not present, user is not logged in
        console.log('User is not logged in');
        // Clear the cached user data
        localStorage.removeItem('userData');
        span.innerText = 'LOGIN';
        span.dataset.value = 'LOGIN'; 
    }
}

document.querySelectorAll("button span").forEach(el => {
    el.parentNode.onmouseenter = event => {
        let iterations = 0;
        const interval = setInterval(() => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%&$#";
            el.innerText = el.innerText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return el.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 40)]
                })
                .join("");

            if (iterations >= el.dataset.value.length) clearInterval(interval);

            iterations += 1 / 4;

        }, 30)
    }
});