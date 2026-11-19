"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, Heart, Menu, Search, ShoppingBag, SlidersHorizontal, Sparkles, Star, X } from "lucide-react";
import { books, categories, formatPrice, type Book } from "@/lib/books";

export default function Home() {
  const [catalogBooks, setCatalogBooks] = useState<Book[]>(books);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [sort, setSort] = useState("Tavsiya etilgan");
  const [cart, setCart] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" }).then((response) => response.json()).then((result) => {
      if (Array.isArray(result.data) && result.data.length) {
        setCatalogBooks(result.data.map((book: { id: string; title: string; author: string; category: string; description: string; price: number; coverUrl?: string | null }) => ({
          id: book.id, title: book.title, author: book.author, category: book.category, description: book.description,
          price: book.price, cover: book.coverUrl || "📘", color: "#d5dfca", rating: "Yangi",
        })));
      }
    }).catch(() => {});
  }, []);

  const visibleCategories = useMemo(() => [...categories, ...catalogBooks.map((book) => book.category).filter((name) => !categories.includes(name))], [catalogBooks]);
  const shownBooks = useMemo(() => {
    const filtered = catalogBooks.filter((book) => (category === "Barchasi" || book.category === category) && `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Narxi: arzondan") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "Narxi: qimmatdan") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [catalogBooks, category, query, sort]);

  function addToCart(id: string) {
    if (cart.includes(id)) { setNotice("Bu kitob savatda bor"); }
    else { setCart([...cart, id]); setNotice("Kitob savatga qo'shildi"); }
    window.setTimeout(() => setNotice(""), 2400);
  }

  function toggleSaved(id: string) { setSaved(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]); }

  return <main>
    <div className="announcement"><Sparkles size={14} /> Yangi kitoblar — har hafta. O'zingizga yoqqanini bugun toping. <a href="#catalog">Kitoblarni ko'rish <ArrowRight size={13} /></a></div>
    <header className="header">
      <a href="#top" className="brand"><span className="brand-mark"><BookOpen size={20} /></span><span>kitobzor<span className="brand-dot">.</span></span></a>
      <nav className={mobileMenu ? "nav nav-open" : "nav"}><a href="#catalog" onClick={() => setMobileMenu(false)}>Katalog</a><a href="#about" onClick={() => setMobileMenu(false)}>Biz haqimizda</a><a href="#how" onClick={() => setMobileMenu(false)}>Qanday ishlaydi</a></nav>
      <div className="header-actions"><button className="icon-btn account-btn" aria-label="Kirish" onClick={() => setNotice("Shaxsiy kabinet tez kunda ishga tushadi")}>Kirish</button><button className="cart-btn" onClick={() => setNotice(cart.length ? `Savatingizda ${cart.length} ta kitob bor — to'lov bo'limi keyingi bosqichda ulanadi` : "Savatingiz hozircha bo'sh")}><ShoppingBag size={17} /><span>Savat</span>{cart.length > 0 && <b>{cart.length}</b>}</button><button className="menu-btn" aria-label="Menyuni ochish" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button></div>
    </header>

    <section className="hero" id="top"><div className="hero-content"><div className="eyebrow"><span className="eyebrow-line" /> KITOB — ENG YAXSHI HAMROH</div><h1>Har bir sahifada<br />yangi <em>dunyo.</em></h1><p>Sevimli kitoblaringizni toping, bir zumda xarid qiling va darhol mutolaani boshlang.</p><div className="hero-cta"><a className="primary-btn" href="#catalog">Kitoblarni ko'rish <ArrowRight size={17} /></a><a className="text-btn" href="#how">Qanday ishlaydi <ArrowDown size={15} /></a></div><div className="hero-stats"><div><strong>1 200<span>+</span></strong><small>kitoblar</small></div><i /><div><strong>8 400<span>+</span></strong><small>kitobxonlar</small></div><i /><div><strong>4.9<span>/5</span></strong><small>kitobxonlar bahosi</small></div></div></div>
      <div className="hero-art" aria-label="Kitoblar tasviri"><div className="art-sun"/><div className="art-plant plant-one">✳</div><div className="art-plant plant-two">✳</div><div className="book-stack"><div className="stack-book stack-back"><span>O'ZINGNI ANGLA</span><small>Har kuni bir qadam</small></div><div className="stack-book stack-middle"><span>YANGI SAHIFA</span><small>Orzular sari</small></div><div className="stack-book stack-front"><span>SO'ZLAR<br/>OLAMI</span><small>Eng yaxshi hikoyalar</small><div className="book-sun">☼</div></div></div><div className="art-caption"><span className="caption-dot"/><span>Bugun o'qishga arziydigan kitob</span></div><div className="art-note">“O'qish — o'zing bilan<br/>uchrashishdir.”<small>— Carlos Ruiz Zafón</small></div></div>
      <div className="hero-bottom">SCROLL QILING <span /></div>
    </section>

    <section className="benefits" id="about"><div><span className="benefit-icon"><BookOpen size={18}/></span><div><strong>Bir zumda olish</strong><small>Xariddan so'ng darhol yuklab oling</small></div></div><div><span className="benefit-icon"><Check size={18}/></span><div><strong>Ishonchli to'lov</strong><small>To'lovlaringiz himoyalangan</small></div></div><div><span className="benefit-icon"><Heart size={18}/></span><div><strong>Tanlangan kitoblar</strong><small>Har bir kitob — alohida tavsiya</small></div></div><div><span className="benefit-icon"><Sparkles size={18}/></span><div><strong>Doim yoningizda</strong><small>Telefon, planshet va kompyuterda</small></div></div></section>

    <section className="catalog-section" id="catalog"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> KITOBLAR TO'PLAMI</div><h2>Yaxshi kitoblar <em>shu yerda.</em></h2><p>Kayfiyatingizga mos hikoyani toping.</p></div><a href="#catalog" className="all-books">Barcha kitoblar <ArrowRight size={16}/></a></div>
      <div className="catalog-toolbar"><div className="categories">{visibleCategories.map((item) => <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="filters"><label className="search-box"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Kitob yoki muallif..." /></label><label className="sort-box"><SlidersHorizontal size={15}/><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Tavsiya etilgan</option><option>Narxi: arzondan</option><option>Narxi: qimmatdan</option></select><ChevronDown size={14}/></label></div></div>
      <div className="book-grid">{shownBooks.map((book) => <article className="book-card" key={book.id}><button className={saved.includes(book.id) ? "save-btn saved" : "save-btn"} aria-label="Sevimlilarga qo'shish" onClick={() => toggleSaved(book.id)}><Heart size={17} fill={saved.includes(book.id) ? "currentColor" : "none"}/></button><button className="cover-wrap" style={{ backgroundColor: book.color }} onClick={() => setActiveBook(book)} aria-label={`${book.title} tafsilotlari`}><div className="cover-shadow"/><div className={`cover cover-${book.id}`}><span className="cover-ornament">✳</span><small>{book.author}</small><strong>{book.title}</strong><i/><span className="cover-publisher">KITOBZOR NASHRI</span></div>{book.badge && <span className="book-badge">{book.badge}</span>}<span className="quick-view">Tez ko'rish <ArrowRight size={13}/></span></button><div className="book-meta"><span className="book-category">{book.category}</span><span className="rating"><Star size={12} fill="currentColor"/> {book.rating}</span></div><button className="book-title" onClick={() => setActiveBook(book)}>{book.title}</button><p className="book-author">{book.author}</p><div className="book-buy"><strong>{formatPrice(book.price)}</strong><button onClick={() => addToCart(book.id)} className={cart.includes(book.id) ? "add-btn added" : "add-btn"} aria-label="Savatga qo'shish">{cart.includes(book.id) ? <Check size={16}/> : <ShoppingBag size={16}/>}</button></div></article>)}</div>
      {shownBooks.length === 0 && <div className="empty-state"><BookOpen size={30}/><strong>Kitob topilmadi</strong><span>Boshqa so'z bilan qidirib ko'ring.</span></div>}
      <div className="catalog-footer"><span>{shownBooks.length} ta kitob ko'rsatilmoqda</span><button onClick={() => { setCategory("Barchasi"); setQuery(""); }}>Barchasini ko'rish <ArrowRight size={15}/></button></div>
    </section>

    <section className="quote-section" id="how"><div className="quote-mark">“</div><blockquote>Kitob o'qigan odam ming umr yashaydi.</blockquote><div className="quote-rule"/><span>O'ZBEK XALQ MAQOLI</span><div className="quote-decoration">✳</div></section>
    <section className="newsletter"><div><div className="eyebrow"><span className="eyebrow-line"/> KITOBXONLAR DAVRASI</div><h2>Yangi kitoblar haqida<br/><em>birinchi bo'lib biling.</em></h2><p>Yangiliklar va kitob tavsiyalari — oyiga bir-ikki marta.</p></div><form onSubmit={(e) => { e.preventDefault(); setNotice("Rahmat! Yangiliklardan xabardor bo'lasiz."); }}><label htmlFor="email">Elektron pochtangiz</label><div className="email-form"><input id="email" type="email" required placeholder="siz@email.uz"/><button type="submit">Obuna bo'lish <ArrowRight size={15}/></button></div><small>Spam yo'q. Istagan vaqtda obunani bekor qiling.</small></form></section>
    <footer><a href="#top" className="brand"><span className="brand-mark"><BookOpen size={19}/></span><span>kitobzor<span className="brand-dot">.</span></span></a><span>Yaxshi kitob — yaxshi kunning boshlanishi.</span><small>© 2025 Kitobzor. Barcha huquqlar himoyalangan.</small></footer>

    {notice && <div className="toast"><Check size={16}/>{notice}<button onClick={() => setNotice("")} aria-label="Yopish"><X size={14}/></button></div>}
    {activeBook && <div className="modal-backdrop" onClick={() => setActiveBook(null)}><div className="book-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setActiveBook(null)} aria-label="Yopish"><X/></button><div className="modal-cover" style={{ backgroundColor: activeBook.color }}><div className="cover"><span className="cover-ornament">✳</span><small>{activeBook.author}</small><strong>{activeBook.title}</strong><i/><span className="cover-publisher">KITOBZOR NASHRI</span></div></div><div className="modal-info"><span className="book-category">{activeBook.category}</span><h2>{activeBook.title}</h2><p className="modal-author">{activeBook.author}</p><div className="modal-rating"><Star size={15} fill="currentColor"/> {activeBook.rating} <span>kitobxonlar bahosi</span></div><p className="modal-description">{activeBook.description}</p><div className="modal-price">{formatPrice(activeBook.price)}</div><button className="primary-btn modal-buy" onClick={() => { addToCart(activeBook.id); setActiveBook(null); }}>Savatga qo'shish <ShoppingBag size={16}/></button><small className="instant-note"><Check size={13}/> Yuklab olish xizmati ishga tushishga tayyorlanmoqda</small></div></div></div>}
  </main>;
}
