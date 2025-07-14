const apiKey = 'Enter Your Api Here';

const searchResults = document.getElementById('searchResults');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const loader = document.getElementById('loader');
const searchLoader = document.getElementById('searchLoader');
const body = document.body;

async function searchGame() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  // Show loader and blur
  searchLoader.style.display = 'flex';
  body.classList.add('blurred');

  try {
    const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}`);
    const data = await res.json();
    searchResults.innerHTML = '';

    data.results.forEach(game => {
      const div = document.createElement('div');
      div.className = 'search-result';
      div.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}" />
        <h4>${game.name}</h4>
      `;
      div.onclick = () => showGameDetails(game.id);
      searchResults.appendChild(div);
    });
  } catch (err) {
    console.error('Search error:', err);
  } finally {
    // Hide loader and remove blur
    searchLoader.style.display = 'none';
    body.classList.remove('blurred');
  }
}

async function showGameDetails(id) {
  overlay.classList.remove('hidden');
  overlayContent.innerHTML = '';
  loader.style.display = 'block';

  try {
    const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
    const game = await res.json();

    overlayContent.innerHTML = `
      <h2>${game.name}</h2>
      <img src="${game.background_image}" style="width:100%; border-radius:10px;"/>
      <p><strong>Released:</strong> ${game.released}</p>
      <p><strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}</p>
      <p><strong>Rating:</strong> ${game.rating} ⭐</p>
      <p>${game.description_raw?.slice(0, 300)}...</p>
    `;
  } catch (e) {
    overlayContent.innerHTML = '<p>Error loading game details.</p>';
  } finally {
    loader.style.display = 'none';
  }
}

function closeOverlay() {
  overlay.classList.add('hidden');
  overlayContent.innerHTML = '';
}

let creditsTimeout;
function toggleCredits() {
  const box = document.getElementById('creditsBox');
  box.classList.add('show');

  clearTimeout(creditsTimeout);
  creditsTimeout = setTimeout(() => {
    box.classList.remove('show');
  }, 4000); // 4 seconds
}
