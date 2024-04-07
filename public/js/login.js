function returnToIndex() {
    window.location.href = "../html/index.html";
}

function storeUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

document.getElementById('loginform').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get form data
    const email = formData.get('email');
    const password = formData.get('password');

    // Check if the submit button clicked has the id "sign-up"
    if (event.submitter && event.submitter.id === 'sign-up') {
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Handle successful sign-up response
                storeUserData(data.user); // Cache data.user
                // alert(`Account created successfully! Welcome, ${data.user.email}`);
                window.location.href = '../html/profile.html'; // Redirect to profile page
            } else {
                const errorMessage = await response.text(); // Get the error message from the response
                console.error('Sign-up failed:', errorMessage); // Log the error message
                alert("Sign-up failed. Please try again later.");
            }
        } catch (error) {
            console.error('Sign-up error:', error); // Handle sign-up error
            alert("An unexpected error occurred. Please try again later.");
        }
    } else if (event.submitter && event.submitter.id === 'log-in') {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Handle successful login response
                storeUserData(data.user); // Cache data.user
                console.log(`Response Received: ${response}`);
                // alert(`Login successful! Welcome: ${data.user.uid}`);
                window.location.href = '../html/profile.html'; // Redirect to profile page
            } else {
                const errorMessage = await response.text(); // Get the error message from the response
                console.error('Login failed:', errorMessage); // Log the error message
                alert("Unknown email and/or password. Please try again or create an account.");
            }
        } catch (error) {
            console.error('Login error:', error); // Handle login error
            alert("An unexpected error occurred. Please try again later.");
        }
    }
});