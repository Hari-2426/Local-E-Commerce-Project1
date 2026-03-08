// Profile page logic
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const profileDisplayName = document.getElementById('profile-display-name');

    // Load initial data from API
    async function loadProfile() {
        try {
            const user = await apiFetch('/profile');
            document.getElementById('profile-name').value = user.name;
            document.getElementById('profile-email').value = user.email;
            document.getElementById('profile-location').value = user.location || '';
            document.getElementById('profile-bio').value = user.bio || '';
            profileDisplayName.textContent = user.name;
        } catch (error) {
            showNotification('Error loading profile', 'error');
        }
    }

    if (isAuthenticated()) {
        loadProfile();
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('profile-name').value;
            const location = document.getElementById('profile-location').value;
            const bio = document.getElementById('profile-bio').value;

            const saveBtn = document.getElementById('save-profile-btn');
            const originalText = saveBtn.textContent;

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';

                // Real API PUT /profile
                await apiFetch('/profile', {
                    method: 'PUT',
                    body: JSON.stringify({ name, location, bio })
                });

                profileDisplayName.textContent = name;
                showNotification('Profile updated successfully!', 'success');
            } catch (error) {
                showNotification('Failed to update profile.', 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = originalText;
            }
        });
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        showNotification('Please login to view your profile', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
    }
});
