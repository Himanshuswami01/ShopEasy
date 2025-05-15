class SettingsManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.loadSettings();
        this.setupEventListeners();
        this.populateTimezones();
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/admin/settings');
            const settings = await response.json();
            this.populateSettings(settings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    populateSettings(settings) {
        // Populate form fields with current settings
        Object.keys(settings).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });

        // Handle logo preview
        if (settings.logo) {
            document.getElementById('logoPreview').src = settings.logo;
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => this.switchTab(item.dataset.tab));
        });

        // Logo upload preview
        const logoInput = document.querySelector('input[name="logo"]');
        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        }

        // Test email configuration
        const testEmailBtn = document.querySelector('.test-email-btn');
        if (testEmailBtn) {
            testEmailBtn.addEventListener('click', () => this.testEmailConfig());
        }
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });

        // Show selected tab content
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.toggle('active', tab.id === tabId);
        });
    }

    async saveSettings() {
        try {
            const settings = this.gatherSettings();
            
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                this.showNotification('Settings saved successfully!', 'success');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    gatherSettings() {
        const settings = {};
        document.querySelectorAll('input, select').forEach(element => {
            if (element.name) {
                settings[element.name] = element.type === 'checkbox' ? 
                    element.checked : element.value;
            }
        });
        return settings;
    }

    async testEmailConfig() {
        try {
            const response = await fetch('/api/admin/settings/test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.gatherEmailSettings())
            });

            if (response.ok) {
                this.showNotification('Test email sent successfully!', 'success');
            } else {
                throw new Error('Failed to send test email');
            }
        } catch (error) {
            console.error('Error testing email config:', error);
            this.showNotification('Failed to send test email', 'error');
        }
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('logoPreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    populateTimezones() {
        const timezones = moment.tz.names();
        const select = document.querySelector('select[name="timezone"]');
        if (select) {
            select.innerHTML = timezones.map(tz => 
                `<option value="${tz}">${tz}</option>`
            ).join('');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize the settings manager
const settingsManager = new SettingsManager(); 