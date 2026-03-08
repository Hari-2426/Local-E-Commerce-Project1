// Signup page logic
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Basic Validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            try {
                // Loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating account...';

                // Real API call
                await apiFetch('/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({ name: fullname, email, password })
                });

                showNotification('Account created successfully!', 'success');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } catch (error) {
                showNotification('Signup failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
