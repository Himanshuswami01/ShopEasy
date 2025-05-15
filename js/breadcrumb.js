function updateBreadcrumb() {
    const breadcrumbList = document.querySelector('.breadcrumb ul');
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    
    // Clear existing dynamic items
    const homeItem = breadcrumbList.firstElementChild;
    const separator = breadcrumbList.children[1];
    breadcrumbList.innerHTML = '';
    breadcrumbList.appendChild(homeItem);
    breadcrumbList.appendChild(separator);

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        // Skip 'pages' directory in breadcrumb
        if (segment === 'pages') return;

        // Add separator
        const separatorItem = document.createElement('li');
        separatorItem.className = 'separator';
        separatorItem.innerHTML = '<i class="fas fa-chevron-right"></i>';
        breadcrumbList.appendChild(separatorItem);

        // Add path item
        const listItem = document.createElement('li');
        const formattedName = segment.replace(/-/g, ' ').replace('.html', '');
        
        if (index === pathSegments.length - 1) {
            listItem.className = 'current';
            listItem.textContent = formattedName;
        } else {
            const link = document.createElement('a');
            link.href = currentPath;
            link.textContent = formattedName;
            listItem.appendChild(link);
        }
        
        breadcrumbList.appendChild(listItem);
    });
}

// Update breadcrumb when page loads
document.addEventListener('DOMContentLoaded', updateBreadcrumb); 