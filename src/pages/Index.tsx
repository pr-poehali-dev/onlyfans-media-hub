import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const WATERMARK = "Only Girl Web";

type Comment = { id: number; user: string; text: string; time: string };
type MediaItem = {
  id: number;
  name: string;
  avatar: string;
  preview: string;
  videoUrl?: string;
  link: string;
  tags: string[];
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
};

const INITIAL_ITEMS: MediaItem[] = [
  {
    id: 1,
    name: "Sofia Rose",
    avatar: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
    preview: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
    link: "https://onlyfans.com",
    tags: ["фото", "lifestyle"],
    likes: 142,
    likedByMe: false,
    comments: [{ id: 1, user: "user123", text: "Огонь!", time: "2 ч назад" }],
  },
  {
    id: 2,
    name: "Mia Belle",
    avatar: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/45c7770a-ed4f-465e-9e68-08e0428eadfd.jpg",
    preview: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/45c7770a-ed4f-465e-9e68-08e0428eadfd.jpg",
    link: "https://onlyfans.com",
    tags: ["видео", "эксклюзив"],
    likes: 98,
    likedByMe: false,
    comments: [],
  },
  {
    id: 3,
    name: "Lara Nova",
    avatar: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/b32ad28f-4c59-4c3a-9762-f36a443d47e0.jpg",
    preview: "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/b32ad28f-4c59-4c3a-9762-f36a443d47e0.jpg",
    link: "https://onlyfans.com",
    tags: ["фото", "новинка"],
    likes: 217,
    likedByMe: false,
    comments: [{ id: 1, user: "fan99", text: "Лучшая!", time: "5 ч назад" }],
  },
];

const ADMIN_PIN = "1234";

export default function Index() {
  const [items, setItems] = useState<MediaItem[]>(INITIAL_ITEMS);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [filterTag, setFilterTag] = useState("все");
  const [menuOpen, setMenuOpen] = useState(false);

  // Admin
  const [adminOpen, setAdminOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add form
  const [addForm, setAddForm] = useState({
    name: "", link: "", tags: "", preview: "", videoUrl: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const allTags = ["все", ...Array.from(new Set(items.flatMap((i) => i.tags)))];
  const filtered = filterTag === "все" ? items : items.filter((i) => i.tags.includes(filterTag));

  const toggleLike = (id: number) => {
    setItems((prev) => prev.map((item) =>
      item.id === id
        ? { ...item, likedByMe: !item.likedByMe, likes: item.likedByMe ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const addComment = (id: number) => {
    if (!commentText.trim()) return;
    const name = userName.trim() || "Гость";
    setItems((prev) => prev.map((item) =>
      item.id === id
        ? {
            ...item,
            comments: [...item.comments, {
              id: Date.now(),
              user: name,
              text: commentText.trim(),
              time: "только что",
            }],
          }
        : item
    ));
    setCommentText("");
  };

  const handleLogin = () => {
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setAdminOpen(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAddForm((f) => ({ ...f, preview: url }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAddForm((f) => ({ ...f, videoUrl: url }));
  };

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    const newItem: MediaItem = {
      id: Date.now(),
      name: addForm.name,
      avatar: addForm.preview || "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
      preview: addForm.preview || "https://cdn.poehali.dev/projects/562a4356-3eb2-4c32-8743-6f6d827f0a24/files/41e15938-8e89-444c-a8a5-dda563a97c8d.jpg",
      videoUrl: addForm.videoUrl || undefined,
      link: addForm.link || "#",
      tags: addForm.tags ? addForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : ["новинка"],
      likes: 0,
      likedByMe: false,
      comments: [],
    };
    setItems((prev) => [newItem, ...prev]);
    setAddForm({ name: "", link: "", tags: "", preview: "", videoUrl: "" });
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (openCard === id) setOpenCard(null);
  };

  const handleDownload = (item: MediaItem) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${Math.max(img.width / 12, 28)}px Arial`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(WATERMARK, 0, 0);
      ctx.restore();
      const link = document.createElement("a");
      link.download = `${item.name}-onlygirlweb.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    };
    img.src = item.preview;
  };

  const activeItem = items.find((i) => i.id === openCard);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-4 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[#ff2d78] font-black text-xl tracking-tight">Only</span>
          <span className="text-white font-black text-xl tracking-tight">Girl</span>
          <span className="text-[#ff2d78] font-black text-xl tracking-tight">Web</span>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <span className="text-[10px] tracking-widest uppercase text-[#ff2d78] border border-[#ff2d78]/30 px-3 py-1">ADMIN</span>
          ) : (
            <button
              onClick={() => setAdminOpen(true)}
              className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
            >
              Войти
            </button>
          )}
          <button className="md:hidden text-white/60" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0d0d0d] flex flex-col items-center justify-center gap-8">
          {[{ label: "Главная", href: "#top" }, { label: "Каталог", href: "#catalog" }].map((item) => (
            <a key={item.label} href={item.href}
              className="text-3xl font-bold text-white hover:text-[#ff2d78] transition-colors"
              onClick={() => setMenuOpen(false)}
            >{item.label}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="top" className="relative pt-24 pb-16 px-4 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#ff2d78]/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#a855f7]/10 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2d78]/10 border border-[#ff2d78]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d78] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#ff2d78]">Эксклюзивный контент</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-4">
            Only <span className="text-[#ff2d78]">Girl</span> Web
          </h1>
          <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8">
            Лучшие девушки OnlyFans и не только — фото, видео, ссылки на профили
          </p>
          <a href="#catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff2d78] text-white text-sm font-semibold tracking-wide hover:bg-[#e0245f] transition-colors">
            Смотреть каталог
            <Icon name="ArrowRight" size={16} />
          </a>
        </div>
      </section>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <section className="relative z-10 px-4 md:px-10 py-8 bg-[#1a0a0f] border-y border-[#ff2d78]/20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#ff2d78] mb-4">Панель администратора — добавить карточку</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[9px] tracking-widest uppercase text-white/30 block mb-1">Имя *</label>
              <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="Sofia Rose" className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/50" />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-white/30 block mb-1">Ссылка на профиль</label>
              <input value={addForm.link} onChange={(e) => setAddForm({ ...addForm, link: e.target.value })}
                placeholder="https://onlyfans.com/..." className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/50" />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-white/30 block mb-1">Теги (через запятую)</label>
              <input value={addForm.tags} onChange={(e) => setAddForm({ ...addForm, tags: e.target.value })}
                placeholder="фото, видео, эксклюзив" className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/50" />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-white/30 block mb-1">Фото (обложка)</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-sm px-3 py-2 hover:border-white/30 transition-colors">
                <Icon name="Image" size={14} />
                {addForm.preview ? "Фото выбрано ✓" : "Выбрать фото"}
              </button>
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-white/30 block mb-1">Видео (необязательно)</label>
              <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
              <button onClick={() => videoRef.current?.click()}
                className="w-full flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-sm px-3 py-2 hover:border-white/30 transition-colors">
                <Icon name="Video" size={14} />
                {addForm.videoUrl ? "Видео выбрано ✓" : "Выбрать видео"}
              </button>
            </div>
          </div>
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff2d78] text-white text-sm font-semibold hover:bg-[#e0245f] transition-colors">
            <Icon name="Plus" size={16} />
            Добавить карточку
          </button>
        </section>
      )}

      {/* CATALOG */}
      <section id="catalog" className="relative z-10 px-4 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-white">Каталог</h2>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setFilterTag(tag)}
                className={`px-4 py-1.5 text-[11px] tracking-widest uppercase rounded-full transition-all ${
                  filterTag === tag ? "bg-[#ff2d78] text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-[#161616] rounded-xl overflow-hidden border border-white/5 hover:border-[#ff2d78]/30 transition-all duration-300">
              {/* Preview */}
              <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => setOpenCard(item.id)}>
                <img src={item.preview} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                      <Icon name="Play" size={20} className="text-white ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-white text-sm truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[#ff2d78]/20 text-[#ff2d78] tracking-wide">{t}</span>
                    ))}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Trash2" size={12} className="text-white" />
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                <button onClick={() => toggleLike(item.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${item.likedByMe ? "text-[#ff2d78]" : "text-white/40 hover:text-[#ff2d78]"}`}>
                  <Icon name={item.likedByMe ? "Heart" : "Heart"} size={15} />
                  <span>{item.likes}</span>
                </button>
                <button onClick={() => setOpenCard(openCard === item.id ? null : item.id)}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                  <Icon name="MessageCircle" size={15} />
                  <span>{item.comments.length}</span>
                </button>
                <button onClick={() => handleDownload(item)}
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-[#00e5ff] transition-colors">
                  <Icon name="Download" size={15} />
                </button>
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-[#ff2d78] transition-colors">
                  <Icon name="ExternalLink" size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {openCard && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setOpenCard(null)}>
          <div className="relative bg-[#161616] w-full md:max-w-2xl md:rounded-2xl overflow-hidden border border-white/10 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenCard(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-white">
              <Icon name="X" size={16} />
            </button>

            {/* Media */}
            <div className="relative">
              {activeItem.videoUrl ? (
                <video src={activeItem.videoUrl} controls className="w-full max-h-64 object-cover bg-black" />
              ) : (
                <img src={activeItem.preview} alt={activeItem.name} className="w-full max-h-72 object-cover" />
              )}
              <div className="absolute bottom-3 left-3 right-12 flex items-center justify-between">
                <span className="font-bold text-white text-lg">{activeItem.name}</span>
                <a href={activeItem.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff2d78] text-white text-xs font-semibold rounded-full hover:bg-[#e0245f] transition-colors">
                  <Icon name="ExternalLink" size={12} />
                  Профиль
                </a>
              </div>
            </div>

            {/* Actions bar */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
              <button onClick={() => toggleLike(activeItem.id)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${activeItem.likedByMe ? "text-[#ff2d78]" : "text-white/50 hover:text-[#ff2d78]"}`}>
                <Icon name="Heart" size={18} />
                {activeItem.likes}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-white/40">
                <Icon name="MessageCircle" size={18} />
                {activeItem.comments.length}
              </span>
              <button onClick={() => handleDownload(activeItem)}
                className="ml-auto flex items-center gap-1.5 text-xs text-white/40 hover:text-[#00e5ff] transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:border-[#00e5ff]/40">
                <Icon name="Download" size={14} />
                Скачать с водяным знаком
              </button>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {activeItem.comments.length === 0 && (
                <p className="text-white/20 text-sm text-center py-4">Комментариев пока нет</p>
              )}
              {activeItem.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ff2d78]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-[#ff2d78] font-bold">{c.user[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-white/80">{c.user}</span>
                      <span className="text-[10px] text-white/20">{c.time}</span>
                    </div>
                    <p className="text-sm text-white/60 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="px-4 py-3 border-t border-white/5 flex flex-col gap-2">
              <input value={userName} onChange={(e) => setUserName(e.target.value)}
                placeholder="Ваш никнейм (необязательно)"
                className="w-full bg-white/5 border border-white/10 text-white text-xs px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/40" />
              <div className="flex gap-2">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment(activeItem.id)}
                  placeholder="Написать комментарий..."
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-[#ff2d78]/40" />
                <button onClick={() => addComment(activeItem.id)}
                  className="px-4 py-2 bg-[#ff2d78] text-white text-sm font-semibold hover:bg-[#e0245f] transition-colors">
                  <Icon name="Send" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN MODAL */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAdminOpen(false)}>
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white mb-1">Вход для администратора</h3>
            <p className="text-white/30 text-xs mb-6">Введите PIN-код для доступа</p>
            <input type="password" value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="PIN-код"
              className={`w-full bg-white/5 border text-white text-center text-2xl tracking-[0.5em] px-4 py-3 mb-4 focus:outline-none transition-colors ${pinError ? "border-red-500" : "border-white/10 focus:border-[#ff2d78]/50"}`} />
            {pinError && <p className="text-red-400 text-xs text-center mb-3">Неверный PIN</p>}
            <button onClick={handleLogin}
              className="w-full py-3 bg-[#ff2d78] text-white font-bold text-sm hover:bg-[#e0245f] transition-colors rounded-lg">
              Войти
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-4 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <span className="text-[#ff2d78] font-black">Only</span>
          <span className="text-white font-black">Girl</span>
          <span className="text-[#ff2d78] font-black">Web</span>
        </div>
        <p className="text-[10px] text-white/15 tracking-widest uppercase">© 2026 — Все права защищены</p>
        <p className="text-[10px] text-white/15">18+</p>
      </footer>
    </div>
  );
}
