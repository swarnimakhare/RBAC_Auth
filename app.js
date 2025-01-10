// Show the login form
function showLogin() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('forgot-password-container').style.display = 'none';
}

// Show the signup form
function showSignup() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
    document.getElementById('forgot-password-container').style.display = 'none';
}

// Show the forgot password form
function showForgotPassword() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('forgot-password-container').style.display = 'block';
}

// Toggle password visibility
function togglePassword(id) {
    const passwordField = document.getElementById(id);
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
}

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;

    const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();
    document.getElementById('signup-message').innerText = data.message || 'Something went wrong.';
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById('login-message').innerText = data.message || 'Something went wrong.';

    if (data.token) {
        // Store the token (can be used for subsequent requests)
        localStorage.setItem('token', data.token);
    }
});

// Handle forgot password form submission
document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('forgot-password-email').value;

    const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    document.getElementById('forgot-password-message').innerText = data.message || 'Something went wrong.';
});
