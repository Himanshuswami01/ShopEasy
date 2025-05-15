export function addBackButton() {
    const currentPath = window.location.pathname;
    const backContainer = document.createElement('div');
    backContainer.className = 'back-navigation';
    
    // Determine the back destination based on current path
    let backDestination = '../index.html';
    let backText = 'Back to Home';
    
    if (currentPath.includes('/admin/')) {
        backDestination = 'dashboard.html';
        backText = 'Back to Dashboard';
    } else if (currentPath.includes('/pages/')) {
        backDestination = '../index.html';
        backText = 'Back to Home';
    }

    backContainer.innerHTML = `
        <a href="${backDestination}" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>${backText}</span>
        </a>
    `;

    // Insert at the beginning of the main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.insertBefore(backContainer, mainContent.firstChild);
    }
}

// Add back button to all pages
document.addEventListener('DOMContentLoaded', addBackButton); 