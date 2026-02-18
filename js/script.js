// Page Navigation & Page Highlighting
document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize spam protection and clock
    initSpamProtection();
    updateClock();
    updateGreeting();
});

// ========================================
// COMPREHENSIVE SPAM PROTECTION SYSTEM
// ========================================
let submitTimes = [];           // Rate limiting timestamps
let formLoadTime = Date.now();  // Time-based filtering
const spamWords = [
    "free money", "buy now", "click here", "subscribe", "promo",
    "viagra", "casino", "lottery", "guaranteed", "million dollars"
];

// Initialize spam protection
function initSpamProtection() {
    formLoadTime = Date.now(); // Record form load time
    
    const form = document.getElementById('contactForm');
    const sentMsg = document.getElementById('sent');
    
    if (!form || !sentMsg) return;

    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', provideRealTimeFeedback);
        input.addEventListener('blur', validateField);
    });
}

// Rate Limiting: Max 3 submissions per minute
function isRateLimited() {
    const now = Date.now();
    // Keep only submissions from last 60 seconds
    submitTimes = submitTimes.filter(time => now - time < 60000);
    
    if (submitTimes.length >= 3) {
        return true;
    }
    
    submitTimes.push(now);
    return false;
}

// Time-based Filtering: Reject submissions under 2 seconds
function isTooFast() {
    const submitTime = Date.now();
    const secondsTaken = (submitTime - formLoadTime) / 1000;
    return secondsTaken < 2;
}

// Spam Keyword Detection
function containsSpam(message) {
    const lowerMessage = message.toLowerCase();
    return spamWords.some(word => lowerMessage.includes(word));
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Comprehensive field validation
function validateForm(formData) {
    const errors = [];
    
    // Name validation (min 2 chars)
    if (formData.name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }
    
    // Email validation
    if (!isValidEmail(formData.email)) {
        errors.push("Please enter a valid email address");
    }
    
    // Message validation (min 10 chars, max 500)
    if (formData.message.length < 10) {
        errors.push("Message must be at least 10 characters");
    }
    if (formData.message.length > 500) {
        errors.push("Message cannot exceed 500 characters");
    }
    
    return errors;
}

// Real-time validation feedback
function provideRealTimeFeedback(e) {
    const field = e.target;
    const feedback = field.parentNode.querySelector('.validation-feedback');
    
    if (feedback) {
        feedback.remove();
    }
    
    validateField(field);
}

// Validate individual field and show visual feedback
function validateField(field) {
    const fieldContainer = field.parentNode;
    let isValid = true;
    let errorMsg = '';
    
    // Remove existing feedback
    const existingFeedback = fieldContainer.querySelector('.validation-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Field-specific validation
    if (field.id === 'name' && field.value.length < 2) {
        isValid = false;
        errorMsg = 'Name must be at least 2 characters';
    } else if (field.id === 'email' && field.value && !isValidEmail(field.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email';
    } else if (field.id === 'message') {
        if (field.value.length < 10) {
            isValid = false;
            errorMsg = 'Message must be at least 10 characters';
        } else if (field.value.length > 500) {
            isValid = false;
            errorMsg = 'Message too long (max 500 chars)';
        }
    }
    
    // Visual feedback
    if (!isValid && errorMsg) {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.3)';
        
        const feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        feedback.style.cssText = `
            color: #e74c3c;
            font-size: 0.85em;
            margin-top: 5px;
            font-weight: 500;
        `;
        feedback.textContent = errorMsg;
        fieldContainer.appendChild(feedback);
    } else {
        field.style.borderColor = '#27ae60';
        field.style.boxShadow = '0 0 5px rgba(39, 174, 96, 0.3)';
    }
}

// Main form submission handler with ALL protections
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const sentMsg = document.getElementById('sent');
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // 1. RATE LIMITING CHECK
    if (isRateLimited()) {
        showError('Too many submissions. Please wait 1 minute before trying again.', form);
        return;
    }
    
    // 2. TIME-BASED FILTERING
    if (isTooFast()) {
        showError('Submission too fast. Please spend a moment to write your message.', form);
        return;
    }
    
    // 3. COMPREHENSIVE VALIDATION
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
        showErrors(validationErrors, form);
        return;
    }
    
    // 4. SPAM KEYWORD CHECK
    if (containsSpam(formData.message)) {
        showError('Message contains blocked spam keywords. Please try again.', form);
        return;
    }
    
    // ALL CHECKS PASSED - Submit form
    console.log('✅ Form passing through all spam filters:', formData);
    
    // Show success temporarily, then submit
    sentMsg.style.display = 'block';
    form.reset();
    
    // Actually submit after brief success message
    setTimeout(() => {
        form.submit();
    }, 1000);
    
    // Hide success message
    setTimeout(() => {
        sentMsg.style.display = 'none';
    }, 5000);
}

// User feedback functions
function showError(message, form) {
    alert(message);
    form.querySelector('button[type="submit"]').focus();
}

function showErrors(errors, form) {
    const errorMsg = errors.join('\n');
    alert('Please fix the following:\n\n' + errorMsg);
    form.querySelector('#name').focus();
}

// ========================================
// CLOCK & GREETING (Simplified & Fixed)
// ========================================
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    document.getElementById('clock').textContent = timeString;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    document.getElementById('greeting').textContent = greeting + ', ';
}

// Update clock every second
setInterval(updateClock, 1000);
