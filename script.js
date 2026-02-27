// Navbar scroll effect
const navbar = document.getElementById("mainNavbar");

let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

const currentScrollTop = window.scrollY;
 
if (window.innerWidth <= 991) {
    if (currentScrollTop < lastScrollTop) {
        navbar.style.top = "0px";
    } else {
        navbar.style.top = "20px";
    }
}
lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Close mobile menu if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});

// Scroll animations and counter for sections
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
};

// Counter Animation
function animateCounter(element) {
  const target = parseFloat(element.getAttribute("data-target"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target % 1 === 0 ? target : target.toFixed(1);
      clearInterval(timer);
    } else {
      element.textContent =
        current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
    }
  }, 16);
}

// Number Counter (for different format)
function animateNumberCounter(element) {
  const target = parseInt(element.getAttribute("data-counter"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

const animateOnScroll = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
      entry.target.classList.add("counted");

      // Animate data-target counters (How It Works)
      const counters = entry.target.querySelectorAll(
        ".stat-number[data-target]",
      );
      counters.forEach((counter) => {
        animateCounter(counter);
      });

      // Animate data-counter numbers (Screening)
      const numberCounters = entry.target.querySelectorAll("[data-counter]");
      numberCounters.forEach((counter) => {
        animateNumberCounter(counter);
      });

      // Animate rate-number (Screening approval rate)
      const rateNumbers = entry.target.querySelectorAll(
        ".rate-number[data-target]",
      );
      rateNumbers.forEach((num) => {
        animateCounter(num);
      });
    }
  });
}, observerOptions);

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  const processSteps = document.querySelectorAll(".process-step");
  const screeningVisual = document.querySelector(".screening-visual");
  const statCards = document.querySelectorAll(".stat-card");
  const locationCards = document.querySelectorAll(".location-card");
  const coverageMap = document.querySelector(".coverage-map");

  // Observe process steps
  processSteps.forEach((step) => {
    animateOnScroll.observe(step);
  });

  // Observe screening section
  if (screeningVisual) {
    animateOnScroll.observe(screeningVisual);
  }

  // Observe stat cards
  statCards.forEach((card) => {
    animateOnScroll.observe(card);
  });

  // Observe location cards
  locationCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;

    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    cardObserver.observe(card);
  });

  // Observe coverage map
  if (coverageMap) {
    animateOnScroll.observe(coverageMap);
  }

  // Add enhanced hover effects
  const stepCards = document.querySelectorAll(".step-card");
  stepCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  });

  const screeningSteps = document.querySelectorAll(".screening-step");
  screeningSteps.forEach((step) => {
    step.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  });
});

// Launch27 API Integration
// Configure your Launch27 subdomain here (e.g., "your-company" from "your-company.launch27.com")
const LAUNCH27_CONFIG = {
  subdomain: "artech", // Launch27 Subdomain
  apiVersion: "latest",
  endpoints: {
    booking: "/booking",
    settings: "/settings",
    frequencies: "/booking-frequencies",
    services: "/booking-services",
    locations: "/booking-location"
  }
};

/**
 * Get the Launch27 API base URL
 */
function getLaunch27BaseUrl() {
  return `https://${LAUNCH27_CONFIG.subdomain}.launch27.com/${LAUNCH27_CONFIG.apiVersion}`;
}

/**
 * Get account settings and configuration from Launch27
 */
async function getLaunch27Settings() {
  try {
    const response = await fetch(`${getLaunch27BaseUrl()}${LAUNCH27_CONFIG.endpoints.settings}`);
    if (!response.ok) throw new Error("Failed to fetch settings");
    return await response.json();
  } catch (error) {
    console.error("Launch27 Settings Error:", error);
    return null;
  }
}

/**
 * Get available frequencies for booking
 */
async function getLaunch27Frequencies(locationId = null) {
  try {
    let url = `${getLaunch27BaseUrl()}${LAUNCH27_CONFIG.endpoints.frequencies}`;
    if (locationId) url += `?location_id=${locationId}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch frequencies");
    return await response.json();
  } catch (error) {
    console.error("Launch27 Frequencies Error:", error);
    return null;
  }
}

/**
 * Get available services for booking
 */
async function getLaunch27Services(locationId = null) {
  try {
    let url = `${getLaunch27BaseUrl()}${LAUNCH27_CONFIG.endpoints.services}`;
    if (locationId) url += `?location_id=${locationId}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch services");
    return await response.json();
  } catch (error) {
    console.error("Launch27 Services Error:", error);
    return null;
  }
}

/**
 * Get location details by address
 */
async function getLaunch27Location(address, city = "", state = "", zip = "") {
  try {
    const params = new URLSearchParams({
      address: address,
      city: city,
      state: state,
      zip: zip
    });
    
    const response = await fetch(`${getLaunch27BaseUrl()}${LAUNCH27_CONFIG.endpoints.locations}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch location");
    return await response.json();
  } catch (error) {
    console.error("Launch27 Location Error:", error);
    return null;
  }
}

/**
 * Create a booking in Launch27
 * @param {Object} bookingData - Booking data matching Launch27 API schema
 */
async function createLaunch27Booking(bookingData) {
  try {
    const response = await fetch(`${getLaunch27BaseUrl()}${LAUNCH27_CONFIG.endpoints.booking}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
    }

    const result = await response.json();
    console.log("Booking created successfully:", result);
    return result;
  } catch (error) {
    console.error("Launch27 Booking Error:", error);
    throw error;
  }
}

/**
 * Handle booking form submission
 */
async function handleBookingFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  try {
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';

    // Collect form data
    const formData = new FormData(form);
    
    // Validate required fields
    const email = formData.get("email");
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const zip = formData.get("zip");
    const phone = formData.get("phone");
    const serviceDate = formData.get("service_date");
    const paymentMethod = formData.get("payment_method");

    // Validate required fields
    if (!email || !firstName || !lastName || !city || !state || !zip || !serviceDate || !paymentMethod) {
      throw new Error("Please fill in all required fields");
    }

    // Get all checked services from checkboxes
    const serviceCheckboxes = form.querySelectorAll('input[name="service"]:checked');
    if (serviceCheckboxes.length === 0) {
      throw new Error("Please select at least one service");
    }

    // Map service values to Launch27 service IDs
    const serviceIdMap = {
      "roof": 1,
      "gutter": 2,
      "window": 3,
      "pressure": 4
    };

    const services = Array.from(serviceCheckboxes).map(checkbox => ({
      id: serviceIdMap[checkbox.value] || 1
    }));

    // Parse service date and time
    const serviceTime = formData.get("service_time") || "09:00";
    const serviceDatetime = `${serviceDate}T${serviceTime}:00`;

    // Build booking request object matching Launch27 API schema
    const bookingRequest = {
      user: {
        email: email,
        first_name: firstName,
        last_name: lastName
      },
      address: address || null,
      city: city,
      state: state,
      zip: zip,
      phone: phone,
      frequency_id: parseInt(formData.get("frequency_id") || 1),
      service_date: serviceDatetime,
      arrival_window: parseInt(formData.get("arrival_window") || 120),
      services: services,
      payment_method: paymentMethod,
      customer_notes: formData.get("customer_notes") || null,
      discount_code: formData.get("discount_code") || null,
      tip: parseFloat(formData.get("tip") || 0) || null
    };

    // If Stripe payment method, stripe_token would be required
    if (bookingRequest.payment_method === "stripe") {
      const stripeToken = formData.get("stripe_token");
      if (!stripeToken) {
        throw new Error("Stripe token is required for Stripe payments");
      }
      bookingRequest.stripe_token = stripeToken;
    }

    console.log("Submitting booking request:", bookingRequest);

    // Create booking
    const result = await createLaunch27Booking(bookingRequest);

    // Success message
    showSuccessMessage(`Booking created successfully! Booking ID: ${result.id}`);
    
    // Reset form
    form.reset();
    
    // Scroll to success message
    window.scrollTo(0, 0);
    
    // Optionally redirect after success (uncomment to use)
    // setTimeout(() => {
    //   window.location.href = '/booking-confirmation.html?id=' + result.id;
    // }, 2000);

  } catch (error) {
    console.error("Booking submission error:", error);
    showErrorMessage(`Booking Error: ${error.message}`);
  } finally {
    // Restore submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/**
 * Show success message to user
 */
function showSuccessMessage(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-success alert-dismissible fade show";
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    <i class="fas fa-check-circle me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  const formCard = document.querySelector(".booking-form-card");
  if (formCard) {
    formCard.insertBefore(alertDiv, formCard.firstChild);
  }
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-danger alert-dismissible fade show";
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    <i class="fas fa-exclamation-circle me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  const formCard = document.querySelector(".booking-form-card");
  if (formCard) {
    formCard.insertBefore(alertDiv, formCard.firstChild);
  }
}

/**
 * Attach booking form submit handler
 */
document.addEventListener("DOMContentLoaded", function() {
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingFormSubmit);
  }
});
