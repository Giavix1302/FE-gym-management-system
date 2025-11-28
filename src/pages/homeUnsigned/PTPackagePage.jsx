import { Box, Container, Typography, Grid, Card, CardContent, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import TrackChangesIcon from "@mui/icons-material/TrackChanges"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import BuildIcon from "@mui/icons-material/Build"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ScheduleIcon from "@mui/icons-material/Schedule"

function PTPackagePage() {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: <TrackChangesIcon sx={{ fontSize: 50 }} />,
      title: "Giúp bạn đặt mục tiêu tập luyện",
      color: "primary.main",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50 }} />,
      title: "Tư vấn lộ trình giảm/ tăng cân",
      color: "secondary.main",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 50 }} />,
      title: "Điều chỉnh kỹ thuật khi tập luyện",
      color: "info.main",
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 50 }} />,
      title: "Hướng dẫn dinh dưỡng tập luyện",
      color: "warning.main",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 50 }} />,
      title: "Động viên khích lệ tinh thần",
      color: "primary.main",
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 50 }} />,
      title: "Thời gian linh hoạt theo lựa chọn",
      color: "secondary.main",
    },
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 300, md: 350 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/pt-package-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(11, 52, 60, 0.88) 0%, rgba(24, 54, 61, 0.85) 50%, rgba(55, 82, 87, 0.82) 100%)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <FitnessCenterIcon
              sx={{
                fontSize: { xs: 40, md: 50 },
                color: "white",
                mr: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "white",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              HƯỚNG DẪN
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            TẬP LUYỆN MIỄN PHÍ
          </Typography>
          <Box
            sx={{
              width: 100,
              height: 3,
              bgcolor: "warning.main",
              mx: "auto",
              mb: 3,
              borderRadius: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 600,
              mx: "auto",
              textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Nhận tối đa quyền lợi của bạn cùng các chương trình tập luyện miễn phí
          </Typography>
        </Container>
      </Box>

      {/* Training Method Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 3,
              }}
            >
              PHƯƠNG PHÁP TẬP LUYỆN
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              Đội ngũ huấn luyện viên tại The Gym đều được tuyển chọn, sàng lọc kỹ lưỡng qua nhiều tiêu chí trình độ,
              kinh nghiệm, tâm huyết cũng như khả năng đào tạo. Hội viên hoàn toàn có thể tự tin bứt phá giới hạn bản
              thân và hoàn thành những mục tiêu dang dở. Hội viên có thể lựa chọn huấn luyện viên cá nhân tuỳ theo trình
              độ, thế mạnh, khả năng giảng dạy để phù hợp với nhu cầu tập luyện của mình.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 300, md: 400 },
                bgcolor: "primary.main",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundImage: "url('/intro4.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                {/* <FitnessCenterIcon sx={{ fontSize: 80, color: "white", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                  Đội ngũ PT chuyên nghiệp
                </Typography> */}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Nutrition Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 400 },
                  bgcolor: "secondary.main",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  backgroundImage: "url('/nutritionist.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 3,
                }}
              >
                CHẾ ĐỘ DINH DƯỠNG
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  lineHeight: 2,
                  fontSize: "1rem",
                }}
              >
                Tập luyện với PT, bạn không chỉ được đào tạo về các bài tập vận động cơ thể, mà bạn còn được học về dinh
                dưỡng cùng khả năng tác động của chế độ dinh dưỡng đến quá trình tập luyện. Bạn được hướng dẫn cách ăn
                uống, lựa chọn thực phẩm để có thể đạt được mục tiêu của mình một cách nhanh nhất và hiệu quả nhất.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 6,
            textAlign: "center",
          }}
        >
          LÝ DO CẦN CÓ HUẤN LUYỆN VIÊN CÁ NHÂN
        </Typography>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(22, 105, 122, 0.2)",
                    borderColor: benefit.color,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      color: benefit.color,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      "& span": {
                        color: benefit.color,
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: benefit.title
                        .replace(/\*\*(.*?)\*\*/g, "<span>$1</span>")
                        .replace(
                          /(đặt mục tiêu|giảm\/ tăng cân|kỹ thuật|dinh dưỡng|tinh thần|Thời gian linh hoạt)/g,
                          "<span>$1</span>",
                        ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "secondary.main",
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "primary.main",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Tham gia ngay
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default PTPackagePage
