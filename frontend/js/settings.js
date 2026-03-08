// Settings page logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const notifToggle = document.getElementById('notif-toggle');
    const langSelect = document.getElementById('lang-select');
    const saveBtn = document.getElementById('save-settings-btn');

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');

    if (settings.theme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    notifToggle.checked = settings.notifications !== false;
    if (settings.lang) langSelect.value = settings.lang;

    saveBtn.addEventListener('click', () => {
        const newSettings = {
            theme: themeToggle.checked ? 'dark' : 'light',
            notifications: notifToggle.checked,
            lang: langSelect.value
        };

        localStorage.setItem('app_settings', JSON.stringify(newSettings));

        // Apply theme immediately
        if (newSettings.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        showNotification('Settings saved successfully!', 'success');
    });
});
