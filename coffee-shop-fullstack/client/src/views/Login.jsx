import { useState } from "react";
import { Coffee, LogIn, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", label: "Quản trị viên — toàn quyền" },
  { username: "manager", password: "manager123", label: "Quản lý" },
  { username: "phucvu", password: "phucvu123", label: "Nhân viên phục vụ" },
  { username: "thungan", password: "thungan123", label: "Nhân viên thu ngân" },
  { username: "phache", password: "phache123", label: "Nhân viên pha chế" },
  { username: "khonl", password: "khonl123", label: "Nhân viên kho" },
];

export default function Login({ onLogin, error, onShowPublicMenu }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    await onLogin(username, password);
    setSubmitting(false);
  }

  function fillDemo(acc) {
    setUsername(acc.username);
    setPassword(acc.password);
  }

  return (
    <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-700 flex items-center justify-center mx-auto mb-3">
            <Coffee size={26} className="text-amber-100" />
          </div>
          <div className="font-serif text-xl sm:text-2xl text-stone-800">Cà Phê Ẩn</div>
          <div className="text-sm text-stone-500 mt-1">Đăng nhập hệ thống quản lý</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Tên đăng nhập</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              placeholder="VD: admin"
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            <LogIn size={16} /> {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => setShowDemo((v) => !v)}
            className="w-full flex items-center justify-between text-xs text-stone-500 px-1 py-2 hover:text-stone-700"
          >
            <span>Tài khoản demo để dùng thử (6 vai trò)</span>
            {showDemo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showDemo && (
            <div className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100 overflow-hidden">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-stone-50 text-left"
                >
                  <span className="text-stone-600">{acc.label}</span>
                  <span className="text-stone-400 font-mono">{acc.username}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onShowPublicMenu}
          className="w-full text-center text-sm text-amber-700 hover:text-amber-800 mt-6 underline underline-offset-2"
        >
          Là khách hàng? Xem thực đơn không cần đăng nhập →
        </button>
      </div>
    </div>
  );
}
