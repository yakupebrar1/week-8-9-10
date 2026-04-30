/**
 * Exercise 4: JavaScript & the DOM
 */

// ============================================================
// TASK 1 — Console Warmup
// ============================================================

// TODO 1a: Select the element with id "main-title" and change its text
const mainTitle = document.getElementById('main-title');
if (mainTitle) mainTitle.textContent = "DOM Mastery 🚀";

// TODO 1b: Select ALL elements with class "card", log how many there are
const cards = document.querySelectorAll('.card');
console.log(`Total cards found: ${cards.length}`);

// TODO 1c: Select the element with id "target-box" and change color
const targetBox = document.getElementById('target-box');
if (targetBox) targetBox.style.backgroundColor = "#7c3aed";



// ============================================================
// TASK 2 — Click Counter
// ============================================================

const countDisplay = document.querySelector('#count-display');
const btnInc = document.querySelector('#btn-increment');
const btnDec = document.querySelector('#btn-decrement');
const btnReset = document.querySelector('#btn-reset');

let count = 0;

function updateCountDisplay() {
    countDisplay.textContent = count;

    // Manage CSS classes based on value
    if (count === 0) {
        countDisplay.classList.add('zero');
        countDisplay.classList.remove('high');
    } else if (count > 5) {
        countDisplay.classList.add('high');
        countDisplay.classList.remove('zero');
    } else {
        countDisplay.classList.remove('zero', 'high');
    }
}

btnInc.addEventListener('click', () => {
    count++;
    updateCountDisplay();
});

btnDec.addEventListener('click', () => {
    if (count > 0) {
        count--;
        updateCountDisplay();
    }
});

btnReset.addEventListener('click', () => {
    count = 0;
    updateCountDisplay();
});

updateCountDisplay();


// ============================================================
// TASK 3 — Dynamic List Builder
// ============================================================

const listInput = document.querySelector('#list-input');
const dynamicList = document.querySelector('#dynamic-list');
const btnAddItem = document.querySelector('#btn-add-item');

btnAddItem.addEventListener('click', () => {
    const text = listInput.value.trim();

    if (text === "") {
        alert("Please enter a valid item!");
        return;
    }

    // Create <li> and button
    const li = document.createElement('li');
    li.innerHTML = `${text} <button class="delete-btn">×</button>`;

    dynamicList.appendChild(li);

    // Reset input
    listInput.value = "";
    listInput.focus();
});

// Event Delegation for delete buttons
dynamicList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const itemToRemove = event.target.parentElement;
        itemToRemove.remove();
    }
});


// ============================================================
// TASK 4 — Show / Hide Toggle
// ============================================================

const toggleBtn = document.querySelector('#btn-toggle');
const detailsDiv = document.querySelector('.details');

toggleBtn.addEventListener('click', () => {
    detailsDiv.classList.toggle('hidden');

    // Update button text based on visibility
    if (detailsDiv.classList.contains('hidden')) {
        toggleBtn.textContent = "Show Details";
    } else {
        toggleBtn.textContent = "Hide Details";
    }
});


// ============================================================
// TASK 5 — Color Mixer
// ============================================================

const sliderR = document.querySelector('#slider-r');
const sliderG = document.querySelector('#slider-g');
const sliderB = document.querySelector('#slider-b');
const valR = document.querySelector('#val-r');
const valG = document.querySelector('#val-g');
const valB = document.querySelector('#val-b');
const colorPreview = document.querySelector('#color-preview');
const hexDisplay = document.querySelector('#hex-display');

function updateColor() {
    const r = parseInt(sliderR.value);
    const g = parseInt(sliderG.value);
    const b = parseInt(sliderB.value);

    // Update value spans
    valR.textContent = r;
    valG.textContent = g;
    valB.textContent = b;

    // Apply color to preview
    const rgbString = `rgb(${r}, ${g}, ${b})`;
    colorPreview.style.backgroundColor = rgbString;

    // Generate HEX
    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    hexDisplay.textContent = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Attach listeners to all sliders
[sliderR, sliderG, sliderB].forEach(slider => {
    slider.addEventListener('input', updateColor);
});

// Initialize
updateColor();
