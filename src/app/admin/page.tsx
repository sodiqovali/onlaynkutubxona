"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import "./admin.css";
import { ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, CloudUpload, FileText, Gauge, Globe2, LayoutDashboard, LogOut, Plus, Search, ShieldCheck, Sparkles, Upload, X } from "lucide-react";

type AdminBook = { id: string; title: string; slug: string; author: string; description: string; category: string; price: number; language: string; year: number | null; coverUrl: string | null; fileName: string; fileSize: number; published: boolean; createdAt: string };
const money = (value: number) => `${new Intl.NumberFormat("uz-UZ").format(value)} so'm`;
const fileSize = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"overview" | "books">("overview");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadBooks() {
    const response = await fetch("/api/admin/books", { cache: "no-store" });
    if (response.status === 401) { setAuthorized(false); return; }
    const result = await response.json();
    if (response.ok) { setBooks(result.data); setAuthorized(true); }
  }

  useEffect(() => { loadBooks().finally(() => setChecking(false)); }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kirish amalga oshmadi");
      setAuthorized(true); setPassword(""); await loadBooks();
    } catch (e) { setError(e instanceof Error ? e.message : "Xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthorized(false); setBooks([]); }

  async function submitBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    const form = new FormData(event.currentTarget);
    if (selectedFile) form.set("file", selectedFile);
    try {
      const response = await fetch("/api/admin/books", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kitob saqlanmadi");
      setSuccess(`“${result.data.title}” kitobi saqlandi`); setSelectedFile(null); setShowForm(false);
      (event.currentTarget as HTMLFormElement).reset(); await loadBooks();
    } catch (e) { setError(e instanceof Error ? e.message : "Xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(search.toLowerCase())), [books, search]);

  if (checking) return <div className="admin-loading"><span className="loading-orb"/>Kutubxona boshqaruv paneli yuklanmoqda...</div>;
  if (!authorized) return <main className="admin-login"><div className="login-art"><a className="admin-brand" href="/"><span><BookOpen size={21}/></span> kitobzor<span className="admin-brand-dot">.</span></a><div className="login-quote"><div className="quote-stars">✳　 ✳　 ✳</div><h1>Har bir kitob —<br/>yangi bir <em>olam.</em></h1><p>Kitoblaringizni bir joyda boshqaring.<br/>Kitobxonlarga yangi bilim eshiklarini oching.</p><div className="login-art-book"><span>✳</span><b>SO'ZLAR<br/>OLAMI</b><small>KITOBZOR NASHRI</small></div></div><small className="login-copy">KITOBZOR · ADMIN PANEL</small></div><div className="login-side"><form className="login-form" onSubmit={login}><div className="login-icon"><ShieldCheck size={22}/></div><span className="admin-kicker">XUSH KELIBSIZ</span><h2>Admin panelga<br/>kiring.</h2><p>Davom etish uchun admin parolini kiriting.</p>{error && <div className="admin-error"><X size={15}/>{error}</div>}<label htmlFor="admin-password">Admin paroli</label><input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parolingizni kiriting" autoComplete="current-password" required/><button className="admin-primary login-submit" disabled={busy}>{busy ? "Tekshirilmoqda..." : <>Xavfsiz kirish <ArrowUpRight size={16}/></>}</button><div className="login-secure"><ShieldCheck size={14}/> Himoyalangan administrator kirishi</div></form><a className="back-home" href="/">← Bosh sahifaga qaytish</a></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><a className="admin-brand" href="/"><span><BookOpen size={20}/></span> kitobzor<span className="admin-brand-dot">.</span></a><div className="sidebar-label">ISH MAYDONI</div><button className={view === "overview" ? "side-link selected" : "side-link"} onClick={() => setView("overview")}><LayoutDashboard size={17}/> Umumiy ko'rinish</button><button className={view === "books" ? "side-link selected" : "side-link"} onClick={() => setView("books")}><BookOpen size={17}/> Kitoblar <span className="side-count">{books.length}</span></button><div className="sidebar-label sidebar-label-second">TIZIM</div><a className="side-link" href="/" target="_blank"><Globe2 size={17}/> Saytni ko'rish <ArrowUpRight className="side-external" size={13}/></a><div className="sidebar-bottom"><div className="storage-note"><span><ShieldCheck size={14}/> Fayllar himoyalangan</span><small>Kitob fayllari ommaviy emas</small></div><button className="side-link logout-link" onClick={logout}><LogOut size={16}/> Chiqish</button><small className="sidebar-version">KITOBZOR ADMIN · V1.0</small></div></aside>
    <section className="admin-main"><header className="admin-topbar"><div className="breadcrumb">Boshqaruv <span>/</span> <b>{view === "overview" ? "Umumiy ko'rinish" : "Kitoblar"}</b></div><div className="admin-top-actions"><a className="store-link" href="/" target="_blank">Do'konni ochish <ArrowUpRight size={14}/></a><div className="admin-avatar">K</div><div className="admin-user"><b>Administrator</b><small>Do'kon egasi</small></div></div></header>
      <div className="admin-content">{success && <div className="admin-success"><Check size={17}/>{success}<button onClick={() => setSuccess("")}><X size={15}/></button></div>}{error && <div className="admin-error global-error"><X size={15}/>{error}<button onClick={() => setError("")}><X size={14}/></button></div>}
        <div className="admin-page-heading"><div><div className="admin-kicker"><Sparkles size={13}/> KITOBZOR BOSHQARUVI</div><h1>{view === "overview" ? "Xush kelibsiz." : "Kitoblar"}</h1><p>{view === "overview" ? "Kutubxonangiz bugun qanday?" : "Raqamli kutubxonangizdagi barcha kitoblarni boshqaring."}</p></div><button className="admin-primary" onClick={() => { setView("books"); setShowForm(true); }}><Plus size={17}/> Yangi kitob qo'shish</button></div>

        {view === "overview" && <><div className="admin-stats"><article className="stat-card"><div className="stat-top"><span>JAMI KITOBLAR</span><i><BookOpen size={17}/></i></div><strong>{books.length}</strong><small>kutubxonadagi asarlar</small></article><article className="stat-card"><div className="stat-top"><span>DO'KONDA KO'RINADI</span><i className="stat-green"><Globe2 size={17}/></i></div><strong>{books.filter((book) => book.published).length}</strong><small>kitobxonlar uchun ochiq</small></article><article className="stat-card"><div className="stat-top"><span>SAQLANGAN HAJM</span><i className="stat-gold"><CloudUpload size={17}/></i></div><strong>{fileSize(books.reduce((sum, book) => sum + book.fileSize, 0))}</strong><small>kitob fayllari</small></article><article className="stat-card stat-tip"><div className="stat-top"><span>KEYINGI QADAM</span><i><Gauge size={17}/></i></div><strong className="tip-title">Kutubxonani boyiting</strong><small>PDF yoki EPUB kitoblaringizni yuklang.</small><button onClick={() => setShowForm(true)}>Kitob yuklash <ArrowUpRight size={13}/></button></article></div>
          <div className="admin-panel-card"><div className="panel-heading"><div><h2>Oxirgi qo'shilgan kitoblar</h2><p>Yaqinda kutubxonaga yuklangan asarlar</p></div><button className="subtle-button" onClick={() => setView("books")}>Barcha kitoblar <ArrowUpRight size={14}/></button></div><BookTable books={visibleBooks.slice(0, 5)}/></div>
          <div className="admin-help"><span><CircleHelp size={18}/></span><div><b>Kitob yuklash bo'yicha yordam kerakmi?</b><small>PDF yoki EPUB formatidagi fayllar, 30 MB gacha.</small></div><button onClick={() => setShowForm(true)}>Birinchi kitobni qo'shing <ArrowUpRight size={14}/></button></div></>}

        {view === "books" && <div className="admin-panel-card books-panel"><div className="panel-heading"><div><h2>Kutubxonadagi kitoblar</h2><p>{books.length} ta asar · {books.filter((book) => book.published).length} tasi do'konda ko'rinadi</p></div><label className="admin-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kitob yoki muallif qidirish"/></label></div><BookTable books={visibleBooks}/>{visibleBooks.length === 0 && <div className="no-books"><BookOpen size={26}/><b>{search ? "Mos kitob topilmadi" : "Hali kitob qo'shilmagan"}</b><span>{search ? "Qidiruv so'zini o'zgartirib ko'ring." : "Birinchi kitobingizni yuklashdan boshlang."}</span>{!search && <button className="admin-primary" onClick={() => setShowForm(true)}><Plus size={15}/> Kitob qo'shish</button>}</div>}</div>}
      </div><footer className="admin-footer"><span>© 2025 Kitobzor</span><span>Elektron kitoblar do'koningiz, bir joyda.</span></footer></section>

    {showForm && <div className="form-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) setShowForm(false); }}><form className="book-form" onSubmit={submitBook}><header className="form-header"><div><div className="admin-kicker">KATALOGNI BOYITING</div><h2>Yangi kitob qo'shish</h2><p>Kitob ma'lumotlarini kiriting va faylni yuklang.</p></div><button type="button" className="form-close" onClick={() => setShowForm(false)}><X size={19}/></button></header><div className="form-body">{error && <div className="admin-error"><X size={15}/>{error}</div>}<div className="form-section-title"><span>01</span><b>Kitob haqida</b><i/></div><div className="form-grid"><label className="form-field full-field">Kitob nomi <em>*</em><input name="title" placeholder="Masalan, O'tkan kunlar" required maxLength={180}/></label><label className="form-field">Muallif <em>*</em><input name="author" placeholder="Muallifning ism-familiyasi" required maxLength={140}/></label><label className="form-field">Turkum <em>*</em><span className="select-wrap"><select name="category" defaultValue="" required><option value="" disabled>Turkumni tanlang</option>{["Klassika", "Roman", "Sarguzasht", "Hikoya", "Jahon adabiyoti", "Shaxsiy rivojlanish", "Bolalar adabiyoti", "Tarix", "Boshqa"].map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={15}/></span></label><label className="form-field full-field">Qisqacha tavsif <em>*</em><textarea name="description" placeholder="Kitob haqida kitobxonlar bilishi kerak bo'lgan ma'lumot..." rows={3} required maxLength={2000}/></label><label className="form-field">Narxi, so'm <em>*</em><input name="price" type="number" min="0" step="1000" placeholder="29000" required/></label><label className="form-field">Nashr yili<span className="optional">ixtiyoriy</span><input name="year" type="number" min="1000" max={new Date().getFullYear()} placeholder="2024"/></label><label className="form-field">Kitob tili<span className="select-wrap"><select name="language" defaultValue="uz"><option value="uz">O'zbekcha</option><option value="ru">Русский</option><option value="en">English</option><option value="kaa">Qoraqalpoqcha</option></select><ChevronDown size={15}/></span></label><label className="form-field">Muqova rasmi havolasi<span className="optional">ixtiyoriy</span><input name="coverUrl" type="url" placeholder="https://..."/></label></div><div className="form-section-title file-section-title"><span>02</span><b>Elektron kitob fayli</b><i/></div><label className={selectedFile ? "dropzone has-file" : "dropzone"} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) { const input = e.currentTarget.querySelector("input[type=file]"); if (input) { const transfer = new DataTransfer(); transfer.items.add(file); (input as HTMLInputElement).files = transfer.files; } setSelectedFile(file); } }}><input type="file" name="file" accept=".pdf,.epub,application/pdf,application/epub+zip" required onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedFile(e.target.files?.[0] ?? null)}/>{selectedFile ? <><span className="upload-symbol"><FileText size={22}/></span><span className="drop-main">{selectedFile.name}</span><span className="drop-sub">{fileSize(selectedFile.size)} · Yangi fayl tanlash uchun bosing</span></> : <><span className="upload-symbol"><Upload size={21}/></span><span className="drop-main">Faylni shu yerga tashlang yoki <b>tanlang</b></span><span className="drop-sub">PDF yoki EPUB · maksimal hajmi 30 MB</span></>}</label><div className="private-hint"><ShieldCheck size={15}/><span>Fayl maxfiy server papkasida saqlanadi. Xarid va yuklab olish oqimi hali ulanmagan.</span></div><label className="publish-check"><input type="checkbox" name="published" defaultChecked/><span><b>Kitobni do'konda nashr qilish</b><small>Faol bo'lsa, katalogda darhol ko'rinadi.</small></span></label></div><div className="form-actions"><button type="button" className="cancel-button" disabled={busy} onClick={() => setShowForm(false)}>Bekor qilish</button><button className="admin-primary" disabled={busy}><Upload size={16}/>{busy ? "Kitob saqlanmoqda..." : "Kitobni saqlash"}</button></div></form></div>}
  </main>;
}

function BookTable({ books }: { books: AdminBook[] }) {
  return <div className="book-table-wrap"><table className="book-table"><thead><tr><th>KITOB</th><th>TURKUM</th><th>NARXI</th><th>FAYL</th><th>HOLATI</th></tr></thead><tbody>{books.map((book) => <tr key={book.id}><td><div className="table-book"><div className="table-cover"><BookOpen size={18}/></div><span><b>{book.title}</b><small>{book.author}</small></span></div></td><td><span className="table-category">{book.category}</span></td><td className="table-price">{money(book.price)}</td><td><span className="file-type"><FileText size={13}/>{book.fileName.split(".").pop()?.toUpperCase()} <small>{fileSize(book.fileSize)}</small></span></td><td><span className={book.published ? "status-pill published" : "status-pill draft"}><i/>{book.published ? "Do'konda" : "Qoralama"}</span></td></tr>)}</tbody></table></div>;
}
