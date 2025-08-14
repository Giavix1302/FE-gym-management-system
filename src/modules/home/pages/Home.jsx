import React from "react";
import Header from "../../../components/Header";
import "../../../styles/global.css";


const COLOR_BLUE = '#0077B6';
const COLOR_WHITE = '#FFFFFF';
const COLOR_ORANGE = '#FF6B35';

const Home = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#fff',
                color: '#444',
                padding: 0,
                margin: 0,
                width: '100vw',
                boxSizing: 'border-box',
            }}
        >
            {/* HERO */}
				<section
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '0px 0 0px 0',
						background: '#fff',
						minHeight: 520,
						border: 'none',
						boxShadow: 'none',
						position: 'relative',
						width: '100%',
						maxWidth: 1400,
						margin: '0 auto',
					}}
				>
				{/* Box chữ lớn */}
				

				{/* Ảnh minh họa lớn */}
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					padding: 0,
					margin: '0 auto',
					zIndex: 2,
					position: 'relative',
				}}>
					<img
						src="/src/assets/banner.webp"
						alt="Grand Opening"
						style={{
							display: 'block',
							width: '100%',
							maxWidth: '100%',
							height: '100%',
							borderRadius: 32,
							boxShadow: '0 8px 40px #0077b6aa',
							background: COLOR_WHITE,
							padding: 0,
							margin: '0 auto',
						}}
					/>
				</div>
			</section>

				
			{/* BẢNG GIÁ & ƯU ĐÃI */}
			   <section
				   style={{
					   background: '#fff',
					   color: COLOR_BLUE,
					   margin: '0 auto',
					   maxWidth: 1200,
					   padding: '60px 0 60px 0',
					   marginTop: 0,
					   marginBottom: 0,
					   border: 'none',
					   boxShadow: 'none',
				   }}
			   >
				<h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 900, marginBottom: 18, color: COLOR_BLUE }}>HỘI VIÊN THE GYM</h2>
				<p style={{ textAlign: 'center', color: '#333', fontSize: 18, marginBottom: 32, fontWeight: 500 }}>
					The Gym cung cấp gói hội viên tập tất cả chi nhánh và 1 chi nhánh. Tập luyện không giới hạn, không phán xét, chào đón mọi người!
				</p>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
					{/* Gói toàn hệ thống */}
					<div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 400, background: COLOR_BLUE, borderRadius: 18, padding: 32, color: COLOR_WHITE, boxShadow: `0 2px 16px #0077b655`, position: 'relative',  }}>
						<div style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>1 THÁNG</div>
				/	<div style={{ background: COLOR_ORANGE, color: COLOR_WHITE, borderRadius: 8, display: 'inline-block', padding: '4px 16px', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>TẤT CẢ CHI NHÁNH</div>
						<div style={{ fontWeight: 900, fontSize: 36, margin: '16px 0',  }}>399.000 <span style={{ fontSize: 20, color: COLOR_WHITE, fontWeight: 700 }}>₫</span> / tháng</div>
						<div style={{ fontSize: 16, marginBottom: 18 }}>Tập luyện toàn hệ thống The Gym, miễn phí kiểm tra sức khỏe, sai lệch tư thế, và nhiều hơn nữa!</div>
						<div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
							<a href="#" style={{ color: COLOR_WHITE, fontWeight: 700, textDecoration: 'underline', fontSize: 16 }}>Xem chi tiết</a>
							<button style={{ background: COLOR_ORANGE, color: COLOR_WHITE, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginLeft: 8 }}>Tham gia</button>
						</div>
					</div>
					{/* Gói 1 chi nhánh */}
					<div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 400, background: COLOR_WHITE, borderRadius: 18, padding: 32, color: COLOR_BLUE, boxShadow: `0 2px 16px #0077b655`, position: 'relative', border: `2px solid #b3e6fa` }}>
						<div style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>1 THÁNG</div>
						<div style={{ background:COLOR_ORANGE, color: COLOR_BLUE, borderRadius: 8, display: 'inline-block', padding: '4px 16px', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>1 CHI NHÁNH</div>
						<div style={{ fontWeight: 900, fontSize: 36, margin: '16px 0', color: COLOR_BLUE }}>299.000 <span style={{ fontSize: 20, color: COLOR_BLUE, fontWeight: 700 }}>₫</span> / tháng</div>
						<div style={{ fontSize: 16, marginBottom: 18 }}>Tập luyện không giới hạn tại 1 câu lạc bộ đăng ký!</div>
						<div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
							<a href="#" style={{ color: COLOR_BLUE, fontWeight: 700, textDecoration: 'underline', fontSize: 16 }}>Xem chi tiết</a>
							<button style={{ background: COLOR_BLUE, color: COLOR_WHITE, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginLeft: 8 }}>Tham gia</button>
						</div>
					</div>
				</div>
			</section>

			{/* GIỚI THIỆU */}
			   <section
				   style={{
					   background: '#fff',
					   color: '#444',
					   margin: '0 auto',
					   maxWidth: 1200,
					   padding: '60px 0 60px 0',
					   marginBottom: 0,
					   display: 'flex',
					   flexWrap: 'wrap',
					   alignItems: 'center',
					   gap: 48,
				   }}
			   >
				<div style={{ flex: '1 1 420px', minWidth: 320, maxWidth: 600, padding: 24 }}>
					<h2 style={{ fontWeight: 900, fontSize: '2rem', color: COLOR_BLUE, marginBottom: 18 }}>CHÀO MỪNG BẠN ĐẾN VỚI THE GYM</h2>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 24, fontWeight: 500 }}>
						Chúng tôi tạo ra môi trường nơi mọi người đều cảm thấy thoải mái tập luyện một mình hoặc cùng bạn bè, bất kể trình độ thể chất và hiểu biết về gym như thế nào mà không bao giờ lo lắng về việc bị đánh giá.
					</p>
					<a href="#" style={{ color: COLOR_BLUE, fontWeight: 700, fontSize: 18, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
						<span style={{ fontSize: 22 }}>→</span> Tìm hiểu thêm
					</a>
				</div>
				<div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 420, textAlign: 'center', padding: 24 }}>
					<img src="/src/assets/anhminhhoa.jpg" alt="Giới thiệu The Gym" style={{ width: '100%', maxWidth: 340, borderRadius: 24, background: '#eaf8fd', padding: 8, boxShadow: '0 2px 12px #0077b622' }} />
				</div>
			</section>

			{/* HƯỚNG DẪN TẬP LUYỆN MIỄN PHÍ */}
			   <section
				   style={{
					   background: '#fff',
					   color: '#444',
					   margin: '0 auto',
					   maxWidth: 1200,
					   padding: '60px 0 60px 0',
					   marginBottom: 0,
					   display: 'flex',
					   flexWrap: 'wrap',
					   alignItems: 'center',
					   gap: 48,
				   }}
			   >
				<div style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 420, textAlign: 'center', padding: 24 }}>
					<img src="/src/assets/anhminhhoa.jpg" alt="Hướng dẫn tập luyện miễn phí" style={{ width: '100%', maxWidth: 340, borderRadius: 24, background: '#eaf8fd', padding: 8, boxShadow: '0 2px 12px #0077b622', objectFit: 'cover' }} />
				</div>
				<div style={{ flex: '2 1 480px', minWidth: 320, maxWidth: 700, padding: 24 }}>
					<h2 style={{ fontWeight: 900, fontSize: '2rem', color: '#444', marginBottom: 18, textAlign: 'left' }}>HƯỚNG DẪN TẬP LUYỆN MIỄN PHÍ</h2>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 24, fontWeight: 500, textAlign: 'left' }}>
						The New Gym khuyến khích bạn nên tham gia các lớp học hướng dẫn cơ bản để dễ dàng hơn trong việc sử dụng các thiết bị tập luyện, khu vực chức năng và tận hưởng tất cả tiện ích của The New Gym. Đội ngũ The New Gym thân thiện và chuyên nghiệp luôn sẵn sàng giúp đỡ các bạn.
					</p>
					<a href="#" style={{ color: COLOR_BLUE, fontWeight: 700, fontSize: 18, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
						<span style={{ fontSize: 22 }}>→</span> Tìm hiểu thêm
					</a>
				</div>
			</section>

			{/* THÊM BẠN THÊM VUI */}
			   <section
				   style={{
					   background: '#fff',
					   color: '#444',
					   margin: '0 auto',
					   maxWidth: 1200,
					   padding: '60px 0 60px 0',
					   marginBottom: 0,
					   display: 'flex',
					   flexWrap: 'wrap',
					   alignItems: 'center',
					   gap: 48,
				   }}
			   >
				<div style={{ flex: '2 1 480px', minWidth: 320, maxWidth: 700, padding: 24 }}>
					<h2 style={{ fontWeight: 900, fontSize: '2rem', color: '#444', marginBottom: 18, textAlign: 'left' }}>THÊM BẠN THÊM VUI</h2>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 12, fontWeight: 500, textAlign: 'left' }}>
						Bạn của bạn là bạn của The New Gym.
					</p>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 12, fontWeight: 500, textAlign: 'left' }}>
						Thêm một người bạn tập luyện sẽ tạo ra niềm vui và động lực không ngừng. Hội viên khi giới thiệu bạn mới đăng ký gói tập ở tất cả chi nhánh, cả hai bạn sẽ nhận được 2 tuần tập luyện miễn phí. Thêm bạn thêm vui!
					</p>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 24, fontWeight: 500, textAlign: 'left' }}>
						Truy cập ứng dụng The New Gym và cùng mang bạn bè đến tập luyện thôi nào!
					</p>
					<a href="#" style={{ color: COLOR_BLUE, fontWeight: 700, fontSize: 18, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
						<span style={{ fontSize: 22 }}>→</span> Giới thiệu bạn
					</a>
				</div>
				<div style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 420, textAlign: 'center', padding: 24 }}>
					<img src="/src/assets/anhminhhoa.jpg" alt="Thêm bạn thêm vui" style={{ width: '100%', maxWidth: 340, borderRadius: 24, background: '#eaf8fd', padding: 8, boxShadow: '0 2px 12px #0077b622', objectFit: 'cover' }} />
				</div>
			</section>

						{/* THAM QUAN PHÒNG TẬP MỞ CỬA 24/7 */}
						   <section
							   style={{
								   background: '#fff',
								   color: '#444',
								   margin: '0 auto',
								   maxWidth: 1200,
								   padding: '60px 0 60px 0',
								   marginBottom: 0,
								   display: 'flex',
								   flexWrap: 'wrap',
								   alignItems: 'center',
								   gap: 48,
							   }}
						   >
				<div style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 520, textAlign: 'center', padding: 24 }}>
					<img src="/src/assets/anhminhhoa.jpg" alt="Tham quan phòng tập mở cửa 24/7" style={{ width: '100%', maxWidth: 440, borderRadius: 24, background: '#eaf8fd', padding: 8, boxShadow: '0 2px 12px #0077b622', objectFit: 'cover' }} />
				</div>
				<div style={{ flex: '2 1 480px', minWidth: 320, maxWidth: 700, padding: 24 }}>
					<h2 style={{ fontWeight: 900, fontSize: '2rem', color: '#444', marginBottom: 8, textAlign: 'left', lineHeight: 1.2 }}>THAM QUAN PHÒNG TẬP MỞ CỬA<br/>24/7</h2>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 12, fontWeight: 500, textAlign: 'left' }}>
						Dù bạn đang tìm kiếm điều gì ở một phòng gym, The New Gym đều có lựa chọn phù hợp dành cho bạn.
					</p>
					<p style={{ fontSize: 18, color: '#444', marginBottom: 24, fontWeight: 500, textAlign: 'left' }}>
						Cùng The New Gym tham quan không gian thân thiện, chào đón phù hợp với tất cả mọi người. Bạn sẽ tìm hiểu tất cả về các khu vực khác nhau của câu lạc bộ và Nick sẽ chỉ cho bạn cách tận dụng tối đa thể hội viên của mình. Đây sẽ là nơi bạn có thể bắt đầu hành trình rèn luyện sức khỏe của mình.
					</p>
					<a href="#" style={{ color: COLOR_BLUE, fontWeight: 700, fontSize: 18, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
						<span style={{ fontSize: 22 }}>→</span> Khám phá không gian The New Gym
					</a>
				</div>
			</section>
			

				{/* HỆ THỐNG PHÒNG TẬP */}
				   <section
					   style={{
						   background: '#fff',
						   color: '#222',
						   margin: '0 auto',
						   maxWidth: 1200,
						   padding: '60px 0 60px 0',
						   marginBottom: 0,
						   display: 'flex',
						   flexWrap: 'wrap',
						   alignItems: 'center',
						   gap: 48,
					   }}
				   >
					<div style={{ flex: '2 1 480px', minWidth: 320, maxWidth: 700, padding: 24 }}>
						<h2 style={{ fontWeight: 900, fontSize: '2.2rem', color: '#444', marginBottom: 18 }}>
							HỆ THỐNG PHÒNG TẬP
						</h2>
						<p style={{ fontSize: 18, color: '#444', marginBottom: 18, fontWeight: 500 }}>
							The New Gym tin rằng mọi người, ở mọi nơi, đều nên được tiếp cận với hoạt động thể chất và những lợi ích tuyệt vời về thể chất, tinh thần và cảm xúc mà nó mang lại.
						</p>
						<p style={{ fontSize: 18, color: '#444', marginBottom: 18, fontWeight: 500 }}>
							Hệ thống The New Gym hiện có hơn 14 phòng tập, tập trung ở các thành phố lớn: TP. HCM, Biên Hòa, Cần Thơ, Vũng Tàu, Đà Nẵng. Hãy tìm câu lạc bộ gần bạn nhất để bắt đầu những trải nghiệm tuyệt vời tại The New Gym!
						</p>
						<a href="#" style={{ color: '#00AEEF', fontWeight: 700, fontSize: 20, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
							<span style={{ fontSize: 22 }}>→</span> Tìm phòng tập
						</a>
					</div>
					<div style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 420, textAlign: 'center', padding: 24 }}>
						<img src="/src/assets/anhminhhoa.jpg" alt="Hệ thống phòng tập The New Gym" style={{ width: '100%', maxWidth: 380, borderRadius: 24, background: '#eaf8fd', padding: 8, boxShadow: '0 2px 12px #0077b622', objectFit: 'contain' }} />
					</div>
				</section>

				{/* TÍNH NĂNG TẬP LUYỆN APP THE NEW GYM */}
				   <section
					   style={{
						   background: '#fff',
						   color: '#222',
						   margin: '0 auto',
						   maxWidth: 1200,
						   padding: '60px 0 60px 0',
						   marginBottom: 0,
						   display: 'flex',
						   flexWrap: 'wrap',
						   alignItems: 'center',
						   gap: 48,
					   }}
				   >
					<div style={{ flex: '1 1 420px', minWidth: 320, maxWidth: 480, textAlign: 'center', padding: 24 }}>
						<img src="/src/assets/anhminhhoa.jpg" alt="Tính năng tập luyện app The New Gym" style={{ width: '100%', maxWidth: 380, borderRadius: 24, background: '#eaf8fd', padding: 0, boxShadow: '0 2px 12px #0077b622', objectFit: 'cover' }} />
					</div>
					<div style={{ flex: '2 1 600px', minWidth: 320, maxWidth: 700, padding: 24 }}>
						<h2 style={{ fontWeight: 900, fontSize: '2.2rem', color: '#444', marginBottom: 18, textAlign: 'left', lineHeight: 1.2 }}>
							MỚI ! HƯỚNG DẪN TẬP LUYỆN TRONG APP
						</h2>
						<p style={{ fontSize: 18, color: '#444', marginBottom: 18, fontWeight: 500, textAlign: 'left' }}>
							The New Gym luôn muốn chia sẻ đến quý hội viên nguồn cảm hứng bất tận cho các buổi tập hiệu quả, những bí quyết sống khỏe, và những lời khuyên tập luyện hữu ích.
						</p>
						<p style={{ fontSize: 18, color: '#444', marginBottom: 18, fontWeight: 500, textAlign: 'left' }}>
							Để đảm bảo cho hành trình sức khỏe của bạn tại The New Gym được đảm bảo chất lượng tốt nhất, đừng quên tham khảo những thông tin hữu ích được cập nhật thường xuyên tại đây nhé!
						</p>
						<a href="#" style={{ color: '#00AEEF', fontWeight: 700, fontSize: 20, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
							<span style={{ fontSize: 22 }}>→</span> Xem thêm
						</a>
					</div>
				</section>

	<section
		style={{
			background: '#fff',
			color: '#444',
			margin: '0 auto',
			maxWidth: 1200,
			padding: '36px 18px 30px 18px',
			marginBottom: 40,
			display: 'flex',
			flexWrap: 'wrap',
			alignItems: 'center',
			gap: 32,
			justifyContent: 'center',
		}}
	>
  <div
		style={{
			flex: '2 1 600px',
			minWidth: 320,
			maxWidth: 700,
			padding: 24,
			color: '#444',
		}}
  >
    <h2
			style={{
				fontWeight: 900,
				fontSize: '2.2rem',
				color: '#444',
				marginBottom: 18,
				textAlign: 'left',
				lineHeight: 1.2,
			}}
    >
      TẢI ỨNG DỤNG THE NEW GYM
    </h2>
    <p
			style={{
				fontSize: 18,
				color: '#444',
				marginBottom: 18,
				fontWeight: 500,
				textAlign: 'left',
			}}
    >
      Ứng dụng The New Gym cho bạn tất cả tiện ích bạn cần: ra/vào phòng tập 24/7, quản lý gói tập, chọn lớp học miễn phí, theo dõi các hoạt động của bạn và nhiều hơn thế nữa!
    </p>
    <p
			style={{
				fontSize: 18,
				color: '#444',
				marginBottom: 0,
				fontWeight: 500,
				textAlign: 'left',
			}}
    >
      Bạn đã sẵn sàng chưa?
    </p>
    <p
			style={{
				fontSize: 18,
				color: '#444',
				marginBottom: 18,
				fontWeight: 500,
				textAlign: 'left',
			}}
    >
      Hãy cùng bước vào môi trường tập luyện không phán xét hôm nay!
    </p>
    <a
			href="#"
			style={{
				color: '#00AEEF',
				fontWeight: 700,
				fontSize: 20,
				textDecoration: 'underline',
				display: 'inline-flex',
				alignItems: 'center',
				gap: 8,
				marginTop: 12,
			}}
    >
      <span style={{ fontSize: 22 }}>→</span> Tải ứng dụng ngay!
    </a>
  </div>
	<div
		style={{
			flex: '1 1 420px',
			minWidth: 320,
			maxWidth: 480,
			textAlign: 'center',
			padding: 24,
		}}
	>
		<img
			src="/src/assets/anhminhhoa.jpg"
			alt="Tải ứng dụng The New Gym"
			style={{
				width: '100%',
				maxWidth: 380,
				background: '#fff',
				padding: 0,
				objectFit: 'cover',
				boxShadow: 'none',
			}}
		/>
	</div>
</section>



			{/* CALL TO ACTION */}
			   <section
				   style={{ textAlign: 'center', margin: '0 auto', maxWidth: 900, padding: '60px 0 60px 0' }}
			   >
				   <h3
					   style={{ color: COLOR_BLUE, fontWeight: 900, fontSize: '1.7rem', marginBottom: 18 }}
				   >
					   Sẵn sàng thay đổi bản thân? <span style={{ color: COLOR_ORANGE }}>Tham gia ngay!</span>
				   </h3>
				   <button
					   style={{
						   background: COLOR_ORANGE,
						   color: COLOR_WHITE,
						   border: 'none',
						   borderRadius: 8,
						   padding: '16px 48px',
						   fontSize: '1.2rem',
						   fontWeight: 700,
						   cursor: 'pointer',
						   boxShadow: '0 2px 8px #FF6B3533',
						   transition: 'background 0.2s',
						   letterSpacing: 1
					   }}
					   onMouseOver={e => e.currentTarget.style.background = '#e65a22'}
					   onMouseOut={e => e.currentTarget.style.background = COLOR_ORANGE}
				   >
					   Đăng ký thành viên
				   </button>
			   </section>
		</div>
	);
};

export default Home;
