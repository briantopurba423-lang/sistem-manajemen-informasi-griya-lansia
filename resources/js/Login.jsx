import React, { useState } from "react";
import axios from "axios";
import {
  HeartPulse,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  ArrowRight,
  Leaf,
} from "lucide-react";
import "../css/Login.css";

const roles = [
  {
    id: "admin",
    title: "Admin",
    description: "Manajemen sistem",
    icon: ShieldCheck,
  },
  {
    id: "perawat",
    title: "Perawat / Staff",
    description: "Pelayanan lansia",
    icon: Stethoscope,
  },
  {
    id: "keluarga",
    title: "Keluarga",
    description: "Pantau orang terkasih",
    icon: UsersRound,
  },
];

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", { email, password, role });
      const { user, token } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      const destinations = {
        admin: "/admin/dashboard",
        perawat: "/perawat/dashboard",
        keluarga: "/keluarga/dashboard",
      };

      window.location.href = destinations[user.role] ?? "/";
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(data?.message ?? "Tidak dapat terhubung ke server. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <nav className="brand">
          <div className="brand-icon">
            <HeartPulse size={28} />
          </div>
          <div>
            <h2>Griya<span>Lansia</span></h2>
            <p>CARE • COMFORT • COMPASSION</p>
          </div>
        </nav>

        <div className="visual-content">
          <span className="eyebrow">
            <Leaf size={15} /> CARE WITH HEART
          </span>
          <h1>
            Merawat dengan
            <br />
            <span>sepenuh hati.</span>
          </h1>
          <p className="visual-description">
            Satu ruang digital untuk memberikan pelayanan terbaik,
            memantau kesehatan, dan menjaga kebahagiaan setiap lansia.
          </p>
          <div className="care-note">
            <div className="care-note-icon">
              <HeartPulse size={23} />
            </div>
            <div>
              <strong>Setiap lansia berarti.</strong>
              <p>Perawatan penuh perhatian, setiap hari.</p>
            </div>
          </div>
        </div>

        <p className="visual-footer">© 2026 Griya Lansia · Sistem Informasi Manajemen</p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand">
            <HeartPulse size={26} />
            <strong>Griya Lansia</strong>
          </div>

          <div className="welcome">
            <span className="welcome-label">SELAMAT DATANG</span>
            <h2>Masuk ke akun Anda</h2>
            <p>Silakan masuk untuk mengakses layanan Griya Lansia.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label className="field-label">Masuk sebagai</label>

            <div className="role-options">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`role-option${role === item.id ? " selected" : ""}`}
                    onClick={() => setRole(item.id)}
                    aria-pressed={role === item.id}
                  >
                    <Icon size={21} />
                    <span className="role-title">{item.title}</span>
                    <span className="role-description">{item.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-field">
              <label htmlFor="email">Alamat email</label>
              <div className="input-wrapper">
                <Mail size={19} />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Kata sandi</label>
              <div className="input-wrapper">
                <LockKeyhole size={19} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={18} />
            <span>Akses aman untuk pengguna terdaftar</span>
          </div>

          <p className="login-help">
            Butuh bantuan masuk? Hubungi administrator sistem.
          </p>
        </div>
      </section>
    </main>
  );
}
