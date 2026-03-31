import { useState } from "react";
import Icon from "@/components/ui/icon";

const COVER_IMAGE = "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg";

const GALLERY_ITEMS = [
  {
    id: 1,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
    title: "Неоновый авангард",
    category: "Мода",
    tags: ["авангард", "неон", "2026"],
    author: "Анна Волкова",
  },
  {
    id: 2,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/45c7770a-ed4f-465e-9e68-08e0428eadfd.jpg",
    title: "Кутюр весна",
    category: "Couture",
    tags: ["кутюр", "весна", "элегантность"],
    author: "Марина Соколова",
  },
  {
    id: 3,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/b32ad28f-4c59-4c3a-9762-f36a443d47e0.jpg",
    title: "Стрит-стиль",
    category: "Street",
    tags: ["стрит", "городской", "тренды"],
    author: "Дарья Лебедева",
  },
  {
    id: 4,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/45c7770a-ed4f-465e-9e68-08e0428eadfd.jpg",
    title: "Монохром",
    category: "Мода",
    tags: ["монохром", "минимализм"],
    author: "Анна Волкова",
  },
  {
    id: 5,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/b32ad28f-4c59-4c3a-9762-f36a443d47e0.jpg",
    title: "Ультра яркость",
    category: "Street",
    tags: ["яркий", "цвет", "2026"],
    author: "Марина Соколова",
  },
  {
    id: 6,
    image: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
    title: "Haute Couture",
    category: "Couture",
    tags: ["кутюр", "роскошь"],
    author: "Дарья Лебедева",
  },
];

const ALL_CATEGORIES = ["Все", "Мода", "Couture", "Street"];
const ALL_AUTHORS = ["Все авторы", "Анна Волкова", "Марина Соколова", "Дарья Лебедева"];
const ALL_TAGS = ["авангард", "неон", "2026", "кутюр", "весна", "элегантность", "стрит", "городской", "тренды", "монохром", "минимализм", "яркий", "цвет", "роскошь"];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeAuthor, setActiveAuthor] = useState("Все авторы");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = GALLERY_ITEMS.filter((item) => {
    const catMatch = activeCategory === "Все" || item.category === activeCategory;
    const authorMatch = activeAuthor === "Все авторы" || item.author === activeAuthor;
    const tagMatch = activeTags.length === 0 || activeTags.some((t) => item.tags.includes(t));
    return catMatch && authorMatch && tagMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light tracking-[0.3em] text-white">LUMIÈRE</span>
        <div className="hidden md:flex items-center gap-8">
          {[{ label: "Главная", href: "#hero" }, { label: "Галерея", href: "#gallery" }, { label: "Контакты", href: "#contacts" }].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-[#ff2d78] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
          {[{ label: "Главная", href: "#hero" }, { label: "Галерея", href: "#gallery" }, { label: "Контакты", href: "#contacts" }].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light tracking-widest text-white hover:text-[#ff2d78] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={COVER_IMAGE} alt="cover" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#ff2d78]/20 blur-[100px]" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-[#00e5ff]/15 blur-[80px]" style={{ animation: "pulse 3s ease-in-out infinite", animationDelay: "1s" }} />
        </div>

        <div className="absolute top-28 right-6 md:right-12 z-10 flex flex-col items-end gap-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Выпуск</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-6xl font-light text-white/10 leading-none">#04</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#ff2d78]">Апрель 2026</span>
        </div>

        <div className="relative z-10 px-6 md:px-16 pb-16 md:pb-24 max-w-3xl">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#ff2d78] mb-4">Журнал о моде и стиле</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-6xl md:text-9xl font-light leading-[0.9] tracking-tight text-white mb-6">
            LUMIÈRE
          </h1>
          <p className="text-sm md:text-base text-white/50 tracking-widest uppercase mb-10 font-light">
            Свет. Стиль. Авангард.
          </p>
          <a
            href="#gallery"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#ff2d78] text-[#ff2d78] text-xs tracking-[0.3em] uppercase hover:bg-[#ff2d78] hover:text-white transition-all duration-300"
          >
            Смотреть галерею
            <Icon name="ArrowRight" size={14} />
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/30">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden border-y border-white/5 py-3 bg-[#0d0d0d]">
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 20s linear infinite" }}>
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="mx-8 text-[10px] tracking-[0.4em] uppercase text-white/20">
              Мода &nbsp;·&nbsp; Красота &nbsp;·&nbsp; Авангард &nbsp;·&nbsp; Couture &nbsp;·&nbsp; Street Style &nbsp;·&nbsp; Тренды 2026 &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <section id="gallery" className="relative z-10 px-6 md:px-16 py-24">
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-16">
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#ff2d78] mb-2">Коллекция</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl md:text-7xl font-light text-white">Галерея</h2>
          </div>
          <p className="text-white/30 text-sm font-light md:ml-auto md:max-w-xs tracking-wide">
            {filtered.length} материалов
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-[#ff2d78] border-[#ff2d78] text-white"
                    : "border-white/10 text-white/40 hover:border-[#ff2d78]/50 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px bg-white/10 mx-2 self-stretch hidden md:block" />
            {ALL_AUTHORS.map((author) => (
              <button
                key={author}
                onClick={() => setActiveAuthor(author)}
                className={`px-5 py-2 text-xs tracking-[0.15em] transition-all duration-200 border ${
                  activeAuthor === author
                    ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]"
                    : "border-white/10 text-white/40 hover:border-[#00e5ff]/40 hover:text-white/70"
                }`}
              >
                {author}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-full transition-all duration-200 ${
                  activeTags.includes(tag)
                    ? "bg-[#ff2d78]/20 text-[#ff2d78] ring-1 ring-[#ff2d78]"
                    : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60"
                }`}
              >
                #{tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="px-3 py-1 text-[10px] text-white/30 hover:text-white/70 transition-colors"
              >
                очистить
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <Icon name="ImageOff" size={40} className="text-white/10" />
            <p className="text-white/20 text-sm tracking-widest uppercase">Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden bg-[#0a0a0a] cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#ff2d78] mb-1">{item.category}</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-white/50 tracking-widest">{item.author}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[9px] tracking-wider text-white/30">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-white/80">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="relative z-10 px-6 md:px-16 py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ff2d78]/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#ff2d78] mb-2">Написать нам</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl md:text-7xl font-light text-white mb-8">Контакты</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10">
              Хотите разместить материал, стать автором или предложить сотрудничество? Напишите нам — мы читаем каждое письмо.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { icon: "Mail", label: "Email", value: "hello@lumiere.ru" },
                { icon: "Instagram", label: "Instagram", value: "@lumiere_mag" },
                { icon: "MapPin", label: "Город", value: "Москва, Россия" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} fallback="Mail" size={16} className="text-[#ff2d78]" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-white/25 mb-0.5">{c.label}</p>
                    <p className="text-sm text-white/70">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Имя</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Ваше имя"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Сообщение</label>
              <textarea
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Расскажите о вашем проекте..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/60 transition-colors resize-none"
              />
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#ff2d78] text-white text-xs tracking-[0.3em] uppercase hover:bg-[#e0245f] transition-colors duration-300">
              Отправить
              <Icon name="Send" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light tracking-[0.3em] text-white/30">LUMIÈRE</span>
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/15">© 2026 — Все права защищены</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/15">Мода. Стиль. Свет.</p>
      </footer>
    </div>
  );
}