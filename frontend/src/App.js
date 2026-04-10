import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const addUser = async () => {
    if (!name || !skill) {
      showMessage("⚠️ Please enter name and skill");
      return;
    }

    await fetch("https://peer-connect-backend-dccs.onrender.com/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, skill }),
    });

    showMessage("✅ User added successfully!");
    getAllUsers();
  };

  const findMatch = async () => {
    if (!skill) {
      showMessage("⚠️ Enter a skill to find matches");
      return;
    }

    const res = await fetch(`https://peer-connect-backend-dccs.onrender.com/match/${skill}`);
    const data = await res.json();
    setMatches(data);

    if (data.length === 0) {
      showMessage("❌ No matches found");
    } else {
      showMessage(`🎉 Found ${data.length} match(es)!`);
    }
  };

  const getAllUsers = async () => {
    const res = await fetch("https://peer-connect-backend-dccs.onrender.com/users");
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div className="page">
      {/* TOAST MESSAGE */}
      {message && <div className="toast">{message}</div>}

      {/* 🔥 TOP SECTION */}
      <div className="top-bar">
        <div className="glow-line"></div>
        <p className="top-subtitle">
          🌐 Connect • Collaborate • Grow
        </p>
      </div>

      <div className="container">
        {/* LEFT PANEL */}
        <div className="card main-card">
          <h1 className="title">🚀 Peer Connect</h1>

          <p className="helper-text">
            ⚡ Add your skills and discover peers instantly
          </p>

          <input
            className="input"
            placeholder="👤 Enter Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="💻 Enter Skill"
            onChange={(e) => setSkill(e.target.value)}
          />

          <div className="button-group">
            <button className="btn primary" onClick={addUser}>
              ➕ Add
            </button>

            <button className="btn success" onClick={findMatch}>
              🔍 Match
            </button>

            <button className="btn secondary" onClick={getAllUsers}>
              👥 Users
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="side-panel">
          <div className="card small">
            <h2>👥 Users</h2>
            <div className="list">
              {users.map((u, i) => (
                <div key={i} className="card-item">
                  {u.name} — {u.skill}
                </div>
              ))}
            </div>
          </div>

          <div className="card small">
            <h2>🤝 Matches</h2>
            <div className="list">
              {matches.map((u, i) => (
                <div key={i} className="card-item match">
                  {u.name} — {u.skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 💙 FOOTER */}
      <div className="footer">
        Made with <span className="heart">💙</span> by Dharmika
      </div>
    </div>
  );
}

export default App;