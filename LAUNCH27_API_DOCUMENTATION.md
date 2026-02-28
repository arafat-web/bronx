# Launch27 API Integration Documentation

## Table of Contents
1. [Overview](#overview)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
4. [Functions](#functions)
5. [Form Integration](#form-integration)
6. [Request/Response Examples](#requestresponse-examples)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Launch27 is a maid service software platform that provides an API for managing bookings, services, frequencies, locations, and customer data. The integration in this project allows customers to book cleaning services directly through the website.

### API Details
- **Platform:** Launch27 Maid Service Software
- **API Version:** 2.1
- **Documentation:** https://bitbucket.org/awoo23/api-2.0/wiki/Home
- **Base URL:** `https://{subdomain}.launch27.com/latest/`
- **Subdomain Used:** `artech`
- **Full Base URL:** `https://artech.launch27.com/latest/`

### Key Features
- Online booking creation
- Service and frequency management
- Location-based pricing
- Payment processing (Stripe, PayPal, Cash, Check)
- Discount and gift card support
- Customer management
- Real-time availability

---

## Configuration

### Current Configuration

Located in `script.js`:

```javascript
const LAUNCH27_CONFIG = {
  subdomain: "arafatweb", // Launch27 Subdomain (without -sandbox)
  environment: "sandbox", // "sandbox" or "production"
  apiVersion: "latest",
  endpoints: {
    booking: "/booking",
    settings: "/settings",
    frequencies: "/booking-frequencies",
    services: "/booking-services",
    locations: "/booking-location"
  }
};

function getLaunch27BaseUrl() {
  if (LAUNCH27_CONFIG.environment === "sandbox") {
    return `https://${LAUNCH27_CONFIG.subdomain}-sandbox.l27.co/${LAUNCH27_CONFIG.apiVersion}`;
  } else {
    return `https://${LAUNCH27_CONFIG.subdomain}.launch27.com/${LAUNCH27_CONFIG.apiVersion}`;
  }
}
```

### URL Format Guide

**Sandbox (Testing):**
- URL: `https://{subdomain}-sandbox.l27.co/latest/`
- Example: `https://arafatweb-sandbox.l27.co/latest/`
- Use when: Testing and development

**Production:**
- URL: `https://{subdomain}.launch27.com/latest/`
- Example: `https://arafatweb.launch27.com/latest/`
- Use when: Live bookings

### How to Update

If you need to change the subdomain or environment:

1. Open `script.js`
2. Find the `LAUNCH27_CONFIG` object
3. Update the `subdomain` property (without "-sandbox" or domain):
   ```javascript
   subdomain: "your-new-subdomain"
   ```
4. Change `environment` to "sandbox" or "production"

### Environment Variables (Future Enhancement)

For production deployments, consider using environment variables:

```javascript
const LAUNCH27_CONFIG = {
  subdomain: process.env.LAUNCH27_SUBDOMAIN || "artech",
  apiVersion: process.env.LAUNCH27_API_VERSION || "latest",
  // ... other config
};
```

---

## API Endpoints

### Available Endpoints

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|-----------------|
| `/settings` | GET | Get account settings and configuration | None required |
| `/booking-frequencies` | GET | Get available service frequencies | None required |
| `/booking-services` | GET | Get available services | None required |
| `/booking-location` | GET | Verify and get location details | None required |
| `/booking` | POST | Create a new booking | None required |

### Endpoint Details

#### 1. Settings Endpoint
**URL:** `GET /settings`

**Purpose:** Retrieve account configuration, payment methods, country/state data, features, and pricing information.

**Response:**
```json
{
  "subdomain": "artech",
  "country": "US",
  "states": [...],
  "payment_methods": ["cash", "stripe", "paypal", "check"],
  "features": {
    "booking": {
      "tips": true,
      "multiple_services": false
    },
    "gift_cards": true,
    "customer_referral_engine": true
  },
  "stripe_public_key": "pk_..."
}
```

#### 2. Frequencies Endpoint
**URL:** `GET /booking-frequencies[?location_id=ID]`

**Purpose:** Get available service frequencies (e.g., One-time, Weekly, Bi-weekly, Monthly)

**Query Parameters:**
- `location_id` (optional): Filter by location

**Response:**
```json
[
  {
    "id": 1,
    "name": "One-time",
    "description": "Single service visit"
  },
  {
    "id": 2,
    "name": "Weekly",
    "description": "Every week"
  },
  {
    "id": 3,
    "name": "Bi-weekly",
    "description": "Every 2 weeks"
  },
  {
    "id": 4,
    "name": "Monthly",
    "description": "Every month"
  }
]
```

#### 3. Services Endpoint
**URL:** `GET /booking-services[?location_id=ID]`

**Purpose:** Get available cleaning services

**Query Parameters:**
- `location_id` (optional): Filter by location

**Response:**
```json
[
  {
    "id": 1,
    "name": "House Cleaning",
    "description": "Full house cleaning service",
    "pricing_type": "hourly|fixed|pricing_parameters",
    "hourly": {
      "min_quantity": 1,
      "max_quantity": 10,
      "min_minutes": 120,
      "increment_minutes": 30
    },
    "pricing_parameters": [...],
    "extras": [...],
    "features": {...}
  }
]
```

#### 4. Location Endpoint
**URL:** `GET /booking-location?address=STR&city=STR&state=STR&zip=STR`

**Purpose:** Verify service address and get location details

**Query Parameters:**
- `address` (required): Street address
- `city` (optional): City
- `state` (optional): State code
- `zip` (optional): ZIP code

**Response:**
```json
{
  "location_id": 123,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "timezone": "America/New_York",
  "service_available": true
}
```

#### 5. Booking Endpoint
**URL:** `POST /booking`

**Purpose:** Create a new booking

**Request Body:** See [Create Booking Request Schema](#create-booking-request-schema) below

**Response:**
```json
{
  "id": 12345,
  "ga_transaction": {
    "id": "abc123xyz",
    "affiliation": "artech",
    "revenue": 150.00
  },
  "ga_item": {
    "id": "abc123xyz",
    "name": "Booking",
    "price": 150.00,
    "quantity": 1
  }
}
```

---

## Functions

### Core API Functions

#### 1. getLaunch27BaseUrl()

**Purpose:** Generate the base URL for all API requests

**Returns:** `string` - Base URL

**Example:**
```javascript
const baseUrl = getLaunch27BaseUrl();
// Returns: "https://artech.launch27.com/latest"
```

---

#### 2. getLaunch27Settings()

**Purpose:** Fetch account settings and configuration

**Parameters:** None

**Returns:** `Promise<Object|null>`

**Resolves with:**
```javascript
{
  subdomain: "artech",
  country: "US",
  payment_methods: ["cash", "stripe"],
  // ... more settings
}
```

**Example:**
```javascript
const settings = await getLaunch27Settings();
if (settings) {
  console.log("Payment methods:", settings.payment_methods);
}
```

---

#### 3. getLaunch27Frequencies(locationId)

**Purpose:** Get available service frequencies

**Parameters:**
- `locationId` (optional): `number` - Location ID to filter frequencies

**Returns:** `Promise<Array|null>`

**Resolves with:** Array of frequency objects

**Example:**
```javascript
// Get all frequencies
const freqs = await getLaunch27Frequencies();

// Get frequencies for specific location
const locFreqs = await getLaunch27Frequencies(123);
```

---

#### 4. getLaunch27Services(locationId)

**Purpose:** Get available cleaning services

**Parameters:**
- `locationId` (optional): `number` - Location ID to filter services

**Returns:** `Promise<Array|null>`

**Resolves with:** Array of service objects with pricing and extras

**Example:**
```javascript
// Get all services
const services = await getLaunch27Services();

// Get services for specific location
const locServices = await getLaunch27Services(456);
```

---

#### 5. getLaunch27Location(address, city, state, zip)

**Purpose:** Verify service address and get location details

**Parameters:**
- `address` (required): `string` - Street address
- `city` (optional): `string` - City
- `state` (optional): `string` - State code (2 letters)
- `zip` (optional): `string` - ZIP code

**Returns:** `Promise<Object|null>`

**Resolves with:**
```javascript
{
  location_id: 789,
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  service_available: true
}
```

**Example:**
```javascript
const location = await getLaunch27Location(
  "123 Main St",
  "New York",
  "NY",
  "10001"
);

if (location && location.service_available) {
  console.log("Service is available at this address!");
}
```

---

#### 6. createLaunch27Booking(bookingData)

**Purpose:** Create a new booking in Launch27

**Parameters:**
- `bookingData` (required): `Object` - Booking request following API schema

**Returns:** `Promise<Object>`

**Resolves with:**
```javascript
{
  id: 12345,
  ga_transaction: { /* ... */ },
  ga_item: { /* ... */ }
}
```

**Rejects with:** Error message if booking creation fails

**Example:**
```javascript
const bookingData = {
  user: {
    email: "customer@example.com",
    first_name: "John",
    last_name: "Doe"
  },
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  phone: "555-0123",
  frequency_id: 1,
  service_date: "2024-03-15T10:00:00",
  arrival_window: 120,
  services: [{ id: 1 }],
  payment_method: "cash"
};

try {
  const booking = await createLaunch27Booking(bookingData);
  console.log("Booking created:", booking.id);
} catch (error) {
  console.error("Booking failed:", error.message);
}
```

---

#### 7. handleBookingFormSubmit(event)

**Purpose:** Form submission handler that collects form data and creates booking

**Parameters:**
- `event` (required): `Event` - Form submit event

**Returns:** `Promise<void>`

**Behavior:**
1. Prevents default form submission
2. Validates form data
3. Formats data for API
4. Calls `createLaunch27Booking()`
5. Shows success/error messages
6. Resets form on success

**Example:**
```javascript
<form id="bookingForm" onsubmit="handleBookingFormSubmit(event)">
  <!-- form fields -->
</form>
```

---

#### 8. showSuccessMessage(message)

**Purpose:** Display a success alert to the user

**Parameters:**
- `message` (required): `string` - Success message text

**Returns:** `void`

**Example:**
```javascript
showSuccessMessage("Booking created successfully!");
```

---

#### 9. showErrorMessage(message)

**Purpose:** Display an error alert to the user

**Parameters:**
- `message` (required): `string` - Error message text

**Returns:** `void`

**Example:**
```javascript
showErrorMessage("Failed to create booking. Please try again.");
```

---

## Form Integration

### Required Form Setup

The booking form must be in HTML with specific field names and structure.

### Form Fields Reference

#### Customer Information

```html
<!-- Email (required) -->
<input type="email" name="email" required>

<!-- First Name (required) -->
<input type="text" name="first_name" required>

<!-- Last Name (required) -->
<input type="text" name="last_name" required>

<!-- Company Name (optional) -->
<input type="text" name="company_name">

<!-- Phone (optional/required based on Launch27 settings) -->
<input type="tel" name="phone">

<!-- SMS Notifications (optional) -->
<input type="checkbox" name="sms_notifications">
```

#### Address Information

```html
<!-- Street Address (required) -->
<input type="text" name="address" required>

<!-- City (optional/required based on settings) -->
<input type="text" name="city">

<!-- State (optional/required based on settings) -->
<input type="text" name="state" maxlength="3">

<!-- ZIP Code (optional/required based on settings) -->
<input type="text" name="zip" maxlength="10">
```

#### Service Details

```html
<!-- Frequency (required) -->
<!-- Values should match frequency_id from API -->
<select name="frequency_id" required>
  <option value="">Select frequency...</option>
  <option value="1">One-time</option>
  <option value="2">Weekly</option>
  <option value="3">Bi-weekly</option>
  <option value="4">Monthly</option>
</select>

<!-- Service Date (required, format: YYYY-MM-DD) -->
<input type="date" name="service_date" required>

<!-- Service Time (optional, format: HH:MM) -->
<input type="time" name="service_time" value="09:00">

<!-- Arrival Window in Minutes (optional, default: 0) -->
<input type="number" name="arrival_window" value="0" min="0" max="1440">

<!-- Service Selection (required) -->
<!-- Value should match service_id from API -->
<select name="service_id" required>
  <option value="">Select service...</option>
  <option value="1">House Cleaning</option>
  <option value="2">Deep Cleaning</option>
</select>
```

#### Payment Information

```html
<!-- Payment Method (required) -->
<select name="payment_method" required>
  <option value="cash">Cash</option>
  <option value="stripe">Credit Card (Stripe)</option>
  <option value="paypal">PayPal</option>
  <option value="check">Check</option>
</select>

<!-- Stripe Token (required if payment_method="stripe") -->
<input type="hidden" name="stripe_token" id="stripeToken">

<!-- Tip Amount (optional) -->
<input type="number" name="tip" step="0.01" min="0">
```

#### Additional Information

```html
<!-- Discount Code (optional) -->
<input type="text" name="discount_code" placeholder="Enter promo code">

<!-- Customer Notes (optional) -->
<textarea name="customer_notes" placeholder="Special instructions..."></textarea>

<!-- Submit Button -->
<button type="submit" class="btn btn-primary">
  Book Now
</button>
```

### Complete Form Example

```html
<form id="bookingForm">
  <div class="form-section">
    <h5>Customer Information</h5>
    <input type="email" name="email" required placeholder="Email">
    <input type="text" name="first_name" required placeholder="First Name">
    <input type="text" name="last_name" required placeholder="Last Name">
    <input type="tel" name="phone" placeholder="Phone">
  </div>

  <div class="form-section">
    <h5>Service Address</h5>
    <input type="text" name="address" required placeholder="Street Address">
    <input type="text" name="city" placeholder="City">
    <input type="text" name="state" maxlength="3" placeholder="State">
    <input type="text" name="zip" maxlength="10" placeholder="ZIP Code">
  </div>

  <div class="form-section">
    <h5>Service Details</h5>
    <select name="frequency_id" required>
      <option value="">Select Frequency...</option>
      <option value="1">One-time</option>
      <option value="2">Weekly</option>
      <option value="3">Bi-weekly</option>
      <option value="4">Monthly</option>
    </select>
    
    <input type="date" name="service_date" required>
    <input type="time" name="service_time" value="09:00">
    
    <select name="service_id" required>
      <option value="">Select Service...</option>
      <option value="1">Standard Cleaning</option>
      <option value="2">Deep Cleaning</option>
    </select>
  </div>

  <div class="form-section">
    <h5>Payment Method</h5>
    <select name="payment_method" required>
      <option value="cash">Cash</option>
      <option value="stripe">Credit Card</option>
      <option value="check">Check</option>
    </select>
  </div>

  <button type="submit">Book Service</button>
</form>
```

### Form Validation

The form includes basic HTML5 validation:
- `required` attribute for mandatory fields
- `type="email"` for email validation
- `type="date"` for date validation
- `type="tel"` for phone
- `max` and `maxlength` for field limits

For additional validation, customize `handleBookingFormSubmit()`:

```javascript
async function handleBookingFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Add custom validation
  const email = formData.get("email");
  if (!email.includes("@")) {
    showErrorMessage("Invalid email address");
    return;
  }

  // Continue with booking...
}
```

---

## Request/Response Examples

### Example 1: Get Settings

**Request:**
```javascript
const settings = await getLaunch27Settings();
```

**Response:**
```json
{
  "subdomain": "artech",
  "country": "US",
  "payment_methods": ["cash", "stripe", "check"],
  "features": {
    "booking": {
      "tips": true,
      "multiple_services": false
    }
  },
  "stripe_public_key": "pk_live_...",
  "country_states": [
    {"code": "NY", "name": "New York"},
    {"code": "CA", "name": "California"}
  ]
}
```

---

### Example 2: Get Frequencies

**Request:**
```javascript
const frequencies = await getLaunch27Frequencies();
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "One-time",
    "description": "Single service visit"
  },
  {
    "id": 2,
    "name": "Weekly",
    "description": "Every week on the same day"
  },
  {
    "id": 3,
    "name": "Bi-weekly",
    "description": "Every two weeks"
  },
  {
    "id": 4,
    "name": "Monthly",
    "description": "Once a month"
  }
]
```

---

### Example 3: Get Services

**Request:**
```javascript
const services = await getLaunch27Services();
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Standard Cleaning",
    "description": "Regular house cleaning",
    "pricing_type": "fixed",
    "base_price": 100.00,
    "base_duration_minutes": 120,
    "features": {
      "bathroom_count": true,
      "bedroom_count": true
    },
    "extras": [
      {
        "id": 101,
        "name": "Window Washing",
        "price": 25.00,
        "quantity_based": true
      }
    ]
  },
  {
    "id": 2,
    "name": "Deep Cleaning",
    "description": "Comprehensive deep cleaning service",
    "pricing_type": "hourly",
    "hourly": {
      "min_quantity": 1,
      "max_quantity": 5,
      "min_minutes": 180,
      "increment_minutes": 30
    }
  }
]
```

---

### Example 4: Verify Location

**Request:**
```javascript
const location = await getLaunch27Location(
  "123 Main Street",
  "New York",
  "NY",
  "10001"
);
```

**Response:**
```json
{
  "location_id": 456,
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "timezone": "America/New_York",
  "service_available": true,
  "delivery_notes": "Building has security entrance"
}
```

---

### Example 5: Create Booking

**Request:**
```javascript
const booking = await createLaunch27Booking({
  user: {
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    company_name: null
  },
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zip: "10001",
  phone: "555-123-4567",
  sms_notifications: true,
  frequency_id: 1,
  service_date: "2024-03-20T10:00:00",
  arrival_window: 120,
  services: [
    {
      id: 1,
      pricing_parameters: [
        {
          id: 1,
          quantity: 3  // 3 bedrooms
        },
        {
          id": 2,
          quantity: 2  // 2 bathrooms
        }
      ]
    }
  ],
  payment_method: "cash",
  customer_notes: "Please ring doorbell twice",
  discount_code: null,
  tip: 20.00
});
```

**Response:**
```json
{
  "id": 789123,
  "ga_transaction": {
    "id": "xyz_12345",
    "affiliation": "artech",
    "revenue": 120.00
  },
  "ga_item": {
    "id": "xyz_12345",
    "name": "Booking",
    "price": 120.00,
    "quantity": 1
  }
}
```

---

## Error Handling

### Error Types

#### 1. Network Errors

Occurs when API is unreachable:
```javascript
try {
  const booking = await createLaunch27Booking(data);
} catch (error) {
  // error.message: "Failed to fetch"
  showErrorMessage("Network error. Please check your connection.");
}
```

#### 2. API Errors

Occurs when API returns error response:
```json
{
  "error": "invalid_location",
  "message": "Service not available at this address"
}
```

#### 3. Validation Errors

Occurs when booking data is invalid:
```json
{
  "errors": {
    "user.email": "Email is required",
    "services": "At least one service must be selected"
  }
}
```

### Error Handling Best Practices

```javascript
async function handleBookingFormSubmit(event) {
  event.preventDefault();
  const submitBtn = event.target.querySelector('[type="submit"]');

  try {
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="spinner"></i> Processing...';

    // Validate form
    if (!validateForm(form)) {
      showErrorMessage("Please fill in all required fields");
      return;
    }

    // Create booking
    const booking = await createLaunch27Booking(bookingData);

    // Show success
    showSuccessMessage(`Booking ${booking.id} created successfully!`);

    // Reset form
    form.reset();

  } catch (error) {
    // Handle specific errors
    if (error.message.includes("location")) {
      showErrorMessage("Service not available at this address");
    } else if (error.message.includes("Network")) {
      showErrorMessage("Network error. Please try again.");
    } else {
      showErrorMessage(`Error: ${error.message}`);
    }

  } finally {
    // Restore button
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Book Service';
  }
}
```

---

## Testing

### Manual Testing Checklist

#### Setup
- [ ] Update `LAUNCH27_CONFIG.subdomain` with your Launch27 subdomain
- [ ] Create a test booking form with all required fields
- [ ] Open browser developer console (F12)

#### Test 1: Get Settings
```javascript
// In browser console
const settings = await getLaunch27Settings();
console.log(settings);
// Should return account settings object
```

#### Test 2: Get Frequencies
```javascript
const frequencies = await getLaunch27Frequencies();
console.log(frequencies);
// Should return array of frequency objects
```

#### Test 3: Get Services
```javascript
const services = await getLaunch27Services();
console.log(services);
// Should return array of service objects
```

#### Test 4: Verify Location
```javascript
const location = await getLaunch27Location(
  "123 Main St",
  "New York",
  "NY",
  "10001"
);
console.log(location);
// Should return location object with status
```

#### Test 5: Create Test Booking
```javascript
const testBooking = {
  user: {
    email: "test@example.com",
    first_name: "Test",
    last_name: "User"
  },
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  phone: "555-0123",
  frequency_id: 1,
  service_date: "2024-03-20T10:00:00",
  arrival_window: 120,
  services: [{id: 1}],
  payment_method: "cash"
};

const booking = await createLaunch27Booking(testBooking);
console.log("Booking ID:", booking.id);
// Should return booking object with ID
```

#### Test 6: Form Submission
1. Fill out the booking form with valid data
2. Click "Book Now" button
3. Check for success message
4. Verify booking was created in Launch27 dashboard

### Automated Testing Example

```javascript
// Unit test example using Jest
describe("Launch27 API", () => {
  test("getLaunch27Settings should return object", async () => {
    const settings = await getLaunch27Settings();
    expect(settings).toHaveProperty("subdomain");
    expect(settings.subdomain).toBe("artech");
  });

  test("getLaunch27Frequencies should return array", async () => {
    const frequencies = await getLaunch27Frequencies();
    expect(Array.isArray(frequencies)).toBe(true);
    expect(frequencies.length).toBeGreaterThan(0);
  });

  test("createLaunch27Booking should return booking ID", async () => {
    const booking = await createLaunch27Booking({
      user: {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User"
      },
      address: "123 Main St",
      frequency_id: 1,
      service_date: "2024-03-20T10:00:00",
      arrival_window: 120,
      services: [{id: 1}],
      payment_method: "cash"
    });

    expect(booking).toHaveProperty("id");
    expect(typeof booking.id).toBe("number");
  });
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Failed to fetch"

**Cause:** API is unreachable or CORS error

**Solutions:**
1. Check your internet connection
2. Verify `subdomain` in `LAUNCH27_CONFIG` is correct
3. Check Launch27 API status
4. Check browser console for CORS errors

```javascript
// Debug: Test API connectivity
fetch("https://artech.launch27.com/latest/settings")
  .then(r => r.json())
  .then(d => console.log("API connected:", d))
  .catch(e => console.error("Connection error:", e));
```

---

#### Issue 2: "Invalid frequency_id"

**Cause:** Frequency ID doesn't exist or isn't available for location

**Solutions:**
1. Fetch available frequencies first
2. Use the `id` from the API response
3. Verify frequency is available for your location

```javascript
// Get available frequencies first
const frequencies = await getLaunch27Frequencies();
console.log("Available frequencies:", frequencies.map(f => f.id));

// Use valid frequency ID
const validFrequencyId = frequencies[0].id;
```

---

#### Issue 3: "Service not available at address"

**Cause:** Selected address is outside service area

**Solutions:**
1. Verify address with location endpoint first
2. Check service area in Launch27 dashboard
3. Provide complete address (street, city, state, zip)

```javascript
// Validate location before booking
const location = await getLaunch27Location(
  address,
  city,
  state,
  zip
);

if (!location.service_available) {
  showErrorMessage("Sorry, we don't service this area yet");
  return;
}
```

---

#### Issue 4: "Booking created but not appearing in dashboard"

**Cause:** Booking may need to be verified or there's a sync delay

**Solutions:**
1. Wait a few seconds and refresh dashboard
2. Check booking ID was returned (confirms creation)
3. Verify all required fields were sent
4. Check Launch27 logs for validation issues

---

#### Issue 5: CORS Errors in Production

**Cause:** Browser blocking cross-origin requests

**Solutions:**
1. If using same domain, no CORS issues
2. If different domain, ensure Launch27 allows it
3. Consider using a backend proxy for API calls

```javascript
// Instead of direct API call, use backend
async function createLaunch27Booking(bookingData) {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData)
  });
  return response.json();
}
```

---

### Debug Mode

Enable detailed logging:

```javascript
// Add to script.js for debugging
const DEBUG = true;

function logDebug(message, data) {
  if (DEBUG) {
    console.log(`[Launch27] ${message}`, data || "");
  }
}

// Modify functions to log
async function createLaunch27Booking(bookingData) {
  logDebug("Creating booking with data:", bookingData);
  
  try {
    const response = await fetch(`${getLaunch27BaseUrl()}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });

    logDebug("API Response status:", response.status);
    
    if (!response.ok) {
      const error = await response.json();
      logDebug("API Error:", error);
      throw new Error(error.message);
    }

    const result = await response.json();
    logDebug("Booking created successfully:", result);
    return result;

  } catch (error) {
    logDebug("Booking error:", error.message);
    throw error;
  }
}
```

---

## Additional Resources

- **Launch27 Official Site:** https://www.launch27.com/
- **API Documentation:** https://bitbucket.org/awoo23/api-2.0/wiki/Home
- **Help Docs:** https://docs.launch27.com/
- **Blog:** https://www.launch27.com/blog/

---

## Support

For issues or questions:
1. Check this documentation first
2. Review Launch27 API docs
3. Check browser console for error messages
4. Contact Launch27 support at https://www.launch27.com/contact/

---

**Last Updated:** February 27, 2026  
**API Version:** 2.1  
**Integration Version:** 1.0
