
import React, { useState } from "react";

const DangKy = () => {
	const [showPass, setShowPass] = useState(false);
	const [showRePass, setShowRePass] = useState(false);
	return (
		<div style={{ minHeight: '100vh', background:'#0077B6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<div style={{ width: 420, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '44px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 0, color: '#222' }}>Đăng ký tài khoản</h2>
				<div style={{ color: '#6c757d', fontSize: 17, marginBottom: 32, marginTop: 4 }}>Tạo tài khoản mới để sử dụng dịch vụ</div>
				<form style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
					<input type="text" placeholder="Họ và tên" style={{
						padding: '13px 18px',
						fontSize: 17,
						border: '1.5px solid #e0e0e0',
						borderRadius: 24,
						outline: 'none',
						width: '100%',
						background: '#fafbfc',
						transition: 'border 0.2s'
					}} />
					<input type="text" placeholder="Tên đăng nhập" style={{
						padding: '13px 18px',
						fontSize: 17,
						border: '1.5px solid #e0e0e0',
						borderRadius: 24,
						outline: 'none',
						width: '100%',
						background: '#fafbfc',
						transition: 'border 0.2s'
					}} />
					<input type="email" placeholder="Email" style={{
						padding: '13px 18px',
						fontSize: 17,
						border: '1.5px solid #e0e0e0',
						borderRadius: 24,
						outline: 'none',
						width: '100%',
						background: '#fafbfc',
						transition: 'border 0.2s'
					}} />
					<div style={{ position: 'relative' }}>
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
								background: '#fafbfc',
								transition: 'border 0.2s'
							}}
						/>
						<span
							style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#377d8a', fontSize: 15 }}
							onClick={() => setShowPass(v => !v)}
						>
							{showPass ? 'Ẩn' : 'Hiện'}
						</span>
					</div>
					<div style={{ position: 'relative' }}>
						<input
							type={showRePass ? "text" : "password"}
							placeholder="Nhập lại mật khẩu"
							style={{
								padding: '13px 18px',
								fontSize: 17,
								border: '1.5px solid #e0e0e0',
								borderRadius: 24,
								outline: 'none',
								width: '100%',
								background: '#fafbfc',
								transition: 'border 0.2s'
							}}
						/>
						<span
							style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#377d8a', fontSize: 15 }}
							onClick={() => setShowRePass(v => !v)}
						>
							{showRePass ? 'Ẩn' : 'Hiện'}
						</span>
					</div>
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
						Đăng ký
					</button>
				</form>
				<div style={{ width: '100%', maxWidth: 320, textAlign: 'center', marginTop: 18 }}>
					<span style={{ color: '#6c757d', fontSize: 15 }}>Đã có tài khoản? </span>
					<a href="/dangnhap" style={{ color: '#377d8a', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}>Đăng nhập</a>
				</div>
			</div>
		</div>
	);
};

export default DangKy;
