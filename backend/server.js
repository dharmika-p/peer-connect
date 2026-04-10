console.log("🚀 THIS SERVER FILE IS RUNNING");
const driver = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// log middleware
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// test route
app.get("/users", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (u:User) RETURN u");

    const users = result.records.map(record =>
      record.get("u").properties
    );

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
  } finally {
    await session.close();
  }
});
app.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.send("Backend working");
  });

// ✅ add-user route
app.post("/add-user", async (req, res) => {
  const { name, skill } = req.body;

  const session = driver.session();

  try {
    await session.run(
      "MERGE (u:User {name: $name, skill: $skill})",
      { name, skill }
    );

    res.send("User added to Neo4j 🚀");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding user");
  } finally {
    await session.close();
  }
});

app.get("/match/:skill", async (req, res) => {
    const skill = req.params.skill;
  
    const session = driver.session();
  
    try {
      const result = await session.run(
        "MATCH (u:User) WHERE toLower(u.skill) = toLower($skill) RETURN u",
        { skill }
      );
  
      const users = result.records.map(record =>
        record.get("u").properties
      );
  
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching users");
    } finally {
      await session.close();
    }
  });
  app.get("/dashboard", async (req, res) => {
    const session = driver.session();
  
    try {
      const result = await session.run("MATCH (u:User) RETURN u");
  
      // remove duplicates
      const usersMap = new Map();
      result.records.forEach(r => {
        const u = r.get("u").properties;
        usersMap.set(u.name + u.skill, u);
      });
  
      const users = Array.from(usersMap.values());
  
      const html = `
      <html>
        <head>
          <title>Peer Connect Dashboard</title>
          <style>
            body {
              font-family: Arial;
              background: linear-gradient(to right, #e3f2fd, #fce4ec);
              padding: 20px;
            }
            h1 {
              text-align: center;
            }
            .container {
              max-width: 500px;
              margin: auto;
            }
            .card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .user {
              padding: 12px;
              margin: 10px 0;
              background: #e3f2fd;
              border-radius: 6px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>🚀 Peer Connect Dashboard</h1>
          <div class="container">
            <div class="card">
              ${users
                .map(u => `<div class="user">${u.name} - ${u.skill}</div>`)
                .join("")}
            </div>
          </div>
        </body>
      </html>
      `;
  
      res.send(html);
    } catch (err) {
      console.log(err);
      res.send("Error loading dashboard");
    } finally {
      await session.close();
    }
  });

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
setInterval(() => {}, 1000);