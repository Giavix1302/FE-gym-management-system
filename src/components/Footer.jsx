
import logo from "../assets/foter.jpg";
const COLOR_BLUE = "#0077B6";
const COLOR_WHITE = "#FFFFFF";
const COLOR_ORANGE = "#FF6B35";

const socialLinks = [
  {
    href: "https://facebook.com",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="#fff"/>
        <circle cx="32" cy="32" r="25" fill="#FF6B35"/>
        <circle cx="32" cy="32" r="20" fill="#0077B6"/>
        <path d="M39 27.5h-3.2v-2.1c0-.8.5-1 .9-1h2.3v-4.3l-3.2-.02c-3.6 0-4.4 2.7-4.4 4.4v2.9h-2.3v4.4h2.3v12.6h4.4v-12.6h3l.4-4.4z" fill="#fff"/>
      </svg>
    ),
    label: "Facebook"
  },
  {
    href: "https://instagram.com",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" fill="none" stroke="#fff" strokeWidth="4"/>
        <circle cx="28" cy="28" r="18" fill="none" stroke="#fff" strokeWidth="2.5"/>
        <circle cx="28" cy="28" r="8" fill="none" stroke="#fff" strokeWidth="2.5"/>
        <circle cx="38" cy="18" r="2" fill="#fff"/>
      </svg>
    ),
    label: "Instagram"
  },
  {
    href: "https://tiktok.com",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" fill="none" stroke="#fff" strokeWidth="4"/>
        <path d="M40 23c-1.7 0-3.1-.5-4.3-1.4V38c0 4-3.3 7.3-7.3 7.3s-7.3-3.3-7.3-7.3 3.3-7.3 7.3-7.3c.2 0 .5 0 .7.04v3.1c-.2-.03-.5-.04-.7-.04-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5V18h3.6c.4 1.7 1.7 3 3.2 3.2V23z" fill="#fff"/>
      </svg>
    ),
    label: "TikTok"
  },
  {
    href: "https://youtube.com",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" fill="none" stroke="#fff" strokeWidth="4"/>
        <polygon points="24,20 40,28 24,36" fill="#fff"/>
      </svg>
    ),
    label: "YouTube"
  }
];

export default function Footer() {
  return (
    <footer style={{ background: COLOR_BLUE, color: COLOR_WHITE, padding: 0, marginTop: 40, fontFamily: 'inherit', fontWeight: 400 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 0 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: "0 40px" }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <img src={logo} alt="The Gym" style={{ height: 90, marginBottom: 16,  padding: 8 }} />
            <div>
              <button style={{
                background: COLOR_ORANGE,
                color: COLOR_WHITE,
                fontWeight: 700,
                border: "none",
                borderRadius: 40,
                padding: "18px 48px",
                fontSize: 22,
                cursor: "pointer",
                marginTop: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                letterSpacing: 1
              }}>
                Tải Ngay App Tập Luyện
              </button>
            </div>
          </div>
        </div>
        <hr style={{ border: 0, borderTop: `2px solid ${COLOR_WHITE}33`, margin: "40px 0 32px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", padding: "0 40px" }}>
          <div style={{ flex: 1, minWidth: 260, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16, color: COLOR_WHITE }}>Thông Tin Chung</div>
            <div style={{ fontSize: 18, lineHeight: 2 }}>
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Về The Gym</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Hệ Thống Phòng Tập</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Tuyển Dụng</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Tin Tức</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Liên Hệ</a>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16, color: COLOR_WHITE }}>Thông Tin Chính Sách</div>
            <div style={{ fontSize: 18, lineHeight: 2 }}>
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Chính Sách Bảo Mật</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Chăm Sóc Khách Hàng / Liên Hệ</a><br />
              <a href="#" style={{ color: COLOR_WHITE, textDecoration: "none" }}>Điều Khoản & Điều Kiện</a>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 320, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16, color: COLOR_WHITE }}>Fanpage</div>
            <div style={{ borderRadius: 8, overflow: "hidden", background: COLOR_WHITE }}>
              <iframe
                title="The Gym Fanpage"
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fthenewgym.vn&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="100%"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
        <hr style={{ border: 0, borderTop: `2px solid ${COLOR_WHITE}33`, margin: "32px 0 24px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: "0 40px 24px 40px" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: COLOR_WHITE }}>
            Copyright © 2025 The Gym
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: COLOR_WHITE }}>Theo dõi chung tôi tại:</span>
            {socialLinks.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: idx === 0 ? 80 : 56,
                  height: idx === 0 ? 80 : 56,
                  borderRadius: "50%",
                  background: "transparent",
                  marginLeft: 8,
                  boxShadow: idx === 0 ? `0 0 0 4px #fff` : undefined,
                  position: "relative"
                }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}