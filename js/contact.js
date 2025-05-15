document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const chatBtn = document.querySelector('.chat-btn');
    
    // Contact Form Submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real application, you would send this to your server
            console.log('Form submitted:', formData);

            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();

        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });

    // Live Chat Feature
    chatBtn.addEventListener('click', function() {
        // Initialize chat widget
        initializeChat();
    });

    // Load FAQ items
    loadFAQs();
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initializeChat() {
    // Implement chat widget initialization
    console.log('Chat initialized');
    // In a real application, you would initialize your chat widget here
}

function loadFAQs() {
    const faqGrid = document.querySelector('.faq-grid');
    
    // Sample FAQ data
    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer free returns within 30 days of purchase."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order using the tracking number in your confirmation email."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to most countries worldwide."
        }
    ];

    faqGrid.innerHTML = faqs.map(faq => `
        <div class="faq-card">
            <h3>${faq.question}</h3>
            <p>${faq.answer}</p>
        </div>
    `).join('');
} 