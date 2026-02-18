// Page Navigation
// Multi-page version - NO single-page app code
document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Clock & Greeting (keep your existing code here)
    updateClock();
    updateGreeting();
});

// Your existing clock functions (keep these exactly the same)
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

// Contact form validation (if you want it)
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function(e) {
        const email = document.getElementById('email')?.value;
        if (!email?.includes('@')) {
            e.preventDefault();
            alert('Please enter a valid email.');
        }
    });
}


    // Contact form handler
    const form = document.getElementById('contactForm');
    const sentMsg = document.getElementById('sent');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        console.log('Contact Form:', { name, email, message });
        
        sentMsg.style.display = 'block';
        form.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            sentMsg.style.display = 'none';
        }, 5000);
    });

    // Clock functionality
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Clock and Greeting
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();

    // Greeting
    let greeting;
    if (hour >= 5 && hour < 12) greeting = "Good Morning!";
    else if (hour >= 12 && hour < 17) greeting = "Good Afternoon!";
    else if (hour >= 17 && hour < 21) greeting = "Good Evening!";
    else greeting = "Good Night!";

    document.getElementById('greeting').textContent = greeting;

    // Clock
    const time = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    document.getElementById('clock').textContent = time;
}

// Contact form enhancements
const form = document.getElementById('contactForm');
const sentMsg = document.getElementById('sent');

// Basic spam filtering & validation
const spamWords = ['free money', 'buy now', 'click here', 'viagra', 'casino'];
let submitTimes = [];

function isRateLimited() {
    const now = Date.now();
    // Keep last 60 seconds
    submitTimes = submitTimes.filter(time => now - time < 60000);
    if (submitTimes.length >= 3) return true;
    submitTimes.push(now);
    return false;
}

function containsSpam(message) {
    return spamWords.some(word => message.toLowerCase().includes(word));
}

form.addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Rate limiting
    if (isRateLimited()) {
        e.preventDefault();
        alert('Too many submissions. Please wait 1 minute.');
        return;
    }
    
    // Spam check
    if (containsSpam(message)) {
        e.preventDefault();
        alert('Message contains spam keywords. Please try again.');
        return;
    }
    
    // Email validation
    if (!email.includes('@')) {
        e.preventDefault();
        alert('Please enter a valid email.');
        return;
    }
});

