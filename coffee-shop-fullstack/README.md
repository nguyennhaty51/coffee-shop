# Cà Phê Ẩn — Hệ thống quản lý quán cà phê

Dự án full-stack cho đồ án Phân tích & Thiết kế Hệ thống, khớp với 6 tác nhân
nội bộ (Quản trị viên, Quản lý, Phục vụ, Thu ngân, Pha chế, Nhân viên kho) và
tác nhân Khách hàng (đặt món qua mã QR, không cần tài khoản).

- **Backend**: Node.js + Express + SQLite (CSDL quan hệ dạng file)
- **Frontend**: React + Vite + Tailwind CSS — giao diện responsive, mở được
  trên máy tính, tablet và điện thoại (sidebar tự chuyển thành drawer trượt
  trên màn hình nhỏ, bảng biểu tự cuộn ngang, lưới món tự co giãn số cột)

```
coffee-shop-fullstack/
├── server/
│   ├── src/
│   │   ├── schema.sql          Cấu trúc bảng CSDL (9 bảng)
│   │   ├── seed.js             Dữ liệu mẫu + 7 tài khoản nhân viên demo
│   │   ├── db.js                Kết nối + khởi tạo CSDL
│   │   ├── state.js              Gom dữ liệu + tính toán báo cáo
│   │   ├── app.js                 Cấu hình Express (routes, CORS, static)
│   │   ├── index.js                Điểm khởi chạy server
│   │   ├── auth/                    JWT + middleware phân quyền theo vai trò
│   │   ├── ai/suggest.js              Trợ lý AI (Gemini thật hoặc fallback theo luật)
│   │   └── routes/                     tables, orders, menu, ingredients, staff,
│   │                                    customers, auth, public (không cần đăng nhập)
│   └── data/coffeeshop.db       File CSDL SQLite (tự tạo khi chạy lần đầu)
│
└── client/
    ├── public/images/menu/      12 ảnh minh hoạ món (tự tạo, không cần internet)
    └── src/
        ├── hooks/useAuth.js          Đăng nhập / đăng xuất / giữ phiên
        ├── hooks/useShopState.js     Gọi API backend (đính token) + state giao diện
        ├── views/Login.jsx           Màn hình đăng nhập
        ├── views/PublicOrderMenu.jsx  Trang khách quét QR — xem menu, đặt món, chatbot AI
        ├── views/                     Dashboard, Sơ đồ bàn, POS, Bếp, Thanh toán,
        │                              Thực đơn, Kho, Nhân viên, Khách hàng thân thiết
        └── components/                Sidebar (responsive), Topbar, ChatWidget nội bộ,
                                        AiChatWidget (công khai)
```

---

## 1. Yêu cầu môi trường

- **Node.js 18 trở lên** (khuyến nghị 20/22) — https://nodejs.org
- Không cần cài MySQL/PostgreSQL — CSDL SQLite lưu trong 1 file.

## 2. Cài đặt

```bash
cd server && npm install
cd ../client && npm install
```

## 3. Chạy ở môi trường phát triển (2 tiến trình)

**Terminal 1 — backend (cổng 4000):**
```bash
cd server
npm run dev
```
Lần đầu chạy sẽ tự tạo `server/data/coffeeshop.db` và nạp sẵn dữ liệu mẫu.

**Terminal 2 — frontend (cổng 5173):**
```bash
cd client
npm run dev
```
Mở trình duyệt tại địa chỉ Vite hiển thị (thường `http://localhost:5173`).
Trên điện thoại/tablet cùng mạng LAN, có thể truy cập qua địa chỉ IP máy chạy
`npm run dev -- --host` để test giao diện responsive trên thiết bị thật.

## 4. Tài khoản demo (6 vai trò)

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin` | `admin123` |
| Quản lý | `manager` | `manager123` |
| Nhân viên phục vụ | `phucvu` | `phucvu123` |
| Nhân viên thu ngân | `thungan` | `thungan123` |
| Nhân viên pha chế | `phache` | `phache123` |
| Nhân viên kho | `khonl` | `khonl123` |

Tài khoản `huy` (mật khẩu `huy123`) bị khoá sẵn — dùng để demo tính năng
khoá/mở khoá tài khoản (chỉ Quản trị viên được thao tác).

Trang đăng nhập có nút **"Là khách hàng? Xem thực đơn không cần đăng nhập"**
để thử trang đặt món công khai mà không cần quét QR thật.

## 5. Đặt món qua mã QR (tác nhân Khách hàng)

- Đăng nhập bằng `admin` hoặc `manager` → vào **Sơ đồ bàn & Gọi món** → (tính
  năng sinh mã QR cho từng bàn nằm ở API `GET /api/tables/:id/order-qr`, gọi
  trực tiếp hoặc tích hợp thêm nút bấm nếu muốn in mã ra dán tại bàn thật).
- Hoặc test nhanh: mở `http://localhost:5173/?table=t1` (thay `t1` bằng ID bàn
  bất kỳ trong `server/src/seed.js`) — vào thẳng trang đặt món của bàn đó,
  không cần đăng nhập, giỏ hàng gửi thẳng vào order thật của bàn.

## 6. Trợ lý AI gợi ý món

Mặc định trợ lý AI dùng **bộ gợi ý theo luật** (không cần cấu hình gì thêm).
Muốn dùng Gemini thật (kể cả phân tích ảnh khách gửi lên):

1. Lấy API key miễn phí tại https://aistudio.google.com/
2. Tạo file `server/.env` từ `server/.env.example`, điền `GEMINI_API_KEY=...`
3. Khởi động lại server — trợ lý sẽ tự chuyển sang chế độ Gemini (hiển thị
   badge "Đang dùng Gemini AI" trong khung chat).

API key chỉ nằm ở server, **không** bao giờ gửi về trình duyệt.

## 7. Reset dữ liệu về trạng thái demo ban đầu

```bash
cd server
npm run seed:reset
```
Sau đó khởi động lại `npm run dev`.

## 8. Build & triển khai production

```bash
cd client && npm run build      # tạo client/dist
cd ../server && npm start       # server tự phục vụ luôn client/dist
```
Chỉ cần **một server duy nhất** chạy ở `http://localhost:4000` (hoặc domain
thật khi deploy). Xem thêm ghi chú triển khai (pm2, reverse proxy, tách riêng
frontend/backend...) ở cuối file này.

### Biến môi trường quan trọng khi deploy (`server/.env`)
```
JWT_SECRET=...          # BẮT BUỘC đổi khác giá trị mặc định
GEMINI_API_KEY=...      # tuỳ chọn
PUBLIC_APP_URL=https://domain-that-cua-ban.com   # để sinh đúng link QR
```

---

## 9. Phân quyền theo vai trò (tương ứng 13 nhóm Use Case trong báo cáo)

| Vai trò | Được truy cập |
|---|---|
| Quản trị viên (admin) | Toàn bộ hệ thống, kể cả khoá/mở khoá tài khoản |
| Quản lý (manager) | Toàn bộ trừ khoá/mở khoá tài khoản nhân viên |
| Nhân viên phục vụ (staff) | Sơ đồ bàn, gọi món, khách hàng thân thiết |
| Nhân viên thu ngân (cashier) | Thanh toán, hoá đơn, khách hàng thân thiết |
| Nhân viên pha chế (barista) | Màn hình bếp — nhận & hoàn thành món |
| Nhân viên kho (warehouse) | Kho nguyên liệu — nhập/xuất kho |
| Khách hàng | Trang QR công khai — xem menu, đặt món, tra điểm, chat AI |

Mỗi lần gọi API, backend kiểm tra token JWT rồi đối chiếu `role_key` với danh
sách vai trò được phép của từng route (`server/src/auth/middleware.js`) — sai
vai trò sẽ nhận lỗi `403 Forbidden`, đã kiểm thử với cả 6 tài khoản.

## 10. Ghi chú thiết kế hệ thống

- **Đồng bộ dữ liệu kiểu "refetch"**: sau mỗi thao tác, frontend gọi lại
  `GET /api/state` lấy toàn bộ dữ liệu mới — đơn giản, dễ debug, phù hợp quy
  mô đồ án.
- **Trang QR khách hàng** dùng API riêng (`/api/public/*`) không cần JWT, tách
  biệt hoàn toàn khỏi hệ phân quyền nội bộ — đúng với việc Khách hàng không có
  tài khoản trong hệ thống.
- **Trợ lý AI** có cơ chế "Offline Fallback": tự chuyển sang gợi ý theo luật
  khi chưa cấu hình API key hoặc khi gọi Gemini thất bại, tránh hệ thống bị
  treo.
- **CSDL SQLite** phù hợp một quán/chi nhánh đơn lẻ; nếu mở rộng thành chuỗi
  nhiều chi nhánh hoạt động đồng thời, nên cân nhắc PostgreSQL/MySQL.

## 11. Triển khai (Deployment) chi tiết

### Một server duy nhất (khuyến nghị)
1. Cài Node.js trên máy chủ (VPS/Render/Railway...).
2. Copy toàn bộ thư mục dự án lên server.
3. `cd client && npm install && npm run build`
4. `cd ../server && npm install && npm start` (hoặc dùng `pm2 start src/index.js --name coffee-shop`)
5. Cấu hình reverse proxy (Nginx/Caddy) trỏ domain về cổng server (mặc định 4000).
6. Đảm bảo thư mục `server/data` được lưu trên ổ đĩa bền vững (không bị xoá khi container khởi động lại).

### Tách riêng frontend/backend
- Deploy `server/` như trên, ghi nhớ URL (VD: `https://api.domain.com`).
- Trong `client/.env`, đặt `VITE_API_URL=https://api.domain.com`, build rồi
  deploy `client/dist` lên Vercel/Netlify/Nginx tĩnh. CORS đã mở sẵn ở backend
  nên gọi API từ domain khác vẫn hoạt động bình thường.
