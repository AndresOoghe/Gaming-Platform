const togglePassword = () => {
    const passwordToggle = document.getElementsByClassName('password-toggle')[0];
    const passwordInput = document.querySelector('[name=password]');

    if (passwordInput.getAttribute('type') === 'password') {
        passwordInput.setAttribute('type', 'text');
    } else {
        passwordInput.setAttribute('type', 'password');
    }
    passwordToggle.classList.toggle('fa-eye');
    passwordToggle.classList.toggle('fa-eye-slash');
}