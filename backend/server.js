require("dotenv").config();
console.log("🚀 THIS SERVER FILE IS RUNNING");

const driver = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 ENV DEBUG
console.log("ENV CHECK:");
console.log("URI:", process.env.NEO4J_URI);
console.log("USER:", process.env.NEO4J_USERNAME);
console.log("PASS:", process.env.NEO4J_PASSWORD ? "Password exists" : "No password");

// 📌 Request logger
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  console.log("ROOT HIT");
  res.send("Backend working");
});

// ✅ GET USERS
app.get("/users", async (req, res) => {
  const session = driver.session({ database: "b37be966" }); // ✅ FIXED

  try {
    const result = await session.run("MATCH (u:User) RETURN u");

    const users = result.records.map((record) =>
      record.get("u").properties
    );

    res.json(users);
  } catch (error) {
    console.error("❌ /users error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// ✅ ADD USER
app.post("/add-user", async (req, res) => {
  const { name, skill } = req.body;

  const session = driver.session({ database: "b37be966" }); // ✅ FIXED

  try {
    await session.run(
      "MERGE (u:User {name: $name, skill: $skill})",
      { name, skill }
    );

    res.json({ message: "User added successfully 🚀" });
  } catch (error) {
    console.error("❌ /add-user error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// ✅ MATCH USERS
app.get("/match/:skill", async (req, res) => {
  const skill = req.params.skill;

  const session = driver.session({ database: "b37be966" }); // ✅ FIXED

  try {
    const result = await session.run(
      "MATCH (u:User) WHERE toLower(u.skill) = toLower($skill) RETURN u",
      { skill }
    );

    const users = result.records.map((record) =>
      record.get("u").properties
    );

    res.json(users);
  } catch (error) {
    console.error("❌ /match error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// ✅ DASHBOARD
app.get("/dashboard", async (req, res) => {
  const session = driver.session({ database: "b37be966" }); // ✅ FIXED

  try {
    const result = await session.run("MATCH (u:User) RETURN u");

    const usersMap = new Map();
    result.records.forEach((r) => {
      const u = r.get("u").properties;
      usersMap.set(u.name + u.skill, u);
    });

    const users = Array.from(usersMap.values());

    const html = `
    <html>
      <head>
        <title>Peer Connect Dashboard</title>
      </head>
      <body>
        <h1>🚀 Peer Connect Dashboard</h1>
        ${users.map(u => `<p>${u.name} - ${u.skill}</p>`).join("")}
      </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /dashboard error:", err);
    res.send("Error loading dashboard");
  } finally {
    await session.close();
  }
});

// 🚀 START SERVER
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Prevent Render shutdown
setInterval(() => {}, 1000);