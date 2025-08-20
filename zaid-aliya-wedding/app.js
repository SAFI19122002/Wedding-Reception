// Wedding Invitation Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCountdownTimer();
    initRSVPForm();
    initAnimations();
});

// Countdown Timer Functionality
function initCountdownTimer() {
    const weddingDate = new Date('2025-09-07T19:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = days >= 0 ? days : 0;
        if (hoursElement) hoursElement.textContent = hours >= 0 ? hours : 0;
        if (minutesElement) minutesElement.textContent = minutes >= 0 ? minutes : 0;
        if (secondsElement) secondsElement.textContent = seconds >= 0 ? seconds : 0;
        
        // Add animation effect when numbers change
        animateTimeUnit(daysElement, days);
        animateTimeUnit(hoursElement, hours);
        animateTimeUnit(minutesElement, minutes);
        animateTimeUnit(secondsElement, seconds);
        
        // If the countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            showWeddingDayMessage();
        }
    }
    
    function animateTimeUnit(element, value) {
        if (element && element.dataset.lastValue !== value.toString()) {
            element.style.transform = 'scale(1.1)';
            element.style.color = '#FFD700';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#1B5E20';
            }, 200);
            
            element.dataset.lastValue = value.toString();
        }
    }
    
    function showWeddingDayMessage() {
        const countdownSection = document.querySelector('.countdown-section h2');
        if (countdownSection) {
            countdownSection.textContent = 'Today is Our Special Day! 🎉';
            countdownSection.style.color = '#FFD700';
        }
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// RSVP Form Functionality
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    
    if (!rsvpForm || !rsvpSuccess) {
        console.error('RSVP form or success elements not found');
        return;
    }
    
    // Ensure success message is hidden initially
    rsvpSuccess.style.display = 'none';
    rsvpSuccess.classList.add('hidden');
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(rsvpForm);
        const guestName = formData.get('guestName')?.trim();
        const guestCount = formData.get('guestCount');
        const contactInfo = formData.get('contactInfo')?.trim();
        const dietaryPreferences = formData.get('dietaryPreferences')?.trim() || '';
        
        console.log('Form submitted with data:', { guestName, guestCount, contactInfo, dietaryPreferences });
        
        // Validate form
        if (!validateRSVPForm(guestName, guestCount, contactInfo)) {
            console.log('Form validation failed');
            return;
        }
        
        console.log('Form validation passed, submitting...');
        
        // Submit RSVP
        submitRSVP(guestName, guestCount, contactInfo, dietaryPreferences);
    });
}

function validateRSVPForm(guestName, guestCount, contactInfo) {
    let isValid = true;
    
    // Clear previous error states
    clearFormErrors();
    
    // Validate guest name
    if (!guestName || guestName.length < 2) {
        showFieldError('guest-name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Validate guest count
    if (!guestCount) {
        showFieldError('guest-count', 'Please select number of attendees');
        isValid = false;
    }
    
    // Validate contact info
    if (!contactInfo || !isValidPhoneNumber(contactInfo)) {
        showFieldError('contact-info', 'Please enter a valid phone number');
        isValid = false;
    }
    
    console.log('Validation result:', isValid);
    return isValid;
}

function isValidPhoneNumber(phone) {
    // Simple phone validation for Indian numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) || cleanPhone.length >= 10;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#C0152F';
        field.style.borderWidth = '2px';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#C0152F';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-4)';
        errorElement.style.fontWeight = 'var(--font-weight-medium)';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        
        // Focus on the first error field
        if (field.parentNode.querySelector('.field-error')) {
            field.focus();
        }
    }
}

function clearFormErrors() {
    // Reset field borders
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.borderWidth = '';
    });
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
}

function submitRSVP(guestName, guestCount, contactInfo, dietaryPreferences) {
    const submitButton = document.querySelector('.rsvp-submit');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    
    if (!submitButton || !rsvpForm || !rsvpSuccess) {
        console.error('Required elements not found for RSVP submission');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    submitButton.style.opacity = '0.7';
    
    console.log('Starting RSVP submission process...');
    
    // Simulate API call delay
    setTimeout(() => {
        try {
            // Log RSVP data (in real app, this would be sent to a server)
            console.log('RSVP Submitted Successfully:', {
                guestName,
                guestCount,
                contactInfo,
                dietaryPreferences,
                timestamp: new Date().toISOString()
            });
            
            // Hide form and show success message
            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';
            rsvpSuccess.classList.remove('hidden');
            
            // Add success animation
            rsvpSuccess.style.opacity = '0';
            rsvpSuccess.style.transform = 'translateY(20px)';
            rsvpSuccess.style.transition = 'all 0.6s ease-out';
            
            // Trigger animation
            setTimeout(() => {
                rsvpSuccess.style.opacity = '1';
                rsvpSuccess.style.transform = 'translateY(0)';
            }, 100);
            
            // Scroll to success message
            setTimeout(() => {
                rsvpSuccess.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
            
            console.log('RSVP submission completed successfully');
            
        } catch (error) {
            console.error('Error during RSVP submission:', error);
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.opacity = '1';
            
            // Show error message
            alert('There was an error submitting your RSVP. Please try again.');
        }
        
    }, 1500);
}

// Scroll Animations
function initAnimations() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const animateElements = document.querySelectorAll('.details-card, .family-card, .contact-card, .countdown-timer');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animations
    addScrollAnimationStyles();
    
    // Smooth scrolling for internal links
    initSmoothScrolling();
}

function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .details-card,
        .family-card,
        .contact-card,
        .countdown-timer {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .details-card.animate-in,
        .family-card.animate-in,
        .contact-card.animate-in,
        .countdown-timer.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .family-card.animate-in {
            transition-delay: 0.2s;
        }
        
        .family-card:nth-child(2).animate-in {
            transition-delay: 0.4s;
        }
        
        .contact-card.animate-in {
            transition-delay: 0.1s;
        }
        
        .contact-card:nth-child(2).animate-in {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);
}

function initSmoothScrolling() {
    // Add smooth scrolling behavior to any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to time units
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
        unit.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(27, 94, 32, 0.2)';
        });
        
        unit.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Add floating animation to decorative elements
    const ornaments = document.querySelectorAll('.ornament-top, .ornament-bottom');
    ornaments.forEach((ornament, index) => {
        ornament.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    });
    
    // Add floating keyframes
    const floatingStyle = document.createElement('style');
    floatingStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(floatingStyle);
});

// Handle form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentNode.classList.add('form-group-focused');
            // Clear any previous errors when user starts typing
            clearFieldError(this);
        });
        
        control.addEventListener('blur', function() {
            this.parentNode.classList.remove('form-group-focused');
        });
        
        control.addEventListener('input', function() {
            // Clear error as user types
            clearFieldError(this);
        });
    });
    
    // Add focus styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .form-group-focused .form-label {
            color: var(--islamic-emerald);
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(focusStyle);
});

function clearFieldError(field) {
    // Reset field border
    field.style.borderColor = '';
    field.style.borderWidth = '';
    
    // Remove error message for this field
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}