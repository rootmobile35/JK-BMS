import React, { useState, useEffect } from "react";
import { Mail, Lock, ShieldCheck, ArrowLeft, KeyRound, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
import { api } from "./lib/apiClient.js";
import { useAuth } from "./context/AuthContext.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";

export default function Login() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "password" | "admin-setup" | "admin-password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  function backToEmail() { setStep("email"); setPassword(""); setError(""); }
  useEffect(() => {
    api
      .adminExists()
      .then(({ exists }) => setAdminExists(exists))
      .catch(() => setAdminExists(true));
  }, []);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { exists } = await api.checkEmail(email.trim());
      if (!exists) {
        setError("ไม่พบบัญชีนี้ในระบบ");
      } else {
        setStep("password");
      }
    } catch {
      setError("เชื่อมต่อระบบไม่ได้ กรุณาลองใหม่");
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.login(email.trim(), password);
      await refresh();
    } catch {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminSetupSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setBusy(true);
    try {
      await api.registerAdmin(email.trim(), password);
      await refresh();
    } catch (err) {
      setError(err.message === "An admin account already exists" ? "มี Admin ในระบบแล้ว" : "ตั้งค่าไม่สำเร็จ ตรวจสอบรหัสผ่านตั้งต้น");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminPasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.adminLogin(password);
      await refresh();
    } catch {
      setError("รหัสผ่านไม่ถูกต้อง");
    } finally {
      setBusy(false);
    }
  }

  function openAdminShortcut() {
    setError("");
    setPassword("");
    setStep(adminExists ? "admin-password" : "admin-setup");
  }

  function backToEmail() {
    setStep("email");
    setPassword("");
    setError("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 px-4 transition-colors duration-300">
      
      {/* Top Left Home Button */}
      <div className="absolute left-6 top-6">
       <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <Home className="size-4" /> หน้าหลัก
        </button>
      </div>

      {/* Top Right Theme Toggle */}
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">JK BMS Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {step === "admin-setup"
              ? "ตั้งค่า Admin ครั้งแรก"
              : step === "admin-password"
                ? "เข้าสู่ระบบ Admin"
                : "เข้าสู่ระบบด้วยอีเมล"}
          </p>
        </div>

        {/* Step: Email */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Mail className="size-4 text-emerald-500" />
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy ? "กำลังตรวจสอบ..." : "ถัดไป"}
            </button>
            <button
              type="button"
              onClick={openAdminShortcut}
              className="flex w-full items-center justify-center gap-1.5 pt-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <KeyRound className="size-3.5" />
              Admin Access
            </button>
          </form>
        )}

        {/* Step: Password */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <button
              type="button"
              onClick={backToEmail}
              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              {email}
            </button>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Lock className="size-4 text-emerald-500" />
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        )}

        {/* Step: Admin Setup */}
        {step === "admin-setup" && (
          <form onSubmit={handleAdminSetupSubmit} className="space-y-4">
            <button
              type="button"
              onClick={backToEmail}
              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              กลับ
            </button>
            <p className="text-xs text-slate-500">
              ใช้ได้ครั้งเดียวตอนยังไม่มี Admin - อีเมลนี้จะกลายเป็นบัญชี Admin ถาวร
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Admin Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Mail className="size-4 text-emerald-500" />
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">รหัสผ่านตั้งต้น</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Lock className="size-4 text-emerald-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy ? "กำลังตั้งค่า..." : "ตั้งค่า Admin"}
            </button>
          </form>
        )}

        {/* Step: Admin Login */}
        {step === "admin-password" && (
          <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
            <button
              type="button"
              onClick={backToEmail}
              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              กลับ
            </button>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Admin Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Lock className="size-4 text-emerald-500" />
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}