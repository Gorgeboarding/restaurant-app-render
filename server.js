const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(express.json());

app.use(cookieSession({
  name: "restaurant_session",
  keys: [process.env.SESSION_SECRET || "development-only-secret"],
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
}));

function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn === true) return next();

  if (req.path.startsWith("/api/")) {
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다."
    });
  }

  return res.redirect("/");
}

app.get("/", (req, res) => {
  if (req.session && req.session.loggedIn === true) {
    return res.redirect("/restaurants");
  }

  return res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const password = String(req.body.password || "");

  if (password === process.env.SITE_PASSWORD) {
    req.session.loggedIn = true;
    return res.json({ success: true });
  }

  return res.status(401).json({
    success: false,
    message: "비밀번호가 올바르지 않습니다."
  });
});

app.get("/restaurants", requireLogin, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/data", requireLogin, (req, res) => {
  try {
    const locations = JSON.parse(
      fs.readFileSync(path.join(__dirname, "locations.json"), "utf8")
    );

    const restaurants = JSON.parse(
      fs.readFileSync(path.join(__dirname, "restaurants.json"), "utf8")
    );

    return res.json({
      success: true,
      updated_at: "2026-08-19",
      locations,
      restaurants
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "데이터를 불러오지 못했습니다."
    });
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.json({ success: true });
});

app.get("/health", (req, res) => res.status(200).send("OK"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
