import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken } from "../auth/jwt.js";
import { requireAuth } from "../auth/middleware.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Vui lòng nhập tên đăng nhập và mật khẩu" });

  const staff = db.prepare("SELECT * FROM staff WHERE username = ?").get(username);
  if (!staff) return res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
  if (!staff.active) return res.status(403).json({ error: "Tài khoản đã bị khoá. Vui lòng liên hệ Quản trị viên." });

  const ok = bcrypt.compareSync(password, staff.password_hash || "");
  if (!ok) return res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });

  const token = signToken({ staffId: staff.id, roleKey: staff.role_key });
  res.json({ token, user: { id: staff.id, name: staff.name, role: staff.role, roleKey: staff.role_key } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, role: req.user.role, roleKey: req.user.roleKey } });
});

export default router;
