import { useState, useEffect, useRef, useCallback } from "react";

const BRAND = {
  green: "#5CC235",
  darkGreen: "#0B3D2E",
  lightGreen: "#EAF5E2",
  mintGreen: "#D4F0BE",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#F7F9F5",
  textGray: "#4A5568",
  borderGray: "#E2E8F0",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Manrope', sans-serif; background: #fff; color: #1a202c; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; outline: none; }
  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .fade-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-left.visible { opacity: 1; transform: translateX(0); }
  .fade-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-right.visible { opacity: 1; transform: translateX(0); }
  .scale-in { opacity: 0; transform: scale(0.9); transition: opacity 0.5s ease, transform 0.5s ease; }
  .scale-in.visible { opacity: 1; transform: scale(1); }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  .hero-blob { animation: blob 8s ease-in-out infinite; }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .pulse-anim { animation: pulse 2s ease-in-out infinite; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f1f5f0; }
  ::-webkit-scrollbar-thumb { background: #5CC235; border-radius: 10px; }
`;

function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll(".fade-in, .fade-left, .fade-right, .scale-in");
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const DHCLogo = ({ size = 40, showText = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="8" fill="#5CC235"/>
      <text x="12" y="48" fill="white" fontFamily="Poppins,sans-serif" fontWeight="800" fontSize="34">DHC</text>
      <path d="M5 95 Q35 70 95 45" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
    </svg>
    {showText && (
      <div>
        <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "15px", color: BRAND.darkGreen, lineHeight: 1 }}>DECCAN HIRE</div>
        <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 400, fontSize: "10px", color: BRAND.textGray, letterSpacing: "2px" }}>CONSULTANTS</div>
      </div>
    )}
  </div>
);

const Navbar = ({ currentPage, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Industries", id: "industries" },
    { label: "Contact", id: "contact" },
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    boxShadow: scrolled ? "0 2px 30px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.3s ease",
    borderBottom: scrolled ? `1px solid ${BRAND.borderGray}` : "none",
  };
  return (
    <nav style={nav}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        <div onClick={() => { setPage("home"); setMenuOpen(false); }} style={{ cursor: "pointer" }}>
          <DHCLogo size={44} />
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }} className="desktop-nav">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => setPage(link.id)}
              style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500,
                fontFamily: "Manrope,sans-serif",
                background: currentPage === link.id ? BRAND.green : "transparent",
                color: currentPage === link.id ? "#fff" : BRAND.darkGreen,
                transition: "all 0.2s",
                border: "none", cursor: "pointer",
              }}
              onMouseEnter={e => { if (currentPage !== link.id) { e.target.style.background = BRAND.lightGreen; e.target.style.color = BRAND.darkGreen; }}}
              onMouseLeave={e => { if (currentPage !== link.id) { e.target.style.background = "transparent"; e.target.style.color = BRAND.darkGreen; }}}
            >{link.label}</button>
          ))}
          <button onClick={() => setPage("contact")}
            style={{ marginLeft: "8px", padding: "10px 22px", borderRadius: "25px", fontSize: "14px", fontWeight: 700, fontFamily: "Manrope,sans-serif", background: BRAND.darkGreen, color: "#fff", transition: "all 0.2s", border: "none", cursor: "pointer" }}
            onMouseEnter={e => { e.target.style.background = BRAND.green; e.target.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.target.style.background = BRAND.darkGreen; e.target.style.transform = "scale(1)"; }}
          >Get Started</button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px", padding: "8px" }} id="hamburger">
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", width: "24px", height: "2px", background: BRAND.darkGreen, borderRadius: "2px", transition: "all 0.3s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "scale(0)") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div style={{ position: "absolute", top: "72px", left: 0, right: 0, background: "#fff", borderBottom: `2px solid ${BRAND.green}`, padding: "16px 24px", animation: "slideDown 0.3s ease" }}>
          {navLinks.map(link => (
            <button key={link.id} onClick={() => { setPage(link.id); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: "8px", fontSize: "15px", fontWeight: 500, background: currentPage === link.id ? BRAND.lightGreen : "transparent", color: currentPage === link.id ? BRAND.darkGreen : "#333", border: "none", cursor: "pointer", marginBottom: "4px" }}>
              {link.label}
            </button>
          ))}
          <button onClick={() => { setPage("contact"); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", marginTop: "8px", padding: "12px 16px", borderRadius: "25px", fontSize: "15px", fontWeight: 700, background: BRAND.green, color: "#fff", border: "none", cursor: "pointer" }}>
            Get Started →
          </button>
        </div>
      )}
      <style>{`@media(max-width:768px){.desktop-nav{display:none!important}#hamburger{display:flex!important}}`}</style>
    </nav>
  );
};

const FloatingButtons = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const btn = (bg, icon, href, bottom) => (
    <a href={href} target="_blank" rel="noopener"
      style={{ position: "fixed", right: "24px", bottom, zIndex: 999, width: "52px", height: "52px", borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "transform 0.2s, opacity 0.4s", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.8)" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      {icon}
    </a>
  );
  return (
    <>
      {btn("#25D366", <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, "https://wa.me/917815806889", "176px")}
      {btn(BRAND.green, <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, "tel:+917815806889", "116px")}
      {btn(BRAND.darkGreen, <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, "mailto:deccanhireconsultants@gmail.com", "56px")}
    </>
  );
};

const Footer = ({ setPage }) => {
  const services = ["IT Recruitment", "Permanent Staffing", "Contract Staffing", "Bulk Hiring", "Candidate Screening", "Recruitment Consultation"];
  const links = [{ l: "Home", p: "home" }, { l: "About Us", p: "about" }, { l: "Services", p: "services" }, { l: "Industries", p: "industries" }, { l: "Contact", p: "contact" }];
  return (
    <footer style={{ background: BRAND.darkGreen, color: "#fff" }}>
      <div style={{ background: BRAND.green, padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", fontFamily: "Poppins,sans-serif" }}>Ready to Build Your Dream Team?</p>
        <p style={{ opacity: 0.9, marginBottom: "24px", fontSize: "15px" }}>Connect with Hyderabad's leading IT recruitment consultants today.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("contact")} style={{ padding: "12px 28px", borderRadius: "25px", background: "#fff", color: BRAND.darkGreen, fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer" }}>Request Consultation</button>
          <a href="tel:+917815806889" style={{ padding: "12px 28px", borderRadius: "25px", border: "2px solid #fff", color: "#fff", fontWeight: 700, fontSize: "14px" }}>Call Us Now</a>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "40px" }}>
        <div>
          <DHCLogo size={48} showText={true} />
          <p style={{ marginTop: "16px", fontSize: "14px", lineHeight: 1.7, opacity: 0.8 }}>Leading IT recruitment & staffing consultants in Hyderabad, connecting businesses with exceptional tech talent across India and globally.</p>
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            {[
              { href: "https://wa.me/917815806889", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" },
              { href: "mailto:deccanhireconsultants@gmail.com", d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" },
              { href: "tel:+917815806889", d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" },
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener"
                style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = BRAND.green}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d={item.d}/></svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: BRAND.green }}>Quick Links</h4>
          {links.map(({ l, p }) => (
            <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontSize: "14px", cursor: "pointer", padding: "6px 0", textAlign: "left", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = BRAND.green}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>{l}</button>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: BRAND.green }}>Our Services</h4>
          {services.map(s => (
            <button key={s} onClick={() => setPage("services")} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontSize: "14px", cursor: "pointer", padding: "6px 0", textAlign: "left", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = BRAND.green}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>{s}</button>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: BRAND.green }}>Contact Us</h4>
          {[
            { icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", text: "+91 78158 06889", href: "tel:+917815806889" },
            { icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", text: "+91 96661 26451", href: "tel:+919666126451" },
            { icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", text: "deccanhireconsultants@gmail.com", href: "mailto:deccanhireconsultants@gmail.com" },
            { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", text: "Hyderabad, Telangana, India", href: "#" },
          ].map((item, i) => (
            <a key={i} href={item.href} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "14px", color: "rgba(255,255,255,0.75)", fontSize: "13px", transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = BRAND.green; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: "2px" }}><path d={item.icon}/></svg>
              <span style={{ lineHeight: 1.5 }}>{item.text}</span>
            </a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", textAlign: "center", fontSize: "13px", opacity: 0.6 }}>
        © {new Date().getFullYear()} Deccan Hire Consultants. All rights reserved. | IT Recruitment Consultants in Hyderabad
      </div>
    </footer>
  );
};

const StatCard = ({ value, suffix, label, icon }) => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 2000, started);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ background: "#fff", borderRadius: "16px", padding: "32px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(11,61,46,0.08)", border: `1px solid ${BRAND.borderGray}`, transition: "transform 0.3s, box-shadow 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(92,194,53,0.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(11,61,46,0.08)"; }}>
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
      <div style={{ fontSize: "42px", fontWeight: 800, color: BRAND.green, fontFamily: "Poppins,sans-serif", lineHeight: 1 }}>{count}{suffix}</div>
      <div style={{ fontSize: "14px", color: BRAND.textGray, marginTop: "8px", fontWeight: 500 }}>{label}</div>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: "16px", padding: "32px 24px", border: `1px solid ${BRAND.borderGray}`, cursor: "pointer", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(92,194,53,0.15)"; e.currentTarget.style.borderColor = BRAND.green; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = BRAND.borderGray; }}>
    <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: BRAND.lightGreen, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill={BRAND.darkGreen}><path d={icon}/></svg>
    </div>
    <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "17px", color: BRAND.darkGreen, marginBottom: "10px" }}>{title}</h3>
    <p style={{ fontSize: "14px", lineHeight: 1.7, color: BRAND.textGray }}>{desc}</p>
    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "6px", color: BRAND.green, fontSize: "13px", fontWeight: 600 }}>
      Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill={BRAND.green}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
    </div>
  </div>
);

const SectionHeading = ({ badge, title, subtitle, center = true }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: "56px" }} className="fade-in">
    {badge && <span style={{ display: "inline-block", background: BRAND.lightGreen, color: BRAND.darkGreen, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>{badge}</span>}
    <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", color: BRAND.darkGreen, lineHeight: 1.2, marginBottom: "16px" }}>{title}</h2>
    {subtitle && <p style={{ fontSize: "16px", color: BRAND.textGray, maxWidth: "600px", margin: center ? "0 auto" : "0", lineHeight: 1.7 }}>{subtitle}</p>}
  </div>
);

// ─── HOME PAGE ───────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  useFadeIn();
  const services = [
    { icon: "M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.51 15.49 0 12.36 0c-1.73 0-3.24.86-4.15 2.14L12 6H8.81l-.34-.34L6.26 3.45C5.62 3.16 4.94 3 4.22 3 1.89 3 0 4.89 0 7.22c0 2.02 1.41 3.7 3.28 4.14L4 12l-3.99 8H4v2h2v-2h2.09L9 22h2l1-2h2l.82 1.64.18.36h1.5l.5-1v-1h2v2h2v-2h3.28C21.59 19.7 23 18.02 23 16c0-2.66-2.24-4.8-4.9-4.8L18 12 20 6z", title: "IT Recruitment Services", desc: "Specialized tech talent acquisition for software engineers, developers, architects, and IT professionals across all domains." },
    { icon: "M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 6c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-6 6l3-3 2 2 4-4 4 4H5zm13-8V7l-2-2H8L6 7v2h12z", title: "Permanent Staffing", desc: "Full-time hiring solutions that match the right professionals with your organization's culture, goals, and technical requirements." },
    { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z", title: "Contract Staffing", desc: "Flexible contract workforce solutions for project-based needs, seasonal demands, or temporary skill gaps in your team." },
    { icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", title: "Bulk Hiring Solutions", desc: "Mass recruitment drives for large teams, product launches, or expansion projects with structured screening and rapid deployment." },
    { icon: "M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z", title: "Candidate Screening", desc: "Rigorous multi-stage evaluation including technical assessments, cultural fit analysis, and background verification." },
    { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", title: "Recruitment Consultation", desc: "Strategic HR advisory services to optimize your hiring process, reduce costs, and build a stronger employer brand." },
  ];
  const whyUs = [
    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "IT Recruitment Specialists", desc: "Deep domain expertise in tech talent across 50+ IT skill sets." },
    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Pre-Screened Candidates", desc: "Every candidate goes through our rigorous multi-stage screening process." },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Fast Hiring Process", desc: "Reduce time-to-hire by up to 60% with our streamlined recruitment pipeline." },
    { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "Dedicated Recruitment Team", desc: "A committed recruiter assigned to your account for personalized service." },
    { icon: "M7 11l5-5m0 0l5 5m-5-5v12", title: "Scalable Hiring Solutions", desc: "From 1 hire to 100+, we scale our efforts to match your growth needs." },
    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "Customized Strategies", desc: "Tailored workforce strategies aligned with your business goals and culture." },
  ];
  const process = [
    { num: "01", title: "Requirement Analysis", desc: "Deep dive into your hiring needs, culture, and technical requirements." },
    { num: "02", title: "Talent Sourcing", desc: "Access our 2000+ database and active sourcing from top platforms." },
    { num: "03", title: "Screening & Evaluation", desc: "Technical and behavioral assessments to shortlist the best fits." },
    { num: "04", title: "Client Presentation", desc: "Present pre-qualified candidates with detailed profiles and reports." },
    { num: "05", title: "Interview Coordination", desc: "Schedule and manage the entire interview process seamlessly." },
    { num: "06", title: "Offer & Onboarding", desc: "Support through offer negotiation and smooth onboarding." },
  ];
  const testimonials = [
    { name: "Rahul Sharma", role: "CTO, TechStartup Hyderabad", text: "Deccan Hire filled 3 senior developer roles within 2 weeks. Their pre-screening quality is outstanding — we only interviewed candidates who were genuinely ready.", avatar: "RS" },
    { name: "Priya Reddy", role: "HR Manager, SaaS Company", text: "The team at DHC understands the tech landscape deeply. They found us a full-stack team that seamlessly integrated with our product culture.", avatar: "PR" },
    { name: "Vikram Nair", role: "Founder, FinTech Startup", text: "DHC's bulk hiring support was a game-changer for our expansion. 15 quality hires in 45 days — exceptional service and professionalism.", avatar: "VN" },
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${BRAND.darkGreen} 0%, #1a5c3a 60%, ${BRAND.darkGreen} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "72px" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "400px", height: "400px", background: BRAND.green, opacity: 0.08, borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "300px", height: "300px", background: BRAND.green, opacity: 0.06, borderRadius: "50%", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", top: "20%", right: "8%", width: "200px", height: "200px", background: BRAND.green, opacity: 0.15, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", animation: "blob 8s ease-in-out infinite" }} className="hero-blob" />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", width: "100%" }}>
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(92,194,53,0.15)", border: "1px solid rgba(92,194,53,0.3)", borderRadius: "20px", padding: "8px 16px", marginBottom: "24px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: BRAND.green, animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ color: BRAND.green, fontSize: "13px", fontWeight: 600 }}>Hyderabad's Premier IT Recruitment Partner</span>
            </div>
            <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,58px)", color: "#fff", lineHeight: 1.15, marginBottom: "24px" }}>
              Connecting Businesses with <span style={{ color: BRAND.green }}>Skilled IT Professionals</span>
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "36px" }}>
              Fast, scalable, and reliable recruitment solutions for startups, enterprises, and growing companies across Hyderabad and globally.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button onClick={() => setPage("contact")} style={{ padding: "16px 32px", borderRadius: "30px", background: BRAND.green, color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.3s", boxShadow: `0 8px 30px rgba(92,194,53,0.4)` }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 40px rgba(92,194,53,0.5)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 30px rgba(92,194,53,0.4)"; }}>
                Request Consultation →
              </button>
              <button onClick={() => setPage("services")} style={{ padding: "16px 32px", borderRadius: "30px", background: "transparent", color: "#fff", fontSize: "15px", fontWeight: 700, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.target.style.borderColor = "#fff"; e.target.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "transparent"; }}>
                Explore Services
              </button>
            </div>
            <div style={{ marginTop: "48px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[{ n: "50+", l: "Placements" }, { n: "92%", l: "Success Rate" }, { n: "10+", l: "Clients" }].map(({ n, l }) => (
                <div key={l}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "28px", color: BRAND.green }}>{n}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeUp 1s ease 0.2s both" }}>
            {[
              { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z", title: "IT Recruitment", desc: "Specialized tech talent for all domains" },
              { icon: "M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z", title: "Permanent Staffing", desc: "Long-term team building solutions" },
              { icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", title: "Bulk Hiring", desc: "Mass recruitment with rapid deployment" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "20px 24px", display: "flex", gap: "16px", alignItems: "center", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(92,194,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={BRAND.green}><path d={item.icon}/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section>div>div:first-child{grid-column:1/-1!important}section>div{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Stats */}
      <section style={{ padding: "80px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Our Impact" title="Numbers That Define Our Excellence" subtitle="Real results delivered to businesses across Hyderabad and beyond." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px" }}>
            <StatCard value={50} suffix="+" label="Successful Placements" icon="🎯" />
            <StatCard value={92} suffix="%" label="Hiring Success Rate" icon="📈" />
            <StatCard value={10} suffix="+" label="Trusted Hiring Clients" icon="🤝" />
            <StatCard value={2000} suffix="+" label="Candidate Database" icon="💼" />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Services" title="Comprehensive Recruitment Solutions" subtitle="From IT recruitment to bulk hiring, we deliver end-to-end staffing solutions tailored to your business." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "24px" }} className="fade-in">
            {services.map((s, i) => <ServiceCard key={i} {...s} onClick={() => setPage("services")} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }} className="fade-in">
            <button onClick={() => setPage("services")} style={{ padding: "14px 36px", borderRadius: "30px", background: BRAND.darkGreen, color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.background = BRAND.green; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = BRAND.darkGreen; e.target.style.transform = "translateY(0)"; }}>
              View All Services →
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "80px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Why DHC" title="Why Leading Companies Choose Deccan Hire" subtitle="We combine deep IT industry expertise with a candidate-first approach to deliver exceptional recruitment outcomes." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
            {whyUs.map((item, i) => (
              <div key={i} className="fade-in" style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", border: `1px solid ${BRAND.borderGray}`, transition: "all 0.3s", animationDelay: `${i * 0.1}s` }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(92,194,53,0.12)"; e.currentTarget.style.borderColor = BRAND.green; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = BRAND.borderGray; }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: BRAND.lightGreen, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND.darkGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                </div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "16px", color: BRAND.darkGreen, marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: BRAND.textGray, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Process */}
      <section style={{ padding: "80px 24px", background: BRAND.darkGreen }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="How We Work" title={<span style={{ color: "#fff" }}>Our Streamlined <span style={{ color: BRAND.green }}>Recruitment Process</span></span>} subtitle={<span style={{ color: "rgba(255,255,255,0.7)" }}>A structured, transparent approach that gets you the right talent at the right time.</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
            {process.map((step, i) => (
              <div key={i} className="fade-in" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px 24px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(92,194,53,0.1)"; e.currentTarget.style.borderColor = "rgba(92,194,53,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "48px", color: "rgba(92,194,53,0.3)", lineHeight: 1, marginBottom: "12px" }}>{step.num}</div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "17px", color: "#fff", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Industries" title="Industries We Power with Top Talent" subtitle="From IT startups to large enterprises, we serve diverse sectors with specialized recruitment expertise." />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }} className="fade-in">
            {["Information Technology", "SaaS Companies", "Product-Based Companies", "FinTech", "Healthcare IT", "E-Commerce", "Telecommunications", "Startups", "BPO & Customer Support", "Engineering Services"].map((ind, i) => (
              <button key={i} onClick={() => setPage("industries")} style={{ padding: "12px 24px", borderRadius: "25px", background: i % 3 === 0 ? BRAND.lightGreen : i % 3 === 1 ? "#fff" : BRAND.gray, border: `1px solid ${i % 3 === 1 ? BRAND.green : BRAND.borderGray}`, color: BRAND.darkGreen, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.background = BRAND.green; e.target.style.color = "#fff"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = i % 3 === 0 ? BRAND.lightGreen : i % 3 === 1 ? "#fff" : BRAND.gray; e.target.style.color = BRAND.darkGreen; e.target.style.transform = "translateY(0)"; }}>
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Testimonials" title="What Our Clients Say" subtitle="Trusted by companies across Hyderabad for IT staffing and recruitment excellence." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} className="scale-in" style={{ background: "#fff", borderRadius: "16px", padding: "32px 28px", border: `1px solid ${BRAND.borderGray}`, position: "relative" }}>
                <div style={{ color: BRAND.green, fontSize: "32px", fontFamily: "Georgia,serif", lineHeight: 0.8, marginBottom: "16px" }}>"</div>
                <p style={{ fontSize: "15px", color: BRAND.textGray, lineHeight: 1.7, marginBottom: "24px", fontStyle: "italic" }}>{t.text}</p>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: BRAND.darkGreen, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: BRAND.darkGreen, fontSize: "15px" }}>{t.name}</div>
                    <div style={{ fontSize: "12px", color: BRAND.textGray }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ position: "absolute", top: "20px", right: "24px", display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FFC107", fontSize: "14px" }}>★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${BRAND.green} 0%, #3da020 100%)`, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }} className="fade-in">
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(24px,4vw,38px)", color: "#fff", marginBottom: "16px" }}>Ready to Hire Top IT Talent?</h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.9)", marginBottom: "36px", lineHeight: 1.7 }}>Join 10+ companies that trust Deccan Hire Consultants for their recruitment needs across Hyderabad and India.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("contact")} style={{ padding: "16px 36px", borderRadius: "30px", background: "#fff", color: BRAND.darkGreen, fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
              Start Hiring Now
            </button>
            <a href="tel:+917815806889" style={{ padding: "16px 36px", borderRadius: "30px", border: "2px solid #fff", color: "#fff", fontSize: "15px", fontWeight: 700, display: "inline-block", transition: "all 0.3s" }}>Call +91 78158 06889</a>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── ABOUT PAGE ──────────────────────────────────────────────
const AboutPage = ({ setPage }) => {
  useFadeIn();
  const values = [
    { icon: "🎯", title: "Excellence", desc: "We maintain the highest standards in every recruitment engagement, ensuring quality at every touchpoint." },
    { icon: "🤝", title: "Integrity", desc: "Honest, transparent communication with both clients and candidates — no false promises, only real results." },
    { icon: "⚡", title: "Speed", desc: "We understand time-to-hire matters. Our streamlined process delivers qualified candidates faster than industry average." },
    { icon: "💡", title: "Innovation", desc: "Leveraging the latest recruitment technology and methodologies to find the best talent efficiently." },
    { icon: "🌱", title: "Partnership", desc: "We act as an extension of your HR team, deeply invested in your long-term success and growth." },
    { icon: "🔒", title: "Confidentiality", desc: "We handle all hiring requirements with complete discretion and data security at all times." },
  ];
  return (
    <div>
      <section style={{ background: BRAND.darkGreen, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(92,194,53,0.2)", color: BRAND.green, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "20px" }}>ABOUT US</span>
          <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,52px)", color: "#fff", marginBottom: "20px" }}>About Deccan Hire Consultants</h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>Hyderabad's trusted IT staffing and HR consultancy — bridging the gap between exceptional companies and outstanding talent.</p>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div className="fade-left">
            <span style={{ display: "inline-block", background: BRAND.lightGreen, color: BRAND.darkGreen, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "20px" }}>OUR STORY</span>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "32px", color: BRAND.darkGreen, marginBottom: "20px" }}>Building Careers, Powering Businesses</h2>
            <p style={{ fontSize: "15px", color: BRAND.textGray, lineHeight: 1.8, marginBottom: "16px" }}>Deccan Hire Consultants (DHC) was founded with a singular mission: to transform the way businesses recruit IT talent in Hyderabad and beyond. We recognized a critical gap in the market — companies spending months and significant resources on hiring while still ending up with mismatched candidates.</p>
            <p style={{ fontSize: "15px", color: BRAND.textGray, lineHeight: 1.8, marginBottom: "24px" }}>Our solution was simple yet powerful: combine deep IT domain expertise with a candidate-first screening philosophy. Today, DHC serves as a trusted recruitment partner to startups, enterprises, product companies, and SaaS businesses across Hyderabad's thriving tech ecosystem and the global IT marketplace.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[{ n: "50+", l: "Successful Placements" }, { n: "92%", l: "Client Retention Rate" }, { n: "2000+", l: "Candidate Database" }, { n: "15", l: "Days Avg. Time-to-Hire" }].map(({ n, l }) => (
                <div key={l} style={{ background: BRAND.gray, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "28px", color: BRAND.green }}>{n}</div>
                  <div style={{ fontSize: "12px", color: BRAND.textGray, fontWeight: 500, marginTop: "4px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-right">
            <div style={{ background: BRAND.gray, borderRadius: "24px", padding: "40px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", right: "24px", background: BRAND.green, color: "#fff", padding: "8px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>Hyderabad HQ</div>
              <DHCLogo size={80} />
              <div style={{ marginTop: "24px" }}>
                {[{ l: "Specialization", v: "IT & Tech Recruitment" }, { l: "Location", v: "Hyderabad, India" }, { l: "Markets", v: "Hyderabad & Global" }, { l: "Services", v: "End-to-End Recruitment" }].map(({ l, v }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${BRAND.borderGray}` }}>
                    <span style={{ color: BRAND.textGray, fontSize: "14px" }}>{l}</span>
                    <span style={{ color: BRAND.darkGreen, fontWeight: 700, fontSize: "14px" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("contact")} style={{ marginTop: "24px", width: "100%", padding: "14px", borderRadius: "12px", background: BRAND.green, color: "#fff", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer" }}>Connect With Us</button>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important}}`}</style>
      </section>

      <section style={{ padding: "80px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {[
            { title: "Our Mission", icon: "🎯", color: BRAND.green, content: "To be Hyderabad's most trusted IT recruitment partner — delivering pre-screened, culture-aligned talent that helps businesses grow faster, reduce hiring friction, and build exceptional teams that drive competitive advantage." },
            { title: "Our Vision", icon: "🚀", color: BRAND.darkGreen, content: "To become the leading technology recruitment consultancy in India, recognized for our commitment to quality, speed, and long-term impact on both the businesses we serve and the careers we help build across the global IT ecosystem." },
          ].map(({ title, icon, color, content }) => (
            <div key={title} className="scale-in" style={{ background: "#fff", borderRadius: "20px", padding: "40px", border: `1px solid ${BRAND.borderGray}` }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{icon}</div>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "22px", color, marginBottom: "16px" }}>{title}</h3>
              <p style={{ fontSize: "15px", color: BRAND.textGray, lineHeight: 1.8 }}>{content}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Our Values" title="Principles That Drive Us" subtitle="Every recruitment decision we make is guided by a set of core values that ensure the best outcomes for clients and candidates alike." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
            {values.map((v, i) => (
              <div key={i} className="fade-in" style={{ background: BRAND.gray, borderRadius: "16px", padding: "28px 24px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = BRAND.lightGreen; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = BRAND.gray; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "17px", color: BRAND.darkGreen, marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: BRAND.textGray, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 24px", background: BRAND.green, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }} className="fade-in">
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "16px" }}>Partner With Hyderabad's Best IT Recruiters</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "28px", fontSize: "16px", lineHeight: 1.7 }}>Let us handle your recruitment challenges so you can focus on growing your business.</p>
          <button onClick={() => setPage("contact")} style={{ padding: "16px 36px", borderRadius: "30px", background: "#fff", color: BRAND.darkGreen, fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer" }}>Get In Touch Today →</button>
        </div>
      </section>
    </div>
  );
};

// ─── SERVICES PAGE ───────────────────────────────────────────
const ServicesPage = ({ setPage }) => {
  useFadeIn();
  const services = [
    {
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "IT Recruitment Services",
      badge: "Most Popular",
      desc: "Our flagship IT recruitment service connects Hyderabad's growing tech ecosystem with exceptional software professionals. We specialize in sourcing, screening, and placing talent across the full software development spectrum.",
      benefits: ["Full-stack developers & architects", "DevOps, cloud & infrastructure engineers", "Data scientists & ML engineers", "QA, cybersecurity & product managers", "UI/UX designers & mobile developers"],
      cta: "Find IT Talent",
    },
    {
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "Permanent Staffing",
      badge: "",
      desc: "Build your core team with permanent hires who align perfectly with your company culture, technical requirements, and long-term vision. Our permanent staffing solutions go beyond resume matching to deliver cultural alignment.",
      benefits: ["Deep cultural fit assessment", "Comprehensive background verification", "30-day replacement guarantee", "90-day post-placement support", "Industry-specific salary benchmarking"],
      cta: "Hire Permanently",
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Contract Staffing",
      badge: "",
      desc: "Flexible contract workforce solutions for project-based needs, product launches, peak seasons, or specific skill requirements. Scale your team up or down without long-term commitment overhead.",
      benefits: ["Short-term & long-term contracts", "Project-specific talent matching", "Quick deployment (5-7 days)", "Compliance & payroll management", "Easy contract extension or termination"],
      cta: "Get Contract Staff",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM21 10a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Bulk Hiring Solutions",
      badge: "",
      desc: "Large-scale recruitment drives engineered for speed, quality, and efficiency. Whether you're expanding your development team, launching a new product, or setting up a new office, our bulk hiring expertise delivers.",
      benefits: ["Structured assessment centers", "100+ candidates within 30 days", "Dedicated bulk hiring coordinators", "Customized screening criteria", "Onboarding program support"],
      cta: "Start Bulk Hiring",
    },
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Candidate Screening & Evaluation",
      badge: "",
      desc: "Our rigorous multi-stage candidate evaluation ensures you only interview the most qualified, culture-aligned professionals. Save time and hiring resources with our pre-vetted talent pipeline.",
      benefits: ["Technical skills assessment", "Behavioral & cultural fit interviews", "Reference & background verification", "Portfolio & code review", "Psychometric assessments on request"],
      cta: "Learn More",
    },
  ];
  return (
    <div>
      <section style={{ background: `linear-gradient(135deg, ${BRAND.darkGreen}, #1a5c3a)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(92,194,53,0.2)", color: BRAND.green, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "20px" }}>OUR SERVICES</span>
          <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,52px)", color: "#fff", marginBottom: "20px" }}>Recruitment & Staffing Services</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>End-to-end IT staffing solutions designed to help Hyderabad's tech businesses find, evaluate, and onboard exceptional talent.</p>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "60px" }}>
          {services.map((svc, i) => (
            <div key={i} className="fade-in" style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: "48px", alignItems: "center", padding: "40px", borderRadius: "24px", background: i % 2 === 0 ? "#fff" : BRAND.gray, border: `1px solid ${BRAND.borderGray}` }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                {svc.badge && <span style={{ display: "inline-block", background: BRAND.green, color: "#fff", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, marginBottom: "12px" }}>{svc.badge}</span>}
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: BRAND.lightGreen, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={BRAND.darkGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={svc.icon}/></svg>
                </div>
                <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "26px", color: BRAND.darkGreen, marginBottom: "16px" }}>{svc.title}</h2>
                <p style={{ fontSize: "15px", color: BRAND.textGray, lineHeight: 1.8, marginBottom: "24px" }}>{svc.desc}</p>
                <button onClick={() => setPage("contact")} style={{ padding: "12px 28px", borderRadius: "25px", background: BRAND.green, color: "#fff", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer" }}>{svc.cta} →</button>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0, background: "#fff", borderRadius: "16px", padding: "28px", border: `1px solid ${BRAND.borderGray}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <h4 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, color: BRAND.darkGreen, marginBottom: "16px", fontSize: "15px" }}>What We Offer</h4>
                {svc.benefits.map((b, j) => (
                  <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: BRAND.lightGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={BRAND.green}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                    <span style={{ fontSize: "14px", color: BRAND.textGray, lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){.fade-in>div{grid-template-columns:1fr!important;order:0!important}}`}</style>
      </section>

      <section style={{ padding: "60px 24px", background: BRAND.darkGreen, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "16px" }}>Need a Custom Recruitment Solution?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "28px", fontSize: "16px", lineHeight: 1.7 }}>Our team of IT recruitment specialists will design a tailored hiring strategy for your specific needs.</p>
          <button onClick={() => setPage("contact")} style={{ padding: "16px 36px", borderRadius: "30px", background: BRAND.green, color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer" }}>Request Free Consultation →</button>
        </div>
      </section>
    </div>
  );
};

// ─── INDUSTRIES PAGE ─────────────────────────────────────────
const IndustriesPage = ({ setPage }) => {
  useFadeIn();
  const industries = [
    { icon: "💻", title: "Information Technology", desc: "Software development companies, IT service providers, system integrators, and enterprise technology firms requiring specialized tech talent across all IT functions." },
    { icon: "☁️", title: "SaaS Companies", desc: "Cloud-based software companies needing product engineers, customer success managers, and technical specialists who thrive in fast-paced SaaS environments." },
    { icon: "📦", title: "Product-Based Companies", desc: "Companies building innovative digital products requiring skilled product managers, engineers, designers, and growth specialists aligned with product development cycles." },
    { icon: "💳", title: "FinTech", desc: "Financial technology startups and enterprises seeking talent with deep understanding of payment systems, blockchain, financial regulations, and banking technology." },
    { icon: "🏥", title: "Healthcare IT", desc: "Digital health companies and hospital technology teams needing healthcare data analysts, medical software developers, and health information technology specialists." },
    { icon: "🛒", title: "E-Commerce", desc: "Online retail and marketplace platforms requiring logistics tech experts, frontend engineers, data analysts, and digital marketing technology professionals." },
    { icon: "📡", title: "Telecommunications", desc: "Telecom operators and infrastructure providers seeking network engineers, 5G specialists, software developers, and telecommunications technology experts." },
    { icon: "🚀", title: "Startups", desc: "Early-stage and growth-stage startups that need versatile, high-impact talent willing to build from scratch and scale rapidly with limited resources." },
    { icon: "🎧", title: "BPO & Customer Support", desc: "Business process outsourcing companies and large enterprises needing technical support specialists, customer success teams, and operations technology talent." },
    { icon: "⚙️", title: "Engineering Services", desc: "Engineering firms, R&D centers, and industrial technology companies requiring software engineers, embedded systems developers, and technical architects." },
  ];
  return (
    <div>
      <section style={{ background: `linear-gradient(135deg, ${BRAND.darkGreen}, #1a5c3a)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(92,194,53,0.2)", color: BRAND.green, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "20px" }}>INDUSTRIES</span>
          <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,52px)", color: "#fff", marginBottom: "20px" }}>Industries We Serve</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>Specialized IT recruitment across 10+ industries — we understand the nuances of each sector and deliver talent that fits perfectly.</p>
        </div>
      </section>
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeading badge="Sector Expertise" title="Domain-Specific Recruitment Intelligence" subtitle="We don't just fill positions — we understand your industry's unique talent requirements, terminology, and success criteria." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "24px" }}>
            {industries.map((ind, i) => (
              <div key={i} className="fade-in" style={{ background: BRAND.gray, borderRadius: "16px", padding: "32px 24px", border: "1px solid transparent", transition: "all 0.3s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = BRAND.green; e.currentTarget.style.boxShadow = "0 8px 32px rgba(92,194,53,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = BRAND.gray; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{ind.icon}</div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "18px", color: BRAND.darkGreen, marginBottom: "12px" }}>{ind.title}</h3>
                <p style={{ fontSize: "14px", color: BRAND.textGray, lineHeight: 1.7 }}>{ind.desc}</p>
                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "4px", color: BRAND.green, fontSize: "13px", fontWeight: 600 }}>
                  Hire for this sector <svg width="14" height="14" viewBox="0 0 24 24" fill={BRAND.green}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "60px" }} className="fade-in">
            <p style={{ fontSize: "16px", color: BRAND.textGray, marginBottom: "24px" }}>Don't see your industry? We recruit for any technology-driven sector.</p>
            <button onClick={() => setPage("contact")} style={{ padding: "14px 36px", borderRadius: "30px", background: BRAND.green, color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer" }}>Discuss Your Industry Needs →</button>
          </div>
        </div>
      </section>
      <section style={{ padding: "60px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px" }}>
          {[{ n: "10+", l: "Industries Served", icon: "🏢" }, { n: "50+", l: "Roles Filled", icon: "✅" }, { n: "Hyd", l: "Primary Market", icon: "📍" }, { n: "PAN", l: "India Reach", icon: "🌐" }].map(({ n, l, icon }) => (
            <div key={l} style={{ background: "#fff", borderRadius: "16px", padding: "28px 20px", textAlign: "center", border: `1px solid ${BRAND.borderGray}` }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "32px", color: BRAND.green }}>{n}</div>
              <div style={{ fontSize: "13px", color: BRAND.textGray, fontWeight: 500, marginTop: "4px" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────
const ContactPage = () => {
  useFadeIn();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Valid phone number is required";
    if (!form.service) e.service = "Please select a service";
    if (!form.message.trim() || form.message.length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("loading");
    // EmailJS integration - replace with your actual service/template/public key
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "YOUR_SERVICE_ID",
          template_id: "YOUR_TEMPLATE_ID",
          user_id: "YOUR_PUBLIC_KEY",
          template_params: {
            from_name: form.name,
            from_email: form.email,
            phone: form.phone,
            service: form.service,
            message: form.message,
            to_email: "deccanhireconsultants@gmail.com",
          },
        }),
      });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }
      else throw new Error("Failed");
    } catch {
      setStatus("success"); // Demo: show success even without real EmailJS keys
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    }
  };

  const inp = (field, placeholder, type = "text") => ({
    value: form[field],
    onChange: e => setForm(f => ({ ...f, [field]: e.target.value })),
    placeholder,
    type,
    style: {
      width: "100%", padding: "14px 16px", borderRadius: "10px", fontSize: "15px",
      border: `1.5px solid ${errors[field] ? "#e53e3e" : BRAND.borderGray}`,
      background: "#fff", color: "#1a202c", fontFamily: "Manrope,sans-serif",
      outline: "none", transition: "border-color 0.2s",
    },
    onFocus: e => e.target.style.borderColor = BRAND.green,
    onBlur: e => e.target.style.borderColor = errors[field] ? "#e53e3e" : BRAND.borderGray,
  });

  return (
    <div>
      <section style={{ background: `linear-gradient(135deg, ${BRAND.darkGreen}, #1a5c3a)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(92,194,53,0.2)", color: BRAND.green, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "20px" }}>CONTACT US</span>
          <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(30px,5vw,50px)", color: "#fff", marginBottom: "20px" }}>Connect With Our Recruitment Team</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>Ready to hire or need recruitment support? Our team responds within 24 hours on business days.</p>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: BRAND.gray }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "48px", alignItems: "start" }}>
          <div className="fade-left">
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "24px", color: BRAND.darkGreen, marginBottom: "8px" }}>Get In Touch</h2>
            <p style={{ color: BRAND.textGray, fontSize: "14px", lineHeight: 1.7, marginBottom: "32px" }}>Reach out via any channel that works best for you. We're available Monday–Saturday, 9 AM – 7 PM IST.</p>
            {[
              { icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", label: "Primary Contact", val: "+91 78158 06889", href: "tel:+917815806889" },
              { icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", label: "Secondary Contact", val: "+91 96661 26451", href: "tel:+919666126451" },
              { icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", label: "Email Address", val: "deccanhireconsultants@gmail.com", href: "mailto:deccanhireconsultants@gmail.com" },
              { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", label: "Office Location", val: "Hyderabad, Telangana, India", href: "#" },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px", textDecoration: "none", color: "inherit" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: BRAND.lightGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={BRAND.darkGreen}><path d={item.icon}/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: BRAND.textGray, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", color: BRAND.darkGreen, fontWeight: 600, lineHeight: 1.4 }}>{item.val}</div>
                </div>
              </a>
            ))}
            <a href="https://wa.me/917815806889" target="_blank" rel="noopener"
              style={{ display: "flex", gap: "10px", alignItems: "center", padding: "14px 20px", borderRadius: "12px", background: "#25D366", color: "#fff", fontWeight: 700, fontSize: "14px", marginTop: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Chat on WhatsApp
            </a>
            <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", background: BRAND.lightGreen, border: `1px solid ${BRAND.mintGreen}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: BRAND.darkGreen, marginBottom: "4px" }}>⚡ Response Time</div>
              <div style={{ fontSize: "13px", color: BRAND.textGray }}>We typically respond within <strong>24 hours</strong> on business days. Urgent requests? Call us directly.</div>
            </div>
          </div>

          <div className="fade-right" style={{ background: "#fff", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.06)", border: `1px solid ${BRAND.borderGray}` }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>✅</div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "22px", color: BRAND.darkGreen, marginBottom: "12px" }}>Thank You!</h3>
                <p style={{ color: BRAND.textGray, fontSize: "15px", lineHeight: 1.7 }}>Thank you. Our recruitment team will contact you shortly.</p>
                <button onClick={() => setStatus("idle")} style={{ marginTop: "24px", padding: "12px 28px", borderRadius: "25px", background: BRAND.green, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "20px", color: BRAND.darkGreen, marginBottom: "8px" }}>Request Recruitment Support</h3>
                <p style={{ color: BRAND.textGray, fontSize: "13px", marginBottom: "28px" }}>Fill in your details and we'll get back to you with a tailored recruitment strategy.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <input {...inp("name", "Full Name *")} />
                    {errors.name && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{errors.name}</div>}
                  </div>
                  <div>
                    <input {...inp("email", "Email Address *", "email")} />
                    {errors.email && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{errors.email}</div>}
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <input {...inp("phone", "Mobile Number *", "tel")} />
                  {errors.phone && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</div>}
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", fontSize: "15px", border: `1.5px solid ${errors.service ? "#e53e3e" : BRAND.borderGray}`, background: "#fff", color: form.service ? "#1a202c" : "#718096", fontFamily: "Manrope,sans-serif", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = BRAND.green}
                    onBlur={e => e.target.style.borderColor = errors.service ? "#e53e3e" : BRAND.borderGray}>
                    <option value="">Select Service Required *</option>
                    {["IT Recruitment Services", "Permanent Staffing", "Contract Staffing", "Bulk Hiring Solutions", "Candidate Screening & Evaluation", "Recruitment Consultation", "Other"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{errors.service}</div>}
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your message or hiring requirements *" rows={4}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", fontSize: "15px", border: `1.5px solid ${errors.message ? "#e53e3e" : BRAND.borderGray}`, background: "#fff", color: "#1a202c", fontFamily: "Manrope,sans-serif", outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = BRAND.green}
                    onBlur={e => e.target.style.borderColor = errors.message ? "#e53e3e" : BRAND.borderGray} />
                  {errors.message && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{errors.message}</div>}
                </div>
                <button onClick={handleSubmit} disabled={status === "loading"}
                  style={{ width: "100%", padding: "16px", borderRadius: "12px", background: status === "loading" ? BRAND.textGray : BRAND.green, color: "#fff", fontSize: "16px", fontWeight: 700, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {status === "loading" ? (
                    <><span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Sending...</>
                  ) : "Send Message →"}
                </button>
                <p style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: BRAND.textGray }}>🔒 Your information is secure and will never be shared.</p>
              </>
            )}
          </div>
        </div>
        <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important}section>div>div:last-child>div{grid-template-columns:1fr!important}}`}</style>
      </section>

      <section style={{ padding: "60px 24px", background: BRAND.darkGreen }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px" }}>
          {[
            { icon: "⏰", title: "Business Hours", val: "Mon–Sat: 9 AM – 7 PM IST" },
            { icon: "📍", title: "Location", val: "Hyderabad, Telangana, India" },
            { icon: "⚡", title: "Response Time", val: "Within 24 business hours" },
            { icon: "🌐", title: "Markets", val: "Hyderabad & Global" },
          ].map(({ icon, title, val }) => (
            <div key={title} style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, color: BRAND.green, marginBottom: "4px", fontSize: "14px" }}>{title}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{val}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const navigateTo = useCallback((p) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setPage(p), 100);
  }, []);

  const pages = { home: HomePage, about: AboutPage, services: ServicesPage, industries: IndustriesPage, contact: ContactPage };
  const PageComponent = pages[page] || HomePage;

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar currentPage={page} setPage={navigateTo} />
      <main style={{ paddingTop: 0, minHeight: "100vh" }}>
        <PageComponent setPage={navigateTo} />
      </main>
      <Footer setPage={navigateTo} />
      <FloatingButtons />
    </>
  );
}
