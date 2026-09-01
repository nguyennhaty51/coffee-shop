import { Router } from "express";
import { getFullState } from "../state.js";

const router = Router();

// GET /api/state — trả về toàn bộ dữ liệu hệ thống hiện tại.
// Frontend gọi lại API này sau MỖI thao tác thay đổi dữ liệu để đồng bộ giao diện.
// Cách này đơn giản, dễ hiểu, phù hợp quy mô đồ án — không cần đồng bộ realtime phức tạp.
router.get("/", (req, res) => {
  res.json(getFullState());
});

export default router;
