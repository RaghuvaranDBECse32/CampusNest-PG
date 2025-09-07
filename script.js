function login() {
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ username: user.value, password: pass.value }),
  })
  .then(r=>r.json())
  .then(data=>{
    if(data.success){
      document.getElementById("loginDiv").style.display = "none";
      document.getElementById("main").style.display = "";
      fetchPGs();
    } else {
      document.getElementById("login-msg").textContent = data.error;
    }
  });
}
function logout() {
  fetch("/logout").then(()=> {
    document.getElementById("loginDiv").style.display = "";
    document.getElementById("main").style.display = "none";
  });
}
function renderPGs(list){
  document.getElementById("pg-list").innerHTML = list.map(pg=>`<div class="pg-card">
      <h3>${pg.name}</h3>
      <p>Location: ${pg.location}</p>
      <p>Stars: ${'★'.repeat(pg.stars)}${'☆'.repeat(5-pg.stars)}</p>
      <p>Rate: ₹${pg.rate} / month</p>
    </div>`
  ).join('');
}
function fetchPGs(){
  const search = document.getElementById("search").value;
  fetch("/api/pgs?q=" + encodeURIComponent(search))
    .then(res=>res.json())
    .then(renderPGs);
}
