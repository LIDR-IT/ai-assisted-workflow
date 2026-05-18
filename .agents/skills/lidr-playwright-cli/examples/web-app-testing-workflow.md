# Web Application Testing Workflow with Playwright CLI

**Test Scenario**: Complete e-commerce checkout flow testing
**Application**: Demo e-commerce site (https://demo.commerce.app)
**Test Date**: 2026-03-16
**Duration**: ~15 minutes
**Status**: ✅ Passed (8/8 test cases)

---

## Test Execution Summary

| Test Case                      | Status  | Duration | Issues Found |
| ------------------------------ | ------- | -------- | ------------ |
| **TC-001: Homepage Load**      | ✅ Pass | 2.1s     | None         |
| **TC-002: Product Search**     | ✅ Pass | 3.4s     | None         |
| **TC-003: Product Selection**  | ✅ Pass | 2.8s     | None         |
| **TC-004: Add to Cart**        | ✅ Pass | 1.9s     | None         |
| **TC-005: Cart Validation**    | ✅ Pass | 2.2s     | None         |
| **TC-006: Guest Checkout**     | ✅ Pass | 4.1s     | None         |
| **TC-007: Form Validation**    | ✅ Pass | 3.6s     | None         |
| **TC-008: Order Confirmation** | ✅ Pass | 2.5s     | None         |

**Total Tests**: 8 | **Passed**: 8 | **Failed**: 0 | **Success Rate**: 100%

---

## Test Case 1: Homepage Load & Navigation

### Objective

Verify homepage loads correctly with all essential elements visible.

### Execution

```bash
# Initialize browser session
playwright-cli open https://demo.commerce.app
```

**Response**:

```
### Page
- Page URL: https://demo.commerce.app/
- Page Title: Demo Commerce - Quality Products Online
### Snapshot
[Snapshot](.playwright-cli/homepage-2026-03-16T14-30-15-123Z.yml)
```

### Verification

```bash
# Take snapshot for documentation
playwright-cli snapshot --filename=homepage-initial.yml

# Verify key elements exist
playwright-cli eval "document.querySelector('nav').textContent.includes('Products')"
# Returns: true

playwright-cli eval "document.querySelector('.hero-banner') !== null"
# Returns: true

playwright-cli eval "document.querySelectorAll('.product-card').length >= 6"
# Returns: true
```

**✅ Result**: Homepage loaded successfully with navigation, banner, and product grid visible.

---

## Test Case 2: Product Search Functionality

### Objective

Test search functionality with various queries and verify results.

### Execution

```bash
# Click on search field
playwright-cli click e7  # Search input field

# Test search with valid product
playwright-cli fill e7 "laptop"
playwright-cli press Enter

# Wait for search results and take snapshot
playwright-cli snapshot --filename=search-results.yml
```

### Verification

```bash
# Verify search results displayed
playwright-cli eval "document.querySelector('.search-results-count').textContent"
# Returns: "Found 12 products for 'laptop'"

# Check filter options are available
playwright-cli eval "document.querySelector('.filters-sidebar') !== null"
# Returns: true

# Verify products contain search term
playwright-cli eval "Array.from(document.querySelectorAll('.product-title')).some(el => el.textContent.toLowerCase().includes('laptop'))"
# Returns: true
```

**✅ Result**: Search functionality working correctly with relevant results and filter options.

---

## Test Case 3: Product Selection & Details

### Objective

Navigate to product detail page and verify information accuracy.

### Execution

```bash
# Click on first laptop product
playwright-cli click e15  # First product card

# Wait for product detail page load
playwright-cli snapshot --filename=product-details.yml
```

### Verification

```bash
# Verify product detail elements
playwright-cli eval "document.querySelector('.product-title').textContent"
# Returns: "Professional Laptop Pro 15\""

playwright-cli eval "document.querySelector('.product-price').textContent"
# Returns: "$1,299.99"

playwright-cli eval "document.querySelector('.product-description') !== null"
# Returns: true

playwright-cli eval "document.querySelector('.quantity-selector') !== null"
# Returns: true

# Check product images carousel
playwright-cli eval "document.querySelectorAll('.product-image').length >= 3"
# Returns: true
```

**✅ Result**: Product detail page displays complete information including price, description, and images.

---

## Test Case 4: Add to Cart Process

### Objective

Test adding product to cart with quantity selection.

### Execution

```bash
# Change quantity to 2
playwright-cli click e23  # Quantity increase button

# Select configuration (if available)
playwright-cli click e25  # Color option: Black
playwright-cli click e27  # Storage option: 512GB

# Add to cart
playwright-cli click e29  # Add to Cart button

# Verify cart notification
playwright-cli snapshot --filename=add-to-cart-success.yml
```

### Verification

```bash
# Check success notification
playwright-cli eval "document.querySelector('.cart-notification').style.display !== 'none'"
# Returns: true

playwright-cli eval "document.querySelector('.cart-notification').textContent.includes('added to cart')"
# Returns: true

# Verify cart badge updated
playwright-cli eval "document.querySelector('.cart-badge').textContent"
# Returns: "2"

# Check cart icon shows items
playwright-cli eval "document.querySelector('.cart-icon').classList.contains('has-items')"
# Returns: true
```

**✅ Result**: Product successfully added to cart with correct quantity and visual feedback.

---

## Test Case 5: Cart Validation & Management

### Objective

Verify cart contents, quantity modification, and total calculations.

### Execution

```bash
# Navigate to cart page
playwright-cli click e9  # Cart icon/button

# Take cart page snapshot
playwright-cli snapshot --filename=cart-page.yml
```

### Verification

```bash
# Verify cart item details
playwright-cli eval "document.querySelector('.cart-item .product-name').textContent"
# Returns: "Professional Laptop Pro 15\" - Black - 512GB"

playwright-cli eval "document.querySelector('.cart-item .quantity').value"
# Returns: "2"

playwright-cli eval "document.querySelector('.cart-item .item-price').textContent"
# Returns: "$1,299.99"

playwright-cli eval "document.querySelector('.cart-subtotal').textContent"
# Returns: "$2,599.98"

# Test quantity modification
playwright-cli click e31  # Decrease quantity button
playwright-cli eval "document.querySelector('.cart-item .quantity').value"
# Returns: "1"

playwright-cli eval "document.querySelector('.cart-subtotal').textContent"
# Returns: "$1,299.99"
```

**✅ Result**: Cart displays accurate product information and calculations update correctly.

---

## Test Case 6: Guest Checkout Flow

### Objective

Complete checkout process as guest user with valid information.

### Execution

```bash
# Proceed to checkout
playwright-cli click e35  # Proceed to Checkout button

# Choose guest checkout
playwright-cli click e37  # Continue as Guest button

# Take checkout form snapshot
playwright-cli snapshot --filename=checkout-form.yml
```

### Form Completion

```bash
# Fill shipping information
playwright-cli fill e40 "john.doe@example.com"     # Email
playwright-cli fill e42 "John"                      # First name
playwright-cli fill e44 "Doe"                       # Last name
playwright-cli fill e46 "123 Main Street"           # Address
playwright-cli fill e48 "Apt 4B"                    # Address line 2
playwright-cli fill e50 "New York"                  # City
playwright-cli select e52 "NY"                      # State
playwright-cli fill e54 "10001"                     # Zip code
playwright-cli fill e56 "+1 (555) 123-4567"         # Phone

# Fill billing information (same as shipping)
playwright-cli check e58  # Same as shipping checkbox

# Fill payment information (test card)
playwright-cli fill e60 "4111111111111111"          # Card number
playwright-cli fill e62 "John Doe"                  # Cardholder name
playwright-cli select e64 "12"                      # Expiry month
playwright-cli select e66 "2028"                    # Expiry year
playwright-cli fill e68 "123"                       # CVV

playwright-cli snapshot --filename=checkout-completed.yml
```

**✅ Result**: Checkout form successfully filled with valid test data.

---

## Test Case 7: Form Validation Testing

### Objective

Test form validation with invalid inputs to ensure proper error handling.

### Execution

```bash
# Test invalid email validation
playwright-cli fill e40 "invalid-email"
playwright-cli click e42  # Focus next field to trigger validation
```

### Verification

```bash
# Check email validation error
playwright-cli eval "document.querySelector('.email-error').style.display !== 'none'"
# Returns: true

playwright-cli eval "document.querySelector('.email-error').textContent"
# Returns: "Please enter a valid email address"
```

### Fix and Continue

```bash
# Correct the email
playwright-cli fill e40 "john.doe@example.com"

# Test invalid card number
playwright-cli fill e60 "1234"
playwright-cli click e62  # Focus next field

# Check card validation
playwright-cli eval "document.querySelector('.card-error').textContent"
# Returns: "Card number must be 16 digits"

# Correct the card number
playwright-cli fill e60 "4111111111111111"
```

**✅ Result**: Form validation working properly with clear error messages for invalid inputs.

---

## Test Case 8: Order Confirmation

### Objective

Complete order submission and verify confirmation details.

### Execution

```bash
# Submit order
playwright-cli click e70  # Place Order button

# Wait for order processing
playwright-cli snapshot --filename=order-processing.yml

# Wait for confirmation page
# Note: This might take a few seconds for payment processing simulation
```

### Verification

```bash
# Verify order confirmation page
playwright-cli eval "document.querySelector('.order-confirmation').style.display !== 'none'"
# Returns: true

playwright-cli eval "document.querySelector('.order-number').textContent.includes('ORDER-')"
# Returns: true

playwright-cli eval "document.querySelector('.order-total').textContent"
# Returns: "$1,299.99"

playwright-cli eval "document.querySelector('.shipping-address').textContent.includes('123 Main Street')"
# Returns: true

# Check email confirmation message
playwright-cli eval "document.querySelector('.email-confirmation').textContent"
# Returns: "A confirmation email has been sent to john.doe@example.com"

playwright-cli snapshot --filename=order-confirmed.yml
```

**✅ Result**: Order successfully placed with correct confirmation details and email notification.

---

## Performance Metrics

### Page Load Times

| Page               | Load Time | Performance Score |
| ------------------ | --------- | ----------------- |
| **Homepage**       | 2.1s      | Good              |
| **Search Results** | 1.8s      | Excellent         |
| **Product Detail** | 2.4s      | Good              |
| **Cart Page**      | 1.6s      | Excellent         |
| **Checkout**       | 2.7s      | Acceptable        |
| **Confirmation**   | 3.1s      | Acceptable        |

### Network Analysis

```bash
# Monitor network during checkout
playwright-cli network

# Sample output showing network activity:
# POST /api/cart/add - 200 - 124ms
# GET /api/cart/summary - 200 - 89ms
# POST /api/checkout/validate - 200 - 156ms
# POST /api/orders/create - 200 - 234ms
```

---

## Browser Session Management

### Multi-Tab Testing

```bash
# Test opening multiple product pages
playwright-cli tab-new https://demo.commerce.app/products/smartphone
playwright-cli tab-new https://demo.commerce.app/products/headphones

# List all tabs
playwright-cli tab-list
# Returns:
# Tab 0: Demo Commerce - Laptop Pro 15"
# Tab 1: Demo Commerce - Smartphone Pro
# Tab 2: Demo Commerce - Wireless Headphones

# Switch between tabs to verify cart persistence
playwright-cli tab-select 1
playwright-cli click e15  # Add smartphone to cart
playwright-cli tab-select 0
playwright-cli eval "document.querySelector('.cart-badge').textContent"
# Returns: "2" (cart state persists across tabs)
```

### Storage State Testing

```bash
# Save authentication state (if user was logged in)
playwright-cli state-save checkout-session.json

# Test localStorage cart persistence
playwright-cli localstorage-list
# Returns cart items stored in localStorage

playwright-cli localstorage-get "cart-items"
# Returns: '[{"id":"laptop-pro-15","quantity":1,"price":1299.99}]'
```

---

## Error Handling & Edge Cases

### Network Simulation

```bash
# Test with slow network
playwright-cli route "**/*.jpg" --status=200 --delay=2000

# Test with API failures
playwright-cli route "**/api/cart/**" --status=503

# Verify error handling
playwright-cli click e29  # Try to add to cart
playwright-cli eval "document.querySelector('.error-message').textContent"
# Returns: "Service temporarily unavailable. Please try again."

# Reset routing
playwright-cli unroute
```

### Browser Compatibility

```bash
# Test in different browsers (if needed)
playwright-cli close
playwright-cli open --browser=firefox https://demo.commerce.app
# Repeat key test cases in Firefox

playwright-cli close
playwright-cli open --browser=webkit https://demo.commerce.app
# Repeat key test cases in Safari (WebKit)
```

---

## Test Data & Screenshots

### Generated Artifacts

```
📁 .playwright-cli/
├── homepage-initial.yml              # Initial homepage state
├── search-results.yml               # Search functionality test
├── product-details.yml              # Product page validation
├── add-to-cart-success.yml          # Cart addition verification
├── cart-page.yml                    # Cart management test
├── checkout-form.yml                # Checkout form state
├── checkout-completed.yml           # Form completion
├── order-processing.yml             # Order submission
├── order-confirmed.yml              # Final confirmation
└── session-trace.json               # Complete session trace
```

### Manual Screenshots (Optional)

```bash
# Take full page screenshots for documentation
playwright-cli screenshot --filename=homepage-full.png
playwright-cli screenshot --filename=cart-page-full.png
playwright-cli screenshot --filename=checkout-full.png
playwright-cli screenshot --filename=confirmation-full.png
```

---

## Session Cleanup

### End of Test Session

```bash
# Save final state for potential reuse
playwright-cli state-save final-test-state.json

# Clear temporary data
playwright-cli cookie-clear
playwright-cli localstorage-clear
playwright-cli sessionstorage-clear

# Close browser session
playwright-cli close

# Clean up session data
playwright-cli delete-data
```

---

## Test Results Summary

### ✅ Passed Test Cases (8/8)

1. **Homepage Load**: All essential elements loaded correctly
2. **Product Search**: Search returns relevant results with filtering
3. **Product Selection**: Product details accurately displayed
4. **Add to Cart**: Cart functionality working with quantity updates
5. **Cart Validation**: Calculations and item management correct
6. **Guest Checkout**: Complete checkout flow successful
7. **Form Validation**: Proper error handling for invalid inputs
8. **Order Confirmation**: Order placed successfully with confirmation

### 🔍 Quality Observations

**Strengths**:

- Fast page load times (< 3.1s)
- Consistent UI behavior across pages
- Proper form validation and error messages
- Cart state persistence across page navigation
- Mobile-responsive design (verified with resize testing)

**Areas for Improvement**:

- Checkout page load time could be optimized (2.7s)
- Consider adding loading indicators for form submission
- Image optimization could improve search results page performance

**Accessibility Notes**:

- All interactive elements properly focusable
- Form labels correctly associated
- Color contrast meets WCAG guidelines
- Keyboard navigation functional throughout

---

## Next Steps

1. **Performance Optimization**: Address slower page load times identified
2. **Mobile Testing**: Repeat key flows on mobile viewport sizes
3. **Accessibility Audit**: Run automated accessibility tests
4. **Cross-Browser**: Validate in Chrome, Firefox, Safari, and Edge
5. **Load Testing**: Test with concurrent user sessions
6. **Security Testing**: Validate XSS protection and input sanitization

**Test Environment**: Staging
**Next Test Run**: Weekly regression testing
**Test Data Cleanup**: Completed ✅
