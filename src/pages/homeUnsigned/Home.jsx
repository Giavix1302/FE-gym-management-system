// react
import React from "react"
// mui
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material"
import MembershipCard from "./MembershipCard"
// icon
// src
import banner from "~/assets/banner1.jpg"
import intro1 from "~/assets/intro1.jpg"
import intro2 from "~/assets/intro2.jpg"
import intro3 from "~/assets/intro3.jpg"
import intro4 from "~/assets/intro4.jpg"
import SplitLayout from "./SplitLayout"

function Home() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "700px", // set chiều cao banner
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)", // lớp mờ đen 40%
            zIndex: 1,
          },
        }}
      >
        {/* Nội dung chồng lên ảnh */}
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            position: "relative",
            zIndex: 2, // phải cao hơn overlay
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "2rem", sm: "3.75rem" } }}>
            CHÀO MỪNG ĐẾN VỚI THE GYM
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Nơi biến ước mơ vóc dáng thành hiện thực
          </Typography>
          <Button variant="contained" color="warning" size="large">
            Đăng ký ngay
          </Button>
        </Container>
      </Box>

      {/* Hội viên The Gym */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
          HỘI VIÊN THE GYM
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          THE GYM cung cấp gói Hội viên gói tập Tất Cả Chi Nhánh và 1 Chi Nhánh. Cả hai đều cho bạn tham gia tập luyện
          không giới hạn trong không gian{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Không phán xét
          </Typography>
          , nơi mọi người cảm thấy được chào đón từ khi bước vào.
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
          }}
        >
          <MembershipCard
            content={{
              duration: "1 Tháng",
              price: 399000,
              description:
                "Tập luyện tại toàn hệ thống The Gym trên toàn quốc, miễn phí kiểm tra sức khỏe và sai lệch tư thế, và nhiều hơn nữa!",
              location: "Tất cả chi nhánh",
            }}
          />
          <MembershipCard
            contrast={true}
            content={{
              duration: "1 Tháng",
              price: 399000,
              description:
                "Tập luyện tại toàn hệ thống The Gym trên toàn quốc, miễn phí kiểm tra sức khỏe và sai lệch tư thế, và nhiều hơn nữa!",
              location: "Tất cả chi nhánh",
            }}
          />
        </Box>
      </Container>

      {/* Hướng dẫn tập luyện miễn phí */}
      <Container maxWidth="xl" disableGutters sx={{ py: 8, bgcolor: "info.main" }}>
        <SplitLayout
          content={{
            heading: "Hướng dẫn tập luyện miễn phí",
            descriptions: [
              "The Gym khuyến khích bạn nên tham gia các lớp học hướng dẫn cơ bản để dễ dàng hơn trong việc sử dụng các thiết bị tập luyện, khu vực chức năng và tận hưởng tất cả tiện ích của The Gym. Đội ngũ The Gym thân thiện và chuyên nghiệp luôn sẵn sàng giúp đỡ các bạn.",
            ],
            img: intro2,
          }}
        />
      </Container>

      {/* THÊM BẠN THÊM VUI */}
      <Box sx={{ bgcolor: "", py: 8 }}>
        <SplitLayout
          content={{
            heading: "THÊM BẠN THÊM VUI",
            descriptions: [
              "Bạn của bạn là bạn của The Gym.",
              "Thêm một người bạn tập luyện sẽ tạo ra niềm vui và động lực không ngừng. Hội viên khi giới thiệu bạn mới đăng ký gói tập ở tất cả chi nhánh, cả hai bạn sẽ nhận được 2 tuần tập luyện miễn phí. Thêm bạn thêm vui!",
              "Truy cập ứng dụng The Gym và cùng mang bạn bè đến tập luyện thôi nào!",
            ],
            img: intro4,
          }}
          reverse={true}
        />
      </Box>

      {/* THAM QUAN PHÒNG TẬP MỞ CỬA 24/7 */}
      <Container maxWidth="xl" disableGutters sx={{ py: 8, bgcolor: "info.main" }}>
        <SplitLayout
          content={{
            heading: "THAM QUAN PHÒNG TẬP MỞ CỬA 24/7",
            descriptions: [
              "Dù bạn đang tìm kiếm điều gì ở một phòng gym, The Gym đều có lựa chọn phù hợp dành cho bạn.",
              "Cùng The Gym tham quan không gian thân thiện, chào đón phù hợp với tất cả mọi người. Bạn sẽ tìm hiểu tất cả về các khu vực khác nhau của câu lạc bộ và Nick sẽ chỉ cho bạn cách tận dụng tối đa thẻ hội viên của mình. Đây sẽ là nơi bạn có thể bắt đầu hành trình rèn luyện sức khỏe của mình.",
            ],
            img: intro3,
          }}
        />
      </Container>

      {/* MỚI ! HƯỚNG DẪN TẬP LUYỆN TRONG APP */}
      <Box sx={{ bgcolor: "", py: 8 }}>
        <SplitLayout
          content={{
            heading: "MỚI ! HƯỚNG DẪN TẬP LUYỆN TRONG APP",
            descriptions: [
              "The New Gym luôn muốn chia sẻ đến quý hội viên nguồn cảm hứng bất tận cho các buổi tập hiệu quả, những bí quyết sống khỏe, và những lời khuyên tập luyện hữu ích.",
              "Để đảm bảo cho hành trình sức khỏe của bạn tại The New Gym được đảm bảo chất lượng tốt nhất, đừng quên tham khảo những thông tin hữu ích được cập nhật thường xuyên tại đây nhé!",
            ],
            img: intro1,
          }}
          reverse={true}
        />
      </Box>
    </Box>
  )
}

export default Home
