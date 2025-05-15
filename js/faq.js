document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.querySelector('.faq-search input');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqSections = document.querySelectorAll('.faq-section');
    const faqItems = document.querySelectorAll('.faq-item');

    // Initialize FAQ functionality
    initializeFAQ();

    function initializeFAQ() {
        // Add click handlers for category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => switchCategory(button));
        });

        // Add click handlers for FAQ questions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => toggleAnswer(item));
        });

        // Add search functionality
        searchInput.addEventListener('input', handleSearch);
    }

    function switchCategory(selectedButton) {
        const oldSection = document.querySelector('.faq-section.active');
        const newSection = document.getElementById(selectedButton.dataset.category);
        
        // Animate category transition
        oldSection.style.opacity = '0';
        oldSection.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            // Update active states
            categoryButtons.forEach(button => button.classList.remove('active'));
            faqSections.forEach(section => section.classList.remove('active'));
            
            selectedButton.classList.add('active');
            newSection.classList.add('active');
            
            // Reset and animate new section
            newSection.style.opacity = '0';
            newSection.style.transform = 'translateX(20px)';
            
            requestAnimationFrame(() => {
                newSection.style.opacity = '1';
                newSection.style.transform = 'translateX(0)';
            });
        }, 300);

        // Clear search
        searchInput.value = '';
        showAllQuestions();
    }

    function toggleAnswer(item) {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question i');
        
        // Close other open items with animation
        const currentlyOpen = document.querySelector('.faq-item.active');
        if (currentlyOpen && currentlyOpen !== item) {
            const currentAnswer = currentlyOpen.querySelector('.faq-answer');
            const currentIcon = currentlyOpen.querySelector('.faq-question i');
            
            // Animate closing
            currentAnswer.style.maxHeight = '0';
            currentIcon.style.transform = 'rotate(0deg)';
            currentlyOpen.classList.remove('active');
            
            setTimeout(() => {
                currentAnswer.style.display = 'none';
            }, 300);
        }

        // Toggle selected item with animation
        if (!item.classList.contains('active')) {
            // Opening animation
            answer.style.display = 'block';
            answer.style.maxHeight = '0';
            icon.style.transform = 'rotate(180deg)';
            
            requestAnimationFrame(() => {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
            });
        } else {
            // Closing animation
            answer.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
            item.classList.remove('active');
            
            setTimeout(() => {
                answer.style.display = 'none';
            }, 300);
        }
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeSection = document.querySelector('.faq-section.active');
        const questionsInSection = activeSection.querySelectorAll('.faq-item');

        questionsInSection.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            const matches = question.includes(searchTerm) || answer.includes(searchTerm);
            
            item.style.display = matches ? 'block' : 'none';
        });

        // Show message if no results found
        const noResults = activeSection.querySelector('.no-results');
        const hasVisibleQuestions = Array.from(questionsInSection).some(
            item => item.style.display !== 'none'
        );

        if (!hasVisibleQuestions) {
            if (!noResults) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.innerHTML = `
                    <p>No matching questions found.</p>
                    <button class="clear-search">Clear Search</button>
                `;
                activeSection.appendChild(message);
                
                message.querySelector('.clear-search').addEventListener('click', () => {
                    searchInput.value = '';
                    showAllQuestions();
                });
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    function showAllQuestions() {
        faqItems.forEach(item => {
            item.style.display = 'block';
        });
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    // Add smooth scroll when clicking category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faqContent = document.querySelector('.faq-content');
            faqContent.scrollIntoView({ behavior: 'smooth' });
        });
    });
}); 