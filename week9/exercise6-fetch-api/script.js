/**
 * Exercise 6: Fetch & APIs
 */

// ============================================================
// TASK 1 — Random Quote
// ============================================================
const quoteDisplay = document.querySelector('#quote-display');
const btnNewQuote  = document.querySelector('#btn-new-quote');

async function fetchQuote() {
    showLoading(quoteDisplay);

    try {
        const response = await fetch('https://api.quotable.io/random');

        if (!response.ok) throw new Error('Failed to fetch quote');

        const data = await response.json();

        quoteDisplay.innerHTML = `
            <blockquote class="fade-in">"${data.content}"</blockquote>
            <p class="quote-author">— ${data.author}</p>
        `;

    } catch (error) {
        showError(quoteDisplay, 'Could not load quote. The API might be down.');
        console.error(error);
    }
}

fetchQuote();
btnNewQuote.addEventListener('click', fetchQuote);


// ============================================================
// TASK 2 — GitHub User Search
// ============================================================
const githubInput  = document.querySelector('#github-input');
const btnSearch    = document.querySelector('#btn-search-user');
const githubResult = document.querySelector('#github-result');

async function searchUser() {
    const username = githubInput.value.trim();
    if (!username) return;

    showLoading(githubResult);

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (response.status === 404) {
            githubResult.innerHTML = '<p class="error-text">User not found on GitHub.</p>';
            return;
        }

        if (!response.ok) throw new Error('GitHub API Error');

        const user = await response.json();

        githubResult.innerHTML = `
            <div class="github-profile fade-in">
                <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
                <h3>${user.name || user.login}</h3>
                <p class="bio">${user.bio || 'No bio available'}</p>
                <div class="stats">
                    <span><strong>Repos:</strong> ${user.public_repos}</span>
                    <span><strong>Followers:</strong> ${user.followers}</span>
                </div>
                <a href="${user.html_url}" target="_blank" class="btn-link">View GitHub Profile</a>
            </div>
        `;

    } catch (error) {
        showError(githubResult, 'Search failed. Try again later.');
    }
}

btnSearch.addEventListener('click', searchUser);
githubInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchUser(); });


// ============================================================
// TASK 3 — Posts Feed with Pagination
// ============================================================
const postsContainer = document.querySelector('#posts-container');
const btnLoadMore    = document.querySelector('#btn-load-more');
let currentPage = 1;
const postsPerPage = 5;

async function loadPosts() {
    const start = (currentPage - 1) * postsPerPage;
    btnLoadMore.disabled = true;
    btnLoadMore.textContent = 'Loading...';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${postsPerPage}`);
        const posts = await response.json();

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card fade-in';
            card.innerHTML = `
                <h4>${post.title}</h4>
                <p>${post.body.substring(0, 100)}...</p>
                <div class="comment-section" id="comments-${post.id}"></div>
            `;

            card.addEventListener('click', () => loadComments(post.id, card));
            postsContainer.appendChild(card);
        });

        currentPage++;
        btnLoadMore.disabled = false;
        btnLoadMore.textContent = 'Load More';

    } catch (error) {
        showError(postsContainer, 'Failed to load posts.');
    }
}

async function loadComments(postId, cardElement) {
    const commentDiv = cardElement.querySelector('.comment-section');

    // Toggle: if already loaded, just hide/show
    if (commentDiv.innerHTML !== "") {
        commentDiv.classList.toggle('hidden');
        return;
    }

    commentDiv.innerHTML = '<small>Loading comments...</small>';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const comments = await response.json();

        commentDiv.innerHTML = '<h5>Comments:</h5>' + comments.map(c => `
            <div class="comment">
                <strong>${c.email}:</strong> ${c.body}
            </div>
        `).join('');

    } catch (error) {
        commentDiv.innerHTML = '<small>Error loading comments.</small>';
    }
}

loadPosts();
btnLoadMore.addEventListener('click', loadPosts);


// ============================================================
// TASK 5 — Promise.all: Parallel Fetches
// ============================================================
const btnFetchAll  = document.querySelector('#btn-fetch-all');
const multiResult  = document.querySelector('#multi-result');

async function fetchAllParallel() {
    showLoading(multiResult);

    try {
        // Fetching all three at the same time is much faster than one by one
        const [quoteRes, userRes, todoRes] = await Promise.all([
            fetch('https://api.quotable.io/random'),
            fetch('https://jsonplaceholder.typicode.com/users/1'),
            fetch('https://jsonplaceholder.typicode.com/todos/1')
        ]);

        const [quote, user, todo] = await Promise.all([
            quoteRes.json(),
            userRes.json(),
            todoRes.json()
        ]);

        multiResult.innerHTML = `
            <div class="parallel-grid fade-in">
                <div class="item"><strong>Random Quote:</strong> ${quote.content}</div>
                <div class="item"><strong>Random User:</strong> ${user.name}</div>
                <div class="item"><strong>Random Task:</strong> ${todo.title} (${todo.completed ? '✅' : '⏳'})</div>
            </div>
        `;

    } catch (error) {
        showError(multiResult, 'One or more requests failed.');
    }
}

btnFetchAll.addEventListener('click', fetchAllParallel);
