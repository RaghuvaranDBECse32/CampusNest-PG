const {useState, useEffect} = React;

// Mock hotel/PG raw review data
const sampleHotels = [
  {
    name: "Sunrise Ladies PG",
    environment: "Peaceful, well-lit rooms, close to cafeteria",
    price: 4500,
    rating: 4.6,
    review: "Clean, secure, with AC/Food. Highly recommended.",
  },
  {
    name: "Green View Boys PG",
    environment: "Lively area, near gym/market, shared rooms",
    price: 4300,
    rating: 4.2,
    review: "Nice meals, good laundry service. Gym was good.",
  },
  {
    name: "Metro Elite PG",
    environment: "Modern setting, CCTV, near bus stop",
    price: 5000,
    rating: 4.9,
    review: "Excellent amenities, good security, helpful staff.",
  },
  {
    name: "HostelPlus PG",
    environment: "Quiet zone, large garden, study tables",
    price: 4200,
    rating: 4.1,
    review: "AC rooms, supportive warden, timely food.",
  },
  {
    name: "Comfort Nest PG",
    environment: "In-campus market surroundings, mixed crowd",
    price: 4000,
    rating: 3.9,
    review: "Average rooms, nice location, good WiFi.",
  }
];

// Simulate login/register workflow and localStorage "database"
function Login({onLogin}) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    let db = JSON.parse(localStorage.getItem("campus_pg_users")||"[]");
    let user = db.find(u=>u.username===username && u.password===password);
    if(user) { onLogin(user); setMsg(""); }
    else { setMsg("Invalid login. Register first."); }
  }
  function handleRegister(e) {
    e.preventDefault();
    let db = JSON.parse(localStorage.getItem("campus_pg_users")||"[]");
    if(db.some(u=>u.username===username)) { setMsg("Username already exists."); return; }
    db.push({username,password,hotelsBooked:[],loginTime:Date.now()});
    localStorage.setItem("campus_pg_users",JSON.stringify(db));
    setMsg("Registered successfully! You may now login.");
  }
  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username}
         onChange={e=>setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
         onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <div style={{margin:"10px 0"}}>*Or register below*</div>
      <form onSubmit={handleRegister}>
        <input placeholder="New Username" value={username}
         onChange={e=>setUsername(e.target.value)} required />
        <input type="password" placeholder="New Password" value={password}
         onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {msg && <div style={{color:"red"}}>{msg}</div>}
    </div>
  );
}

function HotelList({user,logout}) {
  const [dbHotels,setDbHotels] = useState(sampleHotels); // Demo only, can be state
  const [booked,setBooked] = useState(user.hotelsBooked||[]);
  function handleBook(idx) {
    let udb = JSON.parse(localStorage.getItem("campus_pg_users")||"[]");
    let target = udb.find(u=>u.username===user.username);
    target.hotelsBooked.push(idx);
    localStorage.setItem("campus_pg_users",JSON.stringify(udb));
    setBooked([...target.hotelsBooked]);
    alert("Booking confirmed!");
  }
  function handleExport() {
    let udb = JSON.parse(localStorage.getItem("campus_pg_users")||"[]");
    const data = udb.map(u=>({username:u.username,loginTime:new Date(u.loginTime),hotelsBooked:u.hotelsBooked}));
    const csv = "Username,LoginTime,HotelsBooked\n" +
      data.map(d=>`${d.username},${d.loginTime},${d.hotelsBooked}`).join("\n");
    // Download CSV
    const blob = new Blob([csv], { type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "CampusNestPG_Users.csv"; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <header>
        <h1>Welcome, {user.username}!</h1>
        <button onClick={logout} style={{float:"right"}}>Logout</button>
      </header>
      <main>
        <h2>Available PGs & Hotels</h2>
        <button onClick={handleExport}>Export login database (CSV)</button>
        <div>
        {dbHotels.map((hotel,idx)=>(
          <div className="hotel-card" key={hotel.name}>
            <h3>{hotel.name}</h3>
            <div><i>{hotel.environment}</i></div>
            <div className="rating">
              {Array.from({length: Math.round(hotel.rating)}, (_,i)=><span key={i}>★</span>)}
              {Array.from({length: 5-Math.round(hotel.rating)},(_,i)=><span key={i}>☆</span>)}
              ({hotel.rating})
            </div>
            <div>Review: "{hotel.review}"</div>
            <div>Price: <b>₹{hotel.price}/month</b></div>
            <button onClick={()=>handleBook(idx)} disabled={booked.includes(idx)}>
              {booked.includes(idx) ? "Booked" : "Book Now"}
            </button>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  function doLogout() { setUser(null); }
  return user
    ? <HotelList user={user} logout={doLogout} />
    : <Login onLogin={setUser} />;
}

ReactDOM.render(<App />, document.getElementById('root'));
