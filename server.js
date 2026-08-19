const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SITE_PASSWORD || !process.env.SESSION_SECRET) {
  console.warn(
    "경고: SITE_PASSWORD 또는 SESSION_SECRET 환경변수가 없습니다. " +
    "Render 배포 전에 반드시 설정하세요."
  );
}

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "restaurant_session",
    keys: [process.env.SESSION_SECRET || "development-only-secret"],
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  })
);

function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn === true) {
    return next();
  }

  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
  }

  return res.redirect("/");
}

// 로그인 화면
app.get("/", (req, res) => {
  if (req.session && req.session.loggedIn === true) {
    return res.redirect("/restaurants");
  }

  return res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 로그인 처리
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

// 로그인된 사용자만 메인 페이지 접근
app.get("/restaurants", requireLogin, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 로그인된 사용자만 JSON 데이터 접근
app.get("/api/restaurants", requireLogin, (req, res) => {
  try {
    const dataPath = path.join(__dirname, "restaurants.json");
    const raw = fs.readFileSync(dataPath, "utf8");
    const restaurants = JSON.parse(raw);

    return res.json({
      success: true,
      base_location: "수원역",
      updated_at: "2026-08-19",
      restaurants
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "식당 데이터를 불러오지 못했습니다."
    });
  }
});

// 로그아웃
app.post("/logout", (req, res) => {
  req.session = null;
  return res.json({ success: true });
});

// 상태 확인용
app.get("/health", (req, res) => {
  return res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
