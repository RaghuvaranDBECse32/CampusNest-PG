// Demo PG data
const pgs = [
  {name: "Sunrise Homes", location: "Kalinga Vihar", stars: 5, rate: 5500},
  {name: "Blue Meadow PG", location: "Chhend Colony", stars: 4, rate: 4800},
  {name: "StudentXpress PG", location: "Udit Nagar", stars: 4, rate: 4600},
  {name: "Saffron Stay", location: "Koel Nagar", stars: 5, rate: 6200},
  {name: "City Edge PG", location: "Sector 5", stars: 3, rate: 3900},
  {name: "GreenNest Boys PG", location: "Basanti Colony", stars: 4, rate: 4100}
];

function renderPGs(list = pgs) {
  const pgList = document.getElementById('pg-list');
  pgList.innerHTML = list.map(pg => `
    <div class="pg-card">
      <div class="pg-header">
        <h3>${pg.name}</h3>
        <span class="stars">${'★'.repeat(pg.stars)}${'☆'.repeat(5 - pg.stars)}</span>
      </div>
      <p>Location: ${pg.location}</p>
      <p class="pg-rate">₹${pg.rate} / month</p>
    </div>
  `).join('');
}

// Basic search filter
document.getElementById('search').addEventListener('input', function(e) {
  const val = e.target.value.toLowerCase();
  renderPGs(
    pgs.filter(pg =>
      pg.name.toLowerCase().includes(val) ||
      pg.location.toLowerCase().includes(val)
    )
  );
});

renderPGs(); // Initial render

// Simple login simulation
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const msg = document.getElementById('login-message');
  if(user === "student" && pass === "password") {
    msg.style.color = 'green';
    msg.textContent = "Login successful! Welcome, " + user + ".";
    setTimeout(() => document.getElementById('login-section').style.display = 'none', 1000);
  } else {
    msg.style.color = '#d11a2a';
    msg.textContent = "Invalid credentials. Try student/password.";
  }
});
