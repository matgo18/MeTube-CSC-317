document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const errorDiv = document.getElementById('error-messages');

    const usernameInput = form.elements['username'];
    const passwordInput = form.elements['password'];
    const confirmPasswordInput = form.elements['confirm_password'];

    const showErrors = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let errors = [];

        if (!/^[a-zA-Z][a-zA-Z0-9]{2,}$/.test(username)) {
            errors.push("Username must start with a letter and be at least 3 alphanumeric characters.");
        }

        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[\/\*\-\+\!@#\$^\&~\[\]]/.test(password);

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters.");
        }
        if (!hasUpper) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!hasNumber) {
            errors.push("Password must contain at least one number.");
        }
        if (!hasSpecial) {
            errors.push("Password must contain at least one special character (/ * - + ! @ # $ ^ & ~ [ ]).");
        }

        if (password !== confirmPassword) {
            errors.push("Passwords do not match.");
        }

        errorDiv.innerHTML = errors.map(e => `<p>${e}</p>`).join('');
    };

    // Live validation
    usernameInput.addEventListener('input', showErrors);
    passwordInput.addEventListener('input', showErrors);
    confirmPasswordInput.addEventListener('input', showErrors);

    form.addEventListener('submit', function (event) {
        if (errorDiv.innerHTML !== '') {
            event.preventDefault();
        }
        showErrors();
    });
});

