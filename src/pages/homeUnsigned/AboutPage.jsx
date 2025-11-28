import { Box, Container, Typography, Grid, Card, CardContent, Divider } from "@mui/material"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import SchoolIcon from "@mui/icons-material/School"
import PersonIcon from "@mui/icons-material/Person"
import CardMembershipIcon from "@mui/icons-material/CardMembership"
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

function AboutPage() {
  const infoCards = [
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: "Tại sao chọn The Gym",
      description:
        "Chúng tôi tạo ra một môi trường nơi bạn có thể thư giãn. Đi bộ, chạy bộ, đạp xe… theo tốc độ của riêng mình và tập luyện mà không bao giờ phải lo lắng về việc bị phán xét",
      color: "primary.main",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: "Chăm sóc khách hàng / liên hệ",
      description:
        "Mục tiêu của chúng tôi là luôn luôn cung cấp dịch vụ khách hàng tốt nhất cho các hội viên The Gym. Vui lòng truy cập Câu hỏi thường gặp của chúng tôi để tìm hiểu cách nâng cấp, chuyển nhượng, đóng băng thẻ hội viên, và nhiều hơn nữa.",
      color: "secondary.main",
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      title: "Hướng dẫn cho người mới",
      description:
        "Bạn là người mới? Không cần lo sợ khi tập luyện, chúng tôi có hướng dẫn giúp bạn bắt đầu, lấy động lực để tiếp tục và đạt mục tiêu trên hành trình sức khỏe mới.",
      color: "info.main",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: "Hướng dẫn tập luyện miễn phí",
      description:
        "Hãy tận dụng tối đa trải nghiệm thể dục của bạn với các buổi hướng dẫn tập luyện miễn phí, chương trình tập luyện cá nhân từ các huấn luyện viên được chứng nhận của The Gym.",
      color: "warning.main",
    },
    {
      icon: <CardMembershipIcon sx={{ fontSize: 40 }} />,
      title: "Thông tin gói tập",
      description:
        "Chúng tôi tin vào việc cung cấp trải nghiệm thể dục chất lượng cao với chi phí phải chăng. Hãy tìm hiểu thêm về các tùy chọn hội viên của chúng tôi để quyết định tùy chọn nào phù hợp nhất với bạn.",
      color: "primary.main",
    },
    {
      icon: <PhoneAndroidIcon sx={{ fontSize: 40 }} />,
      title: "Ứng dụng The Gym",
      description:
        "Bạn muốn tận dụng tối đa tư cách hội viên của mình? Tải xuống ứng dụng The Gym – đây là phòng tập trong túi của bạn! Ứng dụng giúp bạn quản trị gói tập, cung cấp hàng loạt bài tập mới, video tập luyện có thể thực hiện ở bất kỳ đâu, hướng dẫn về bài tập và thiết bị, theo dõi tiến trình và nhiều các tính năng hữu ích khác.",
      color: "secondary.main",
    },
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url('/public/about-banner.jpg')", // đường dẫn hình ảnh
          backgroundSize: "cover", // căn chỉnh
          backgroundPosition: "bottom",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(27, 60, 68, 0.7) 0%, rgba(6, 34, 40, 0.7) 100%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 60, mr: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              VỀ THE GYM
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 400,
              maxWidth: 800,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Cho dù bạn là người mới tập gym hay là người tập lâu năm, The Gym luôn là một môi trường tập luyện mà tất cả
            mọi người đều cảm thấy thoải mái nhất.
          </Typography>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 2,
              mb: 3,
              fontSize: "1rem",
            }}
          >
            Bất kể nhu cầu tập luyện, chúng tôi đều có tùy chọn hội viên dành riêng cho bạn. Tất cả hội viên The Gym đều
            được quyền tập luyện không giới hạn tại câu lạc bộ đăng ký 24/7, và luôn nhận được sự hỗ trợ từ đội ngũ nhân
            viên thân thiện, có chuyên môn bất cứ khi nào bạn cần. Các hội viên đăng ký gói tập tất cả chi nhánh sẽ nhận
            thêm các quyền lợi đặc biệt bao gồm: quyền tập luyện tại toàn hệ thống The Gym trên toàn quốc, được miễn phí
            đo chỉ số sức khỏe và kiểm tra sai lệch tư thế, và nhiều hơn thế nữa!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 2,
              mb: 3,
              fontSize: "1rem",
            }}
          >
            Bạn đang tìm kiếm nguồn cảm hứng để giúp bạn đạt được mục tiêu thể dục của mình? Hoặc bạn đang cần sự hướng
            dẫn vì chưa từng tập luyện ở phòng tập bao giờ? Là hội viên The Gym, bạn có thể tham gia chương trình{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "secondary.main" }}>
              Hướng dẫn tập luyện miễn phí
            </Typography>{" "}
            và tham khảo thêm những bí quyết sống khỏe, và những lời khuyên tập luyện tại các bài viết về thông tin hữu
            ích của The Gym.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 2,
              mb: 3,
              fontSize: "1rem",
            }}
          >
            Mục tiêu của chúng tôi là cung cấp một môi trường sạch sẽ, an toàn, chào đón bất kỳ ai bước vào cửa phòng
            tập, và tất cả các thiết bị, tiện nghi, cũng như luôn sẵn sàng hỗ trợ bạn khi bạn cần.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            Chào mừng bạn đến với The Gym – Gym Cho Mọi Người.
          </Typography>
        </Box>

        {/* Image Placeholder */}
        {/* <Box
          sx={{
            width: "100%",
            height: 400,
            bgcolor: "info.main",
            borderRadius: 3,
            mb: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(130, 192, 204, 0.8) 0%, rgba(72, 159, 181, 0.8) 100%)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <FitnessCenterIcon sx={{ fontSize: 80, color: "white", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
              Hệ thống phòng tập của The Gym
            </Typography>
          </Box>
        </Box> */}
      </Container>

      {/* Info Cards Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 6,
              textAlign: "center",
            }}
          >
            TÌM HIỂU THÊM VỀ CHÚNG TÔI
          </Typography>

          <Grid container spacing={3}>
            {infoCards.map((card, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "transparent",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 24px rgba(22, 105, 122, 0.15)",
                      borderColor: card.color,
                      "& .arrow-icon": {
                        transform: "translateX(8px)",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          color: card.color,
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          >
                            {card.title}
                          </Typography>
                          <ArrowForwardIcon
                            className="arrow-icon"
                            sx={{
                              color: card.color,
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderColor: card.color }} />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bottom CTA Section */}
      <Box
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
              }}
            >
              Sẵn sàng bắt đầu hành trình của bạn?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Tham gia cùng hàng ngàn hội viên đã tin tưởng The Gym cho hành trình sức khỏe của họ
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default AboutPage
