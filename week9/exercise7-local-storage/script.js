/**
 * Exercise 7: Local Storage — Notes App
 */

// ============================================================
// TASK 1 — Initialize: Load notes from localStorage
// ============================================================

const STORAGE_KEY = 'week9_notes';

// Load existing notes or start fresh
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ============================================================
// TASK 3 — Render Notes
// ============================================================

const notesContainer = document.querySelector('#notes-container');

function renderNotes(filter = '') {
    notesContainer.innerHTML = '';

    // Filter by search term
    let filtered = notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.body.toLowerCase().includes(filter.toLowerCase())
    );

    // Sort: Pinned notes first, then by date descending
    filtered.sort((a, b) => {
        if (a.pinned === b.pinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.pinned ? -1 : 1;
    });

    if (filtered.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <p>${filter ? `No results for "${filter}"` : 'No notes yet. Create your first one!'}</p>
            </div>`;
        return;
    }

    filtered.forEach(note => {
        const date = new Date(note.createdAt).toLocaleDateString();
        const bodyPreview = note.body.length > 100 ? note.body.substring(0, 100) + '...' : note.body;

        const card = document.createElement('div');
        card.className = `note-card ${note.pinned ? 'pinned' : ''}`;
        card.innerHTML = `
            <div class="note-header">
                <h3>${note.pinned ? '📌 ' : ''}${note.title}</h3>
                <small>${date}</small>
            </div>
            <p>${bodyPreview}</p>
            <div class="note-actions">
                <button data-id="${note.id}" data-action="edit">Edit</button>
                <button data-id="${note.id}" data-action="pin">${note.pinned ? 'Unpin' : 'Pin'}</button>
                <button data-id="${note.id}" data-action="delete" class="danger">Delete</button>
            </div>
        `;
        notesContainer.appendChild(card);
    });
}

// ============================================================
// TASK 2 — Create & Update Notes
// ============================================================

const noteForm     = document.querySelector('#note-form');
const titleInput   = document.querySelector('#note-title');
const bodyInput    = document.querySelector('#note-body');
const submitBtn    = document.querySelector('#btn-submit');
const cancelBtn    = document.querySelector('#btn-cancel');

noteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body  = bodyInput.value.trim();

    if (!title) { titleInput.focus(); return; }

    if (editingId !== null) {
        // TASK 4: UPDATE existing
        const noteIndex = notes.findIndex(n => n.id === editingId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = title;
            notes[noteIndex].body = body;
        }
        editingId = null;
        submitBtn.textContent = 'Add Note';
        cancelBtn.classList.add('hidden');
    } else {
        // TASK 2: CREATE new
        const newNote = {
            id: Date.now(), // Simple unique ID
            title,
            body,
            createdAt: new Date().toISOString(),
            pinned: false
        };
        notes.push(newNote);
    }

    saveNotes();
    renderNotes();
    noteForm.reset();
});

cancelBtn.addEventListener('click', function() {
    editingId = null;
    noteForm.reset();
    submitBtn.textContent = 'Add Note';
    cancelBtn.classList.add('hidden');
});

// ============================================================
// TASKS 4 & 5 — Edit, Pin, Delete
// ============================================================

notesContainer.addEventListener('click', function(event) {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    const id     = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    const note   = notes.find(n => n.id === id);

    if (action === 'delete') {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(n => n.id !== id);
            saveNotes();
            renderNotes();
        }
    }

    if (action === 'pin') {
        note.pinned = !note.pinned;
        saveNotes();
        renderNotes();
    }

    if (action === 'edit') {
        editingId = note.id;
        titleInput.value = note.title;
        bodyInput.value = note.body;
        submitBtn.textContent = 'Update Note';
        cancelBtn.classList.remove('hidden');
        titleInput.focus();
    }
});

// ============================================================
// TASK 6 — Search Filter
// ============================================================

const searchInput = document.querySelector('#search-input');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        renderNotes(searchInput.value);
    });
}

// Initialize on page load
renderNotes();
