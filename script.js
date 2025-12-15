/**
 * Hance Land Service - JavaScript Functionality
 * Handles mobile navigation, form submission, and smooth scrolling
 */

// ============================================
// MOBILE MENU TOGGLE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Update ARIA attribute for accessibility
      const isExpanded = !mobileMenu.classList.contains('hidden');
      mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = mobileMenu.contains(event.target) || mobileMenuButton.contains(event.target);
      if (!isClickInside && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#' || targetId === '') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim()
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate form submission (replace with actual API call)
    console.log('Form submitted:', formData);

    // Show success message
    showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');

    // Reset form
    contactForm.reset();

    // In a real implementation, you would send the data to your server:
    /*
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
      contactForm.reset();
    })
    .catch(error => {
      showMessage('Oops! Something went wrong. Please try again.', 'error');
      console.error('Error:', error);
    });
    */
  });
}

// ============================================
// FORM VALIDATION HELPER FUNCTIONS
// ============================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(message, type) {
  // Remove any existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message-${type}`;
  messageDiv.textContent = message;
  
  // Style based on type
  messageDiv.style.padding = '1rem';
  messageDiv.style.borderRadius = '0.5rem';
  messageDiv.style.marginTop = '1rem';
  messageDiv.style.textAlign = 'center';
  messageDiv.style.fontWeight = '600';
  messageDiv.style.transition = 'all 0.3s ease';
  
  if (type === 'success') {
    messageDiv.style.backgroundColor = '#10b981';
    messageDiv.style.color = 'white';
  } else {
    messageDiv.style.backgroundColor = '#ef4444';
    messageDiv.style.color = 'white';
  }

  // Insert message after form
  contactForm.appendChild(messageDiv);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 5000);
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Add shadow on scroll
  if (scrollTop > 10) {
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }
  
  lastScrollTop = scrollTop;
});

// ============================================
// PHONE NUMBER CLICK TRACKING
// ============================================
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
  link.addEventListener('click', function() {
    console.log('Phone number clicked:', this.getAttribute('href'));
    // Add analytics tracking here if needed
  });
});

// ============================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS (OPTIONAL)
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections (optional - can be enabled for fade-in effects)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    // Uncomment below lines to enable fade-in animations
    // section.style.opacity = '0';
    // section.style.transform = 'translateY(20px)';
    // section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // observer.observe(section);
  });
}

// Initialize scroll animations (commented out by default)
// initScrollAnimations();

// ============================================
// SERVICE LINKS HANDLING
// ============================================
const serviceLinks = document.querySelectorAll('.customizable-card a[href="#contact"]');
serviceLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get the service name from the parent card
    const serviceCard = this.closest('.customizable-card');
    const serviceName = serviceCard.querySelector('h3').textContent;
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Pre-fill the service select field
      setTimeout(() => {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
          if (serviceName.includes('Pond')) {
            serviceSelect.value = 'pond';
          } else if (serviceName.includes('Clearing')) {
            serviceSelect.value = 'clearing';
          } else if (serviceName.includes('Mulching')) {
            serviceSelect.value = 'mulching';
          }
        }
      }, 500);
    }
  });
});

// ============================================
// CONSOLE LOG - REMOVE IN PRODUCTION
// ============================================
console.log('Hance Land Service website loaded successfully!');
console.log('For support, contact: hancelandservice@gmail.com');
