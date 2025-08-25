import React from "react"
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material"
import banner from "~/assets/banner1.jpg"
import MembershipCard from "./MembershipCard"

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
          <Typography variant="h2" fontWeight="bold" gutterBottom>
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

        <Box sx={{ mt: 4, display: "flex", gap: 4, justifyContent: "center" }}>
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

      {/* Dịch vụ */}
      <Container disableGutters sx={{ py: 8, bgcolor: "primary.main" }}>
        <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
          Dịch vụ nổi bật
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              title: "Gói thuê PT",
              desc: "Huấn luyện viên cá nhân đồng hành cùng bạn.",
            },
            {
              title: "Lớp tập nhóm",
              desc: "Không khí sôi động, đầy năng lượng.",
            },
            {
              title: "Gói tập Gym",
              desc: "Linh hoạt theo nhu cầu, giá cả hợp lý.",
            },
          ].map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {service.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Đội ngũ PT */}
      <Box sx={{ bgcolor: "info.main", py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            Đội ngũ Huấn luyện viên
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            Những chuyên gia thể hình giàu kinh nghiệm và tận tâm.
          </Typography>
          <Grid container spacing={4}>
            {["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"].map((name, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ textAlign: "center", borderRadius: 3, p: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        bgcolor: "secondary.main",
                        mx: "auto",
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" color="primary">
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chuyên môn: Fitness & Dinh dưỡng
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
          Học viên nói gì về chúng tôi
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            "Mình đã thay đổi vóc dáng sau 3 tháng tập tại THE GYM!",
            "PT rất nhiệt tình và chuyên nghiệp.",
            "Không gian tập thoải mái, máy móc hiện đại.",
          ].map((review, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  boxShadow: 2,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  "{review}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
