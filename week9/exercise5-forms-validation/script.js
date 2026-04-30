/**
 * Exercise 5: Forms & Validation
 */

const form = document.querySelector('#registration-form');
const submitBtn = document.querySelector('#submit-btn');

// ============================================================
// HELPER: Show or clear an error on a field
// ============================================================
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`error-${inputId}`);
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorSpan.textContent = message;
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`error-${inputId}`);
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorSpan.textContent = "";
}

// ============================================================
// TASK 2: Individual Field Validators
// ============================================================

function validateName() {
    const val = document.getElementById('full-name').value.trim();
    if (val.length < 2) {
        showError('full-name', "Name must be at least 2 characters.");
        return false;
    }
    clearError('full-name');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
        showError('email', "Please enter a valid email address.");
        return false;
    }
    clearError('email');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const hasDigit = /\d/.test(val);
    updatePasswordStrength(val); // Task 4

    if (val.length < 8 || !hasDigit) {
        showError('password', "Password must be 8+ characters with at least one number.");
        return false;
    }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;
    if (confirm !== pass || confirm === "") {
        showError('confirm-password', "Passwords do not match.");
        return false;
    }
    clearError('confirm-password');
    return true;
}

function validateTerms() {
    const checkbox = document.getElementById('terms');
    if (!checkbox.checked) {
        showError('terms', "You must accept the terms.");
        return false;
    }
    clearError('terms');
    return true;
}

// ============================================================
// TASK 4: Password Strength Indicator
// ============================================================
function updatePasswordStrength(password) {
    const strengthEl = document.querySelector('#password-strength');
    if (!strengthEl) return;

    let strength = 'Weak';
    let className = 'weak';

    if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password)) {
        strength = 'Strong';
        className = 'strong';
    } else if (password.length >= 8) {
        strength = 'Fair';
        className = 'fair';
    }

    strengthEl.textContent = `Strength: ${strength}`;
    strengthEl.className = `strength-meter ${className}`;
}

// ============================================================
// TASK 5: Bio Character Counter
// ============================================================
const bioTextarea = document.querySelector('#bio');
const charCount = document.querySelector('#char-count');

if (bioTextarea) {
    bioTextarea.addEventListener('input', () => {
        const length = bioTextarea.value.length;
        charCount.textContent = `${length} / 200 characters`;

        if (length > 200) {
            charCount.classList.add('over-limit');
            submitBtn.disabled = true;
        } else {
            charCount.classList.remove('over-limit');
            submitBtn.disabled = false;
        }
    });
}

// ============================================================
// TASK 2: Attach real-time listeners
// ============================================================
document.getElementById('full-name').addEventListener('blur', validateName);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('confirm-password').addEventListener('input', validateConfirmPassword);
document.getElementById('terms').addEventListener('change', validateTerms);

// ============================================================
// TASK 3: Submit Handler
// ============================================================
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const results = [
        validateName(),
        validateEmail(),
        validatePassword(),
        validateConfirmPassword(),
        validateTerms()
    ];

    const isFormValid = results.every(result => result === true);

    if (isFormValid) {
        document.getElementById('success-message').classList.remove('hidden');
        form.classList.add('hidden');
        window.scrollTo(0, 0);
    } else {
        // Scroll to the first invalid element
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
