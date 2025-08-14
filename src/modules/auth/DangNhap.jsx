import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const socialIcons = [
	{
		name: "Facebook",
		color: "#3b5998",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#3b5998"/><path d="M15.36 8.26h-1.36c-.2 0-.36.16-.36.36v1.08h1.72c.2 0 .36.16.36.36v1.44c0 .2-.16.36-.36.36h-1.72v4.08c0 .2-.16.36-.36.36h-1.56a.36.36 0 0 1-.36-.36v-4.08h-1.08a.36.36 0 0 1-.36-.36v-1.44c0-.2.16-.36.36-.36h1.08v-.96c0-1.12.92-2.04 2.04-2.04h1.36c.2 0 .36.16.36.36v1.44c0 .2-.16.36-.36.36Z" fill="#fff"/></svg>
		)
	},
	{
		name: "Twitter",
		color: "#1da1f2",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1da1f2"/><path d="M19.633 7.997c-.457.203-.948.34-1.463.402a2.563 2.563 0 0 0 1.124-1.415 5.13 5.13 0 0 1-1.624.62A2.56 2.56 0 0 0 12.07 10.56c0 .2.022.395.065.582-2.13-.107-4.018-1.127-5.28-2.68a2.56 2.56 0 0 0-.346 1.288c0 .888.453 1.672 1.143 2.132a2.548 2.548 0 0 1-1.16-.32v.032c0 1.242.884 2.277 2.057 2.513a2.57 2.57 0 0 1-1.155.044c.326 1.018 1.273 1.76 2.395 1.78A5.14 5.14 0 0 1 5 17.07a7.25 7.25 0 0 0 3.93 1.15c4.72 0 7.3-3.91 7.3-7.3 0-.11-.003-.22-.008-.33.5-.36.93-.81 1.27-1.32Z" fill="#fff"/></svg>
		)
	},
	{
		name: "Google",
		color: "#ea4335",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#ea4335"/><path d="M17.64 12.2c0-.44-.04-.87-.12-1.28H12v2.43h3.18a2.72 2.72 0 0 1-1.18 1.78v1.48h1.9c1.12-1.03 1.76-2.55 1.76-4.41Z" fill="#fff"/><path d="M12 18c1.62 0 2.98-.54 3.97-1.47l-1.9-1.48c-.53.36-1.22.58-2.07.58-1.59 0-2.94-1.07-3.42-2.5H6.6v1.56A6 6 0 0 0 12 18Z" fill="#fff"/><path d="M8.58 13.13a3.6 3.6 0 0 1 0-2.26v-1.56H6.6a6 6 0 0 0 0 5.38l1.98-1.56Z" fill="#fff"/><path d="M12 8.5c.88 0 1.67.3 2.29.89l1.71-1.71C14.98 6.54 13.62 6 12 6a6 6 0 0 0-5.4 3.31l1.98 1.56c.48-1.43 1.83-2.5 3.42-2.5Z" fill="#fff"/></svg>
		)
	}
];

const DangNhap = () => {
	const [showPass, setShowPass] = useState(false);
	const navigate = useNavigate();
	return (
		<div style={{ minHeight: '100vh', background: '#0077B6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<div style={{ width: 800, maxWidth: '98vw', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', display: 'flex', overflow: 'hidden' }}>
				{/* Left: Login Form */}
				<div style={{ flex: 1, padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
					<h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 0, color: '#222' }}>Đăng nhập</h2>
					<div style={{ color: '#6c757d', fontSize: 18, marginBottom: 32, marginTop: 4 }}>để vào tài khoản của bạn</div>
					<form style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
						<input type="text" placeholder="Tên đăng nhập" style={{
							padding: '13px 18px',
							fontSize: 17,
							border: '1.5px solid #e0e0e0',
							borderRadius: 24,
							outline: 'none',
							width: '100%',
							marginBottom: 0,
							background: '#fafbfc',
							transition: 'border 0.2s'
						}} />
						<input
							type={showPass ? "text" : "password"}
							placeholder="Mật khẩu"
							style={{
								padding: '13px 18px',
								fontSize: 17,
								border: '1.5px solid #e0e0e0',
								borderRadius: 24,
								outline: 'none',
								width: '100%',
								marginBottom: 0,
								background: '#fafbfc',
								transition: 'border 0.2s'
							}}
						/>
						<button
							type="button"
							onClick={() => setShowPass(v => !v)}
							style={{
								position: 'absolute',
								right: 40,
								top: 0,
								background: 'none',
								border: 'none',
								color: '#6c757d',
								cursor: 'pointer',
								fontSize: 15,
								marginTop: 70
							}}
							tabIndex={-1}
						>
							{showPass ? 'Ẩn' : 'Hiện'}
						</button>
						<button
							type="submit"
							style={{
								padding: '13px',
								fontSize: 18,
								background: '#0077B6',
								color: '#fff',
								border: 'none',
								borderRadius: 24,
								fontWeight: 700,
								marginTop: 8,
								letterSpacing: 1,
								boxShadow: '0 2px 8px rgba(55,125,138,0.08)'
							}}
						>
							Đăng nhập
						</button>
					</form>
					<div style={{ width: '100%', maxWidth: 320, textAlign: 'right', marginTop: 10 }}>
						<span
							style={{ color: '#b0b8be', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }}
							onClick={() => navigate('/quenmk')}
						>
							Quên mật khẩu?
						</span>
					</div>
				</div>
				{/* Center Divider with OR */}
				<div style={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative' }}>
					<div style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%,-50%)',
						background: '#fff',
						borderRadius: '50%',
						width: 44,
						height: 44,
						boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 700,
						color: '#377d8a',
						fontSize: 20,
						zIndex: 2
					}}>hoặc</div>
				</div>
				{/* Right: Social Login & Image */}
				<div style={{ flex: 1, background: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80) center/cover', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 420 }}>
					<div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 16, padding: '36px 24px', color: '#fff', textAlign: 'center', width: '90%', maxWidth: 320 }}>
						<h3 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Đăng ký</h3>
						<div style={{ fontSize: 17, margin: '10px 0 24px 0', fontWeight: 400 }}>với một trong những hồ sơ xã hội của bạn</div>
						<div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
							{socialIcons.map((s) => (
								<button key={s.name} title={s.name} style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									padding: 0,
									outline: 'none',
									borderRadius: '50%',
									transition: 'transform 0.1s',
									boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
								}}>{s.icon}</button>
							))}
						</div>
						<div style={{ fontSize: 15, marginTop: 18 }}>
							Bạn chưa có tài khoản?{' '}
							<span
								style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}
								onClick={() => navigate('/dangky')}
							>
								Đăng ký
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DangNhap;
