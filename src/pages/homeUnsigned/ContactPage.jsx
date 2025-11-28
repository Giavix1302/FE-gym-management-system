import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import PhoneIcon from "@mui/icons-material/Phone"
import FacebookIcon from "@mui/icons-material/Facebook"
import MessageIcon from "@mui/icons-material/Message"

function ContactPage() {
  const contactCards = [
    {
      id: 1,
      title: "Hotline",
      icon: <PhoneIcon sx={{ fontSize: 50 }} />,
      link: "tel:0972296068",
      color: "primary.main",
    },
    {
      id: 2,
      title: "Messenger",
      icon: <FacebookIcon sx={{ fontSize: 50 }} />,
      link: "#",
      color: "secondary.main",
    },
    {
      id: 3,
      title: "Zalo",
      icon: <MessageIcon sx={{ fontSize: 50 }} />,
      link: "#",
      color: "info.main",
    },
  ]

  const termsData = [
    {
      id: 1,
      title: "ĐIỀU KHOẢN CƠ BẢN",
      content: (
        <Box>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
            <li>
              Sau khi đăng ký, gói tập sẽ được kích hoạt ngay tại thời điểm thanh toán. Nếu Hội viên có thắc mắc nào
              khác, hãy liên hệ với chúng tôi tại số hotline 0972 296 068 hoặc gửi email về địa chỉ: cskh@thegym.vn, THE
              GYM rất sẵn lòng lắng nghe các nguyện vọng và đóng góp của bạn.
            </li>
            <li>
              Tất cả điều khoản dưới đây sẽ có hiệu lực ngay khi Hội viên xác nhận đăng ký thành công. Khi đó xem như
              hợp đồng giữa Hội viên và THE GYM đã được ký kết.
            </li>
            <li>Hội viên sẽ được hưởng tất cả dịch vụ trong khuôn khổ gói tập đã chọn.</li>
            <li>Hội viên không được phép chuyển giao gói tập này cho bất kỳ ai khác.</li>
          </ul>
        </Box>
      ),
    },
    {
      id: 2,
      title: "PHÍ HỘI VIÊN",
      content: (
        <Box>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Phí hội viên: là một khoản chi phí liên quan đến việc khởi tạo và thiết lập tài khoản, quản lý và lưu trữ
            thông tin khách hàng trên hệ thống. Phí hội viên là một khoản phí không hoàn lại. Khách hàng gia hạn sau khi
            gói tập hết hạn sẽ phải đóng lại phí này.
          </Typography>
        </Box>
      ),
    },
    {
      id: 3,
      title: "NỘI QUY THE GYM",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontWeight: 500 }}>
            Lời đầu tiên xin chào mừng bạn đến với THE GYM. THE GYM rất vui khi có bạn ở đây với Chúng tôi.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            THE GYM hiểu rằng các quy định có thể hơi nhàm chán, nhưng hãy nghĩ về chúng như một phần trong cam kết của
            THE GYM để giữ an toàn cho bạn trong quá trình tập luyện.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
            Để giữ cho bạn được an toàn khi tập luyện:
          </Typography>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8, marginBottom: 24 }}>
            <li>
              Để bảo vệ đôi chân của bạn và hạn chế chấn thương trong quá trình vận động, trang phục tập luyện thoải mái
              và giày thể thao trong suốt quá trình tập luyện là những gì bạn cần phải chuẩn bị.
            </li>
            <li>
              Những trang phục như: đồ jeans, bốt, dép xỏ ngón/dép quai hậu hoặc trang phục đi làm đều không phù hợp khi
              đến phòng tập thể dục. Hội viên lưu ý cần mặc áo thể thao xuyên suốt quá trình tập luyện.
            </li>
            <li>
              Điều cực kỳ quan trọng cần nhớ là bạn không thể sử dụng phòng tập khi đang bị ảnh hưởng bởi các chất kích
              thích.
            </li>
            <li>
              Bạn cũng không nên tham gia bất kỳ hoạt động tập luyện nào có thể gây hại cho bạn hoặc người khác, trừ khi
              tập luyện cùng với các HLV của chúng tôi.
            </li>
          </ul>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
            Để giữ cho tài sản của bạn được an toàn:
          </Typography>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8, marginBottom: 24 }}>
            <li>
              THE GYM không thể chịu trách nhiệm về bất kỳ mất mát hoặc hư hỏng nào đối với tài sản cá nhân, vì vậy hãy
              luôn để ý đồ đạc của mình khi đến phòng tập.
            </li>
            <li>
              Để đảm bảo an toàn, chúng tôi yêu cầu bạn không mang balo và các loại túi lên sàn tập. Vui lòng sử dụng tủ
              khóa được cung cấp.
            </li>
            <li>
              THE GYM sẽ luôn cố gắng trả lại tài sản bị mất của bạn, nhưng sẽ không thể chịu trách nhiệm về bất kỳ đồ
              vật nào trong khu vực đồ thất lạc.
            </li>
          </ul>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
            Để giữ cho môi trường tập luyện an toàn:
          </Typography>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
            <li>Chỉ huấn luyện viên cá nhân được THE GYM cấp phép mới được phép hướng dẫn hội viên trong Phòng tập.</li>
            <li>Hút thuốc, bao gồm cả thuốc lá điện tử đều bị nghiêm cấm trong tất cả các khu vực của phòng tập.</li>
            <li>Hội viên không được mang theo bất kỳ vật nuôi nào vào phòng tập.</li>
            <li>
              Để tránh gây mùi và rơi vãi đồ ăn, việc ăn ở phòng tập không được khuyến khích. Đồ uống cần có nắp chai
              hoặc được đậy nắp.
            </li>
            <li>Thả tạ nhẹ nhàng để tránh gây nhiễu tiếng ồn trong phòng tập và ảnh hưởng đến các Hội viên khác.</li>
          </ul>
        </Box>
      ),
    },
    {
      id: 4,
      title: "CHÍNH SÁCH GIÁ",
      content: (
        <Box>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
            <li>
              Vào từng thời điểm chúng tôi có thể điều chỉnh giá tập cho phù hợp. Hội viên có quyền chấm dứt tư cách
              thành viên của mình theo các điều khoản và điều kiện thành viên. Nếu Hội viên không chấm dứt Gói tập trước
              khi điều chỉnh, mức phí này sẽ được áp dụng cho các hội viên gia hạn và hội viên mới.
            </li>
            <li>
              Các chương trình khuyến mãi sẽ được áp dụng tại một số chi nhánh nhất định. Mức giá ưu đãi chúng tôi đưa
              ra vô cùng hấp dẫn, bạn vui lòng theo dõi để cập nhật thông tin nhanh nhất của THE GYM nhé!
            </li>
          </ul>
        </Box>
      ),
    },
    {
      id: 5,
      title: "QUY ĐỊNH SỬ DỤNG TÀI KHOẢN",
      content: (
        <Box>
          <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
            <li>
              Mỗi tài khoản thành viên chỉ áp dụng cho một Hội Viên duy nhất, bao gồm gói tập, thời hạn tập của thành
              viên đó. Hội viên có nghĩa vụ tự bảo quản thông tin tài khoản thành viên của mình.
            </li>
            <li>
              Thông tin thành viên luôn được giám sát chặt chẽ: Vì quyền lợi và sự an toàn của tất cả các thành viên,
              thông tin tài khoản đóng vai trò lưu lại thời gian truy cập và sẽ được theo dõi trong trường hợp cần tư
              liệu.
            </li>
            <li>
              Để đảm bảo an ninh trong phòng tập, hệ thống kiểm soát ra vào của THE GYM sẽ sử dụng hệ thống kiểm soát
              sinh trắc học kèm với ứng dụng điện thoại THE GYM.
            </li>
            <li>
              Trường hợp tài khoản Thành Viên bị sử dụng trái phép: THE GYM sẽ thông báo qua email và yêu cầu hợp tác
              điều tra. Sau khi xác minh, THE GYM có quyền áp dụng phí phạt hoặc chấm dứt dịch vụ.
            </li>
            <li>Hội viên phải chịu trách nhiệm cho bất kỳ tổn thất gây nên bởi hành vi vi phạm.</li>
          </ul>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 250, md: 300 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(22, 105, 122, 0.88) 0%, rgba(72, 159, 181, 0.85) 50%, rgba(130, 192, 204, 0.82) 100%)",
          backgroundImage: "url('/intro1.jpg')",
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
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
              mb: 2,
            }}
          >
            LIÊN HỆ
          </Typography>
          <Box
            sx={{
              width: 100,
              height: 3,
              bgcolor: "warning.main",
              mx: "auto",
              borderRadius: 2,
            }}
          />
        </Container>
      </Box>

      {/* Contact Cards */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactCards.map((card) => (
            <Grid size={{ xs: 12, md: 4 }} key={card.id}>
              <Card
                component="a"
                href={card.link}
                sx={{
                  textAlign: "center",
                  py: 4,
                  textDecoration: "none",
                  display: "block",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },

                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: `${card.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      color: "white",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {card.title}
                  </Typography>
                  {card.id === 1 && (
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                      0972 296 068
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Terms Accordion */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 4,
              textAlign: "center",
            }}
          >
            ĐIỀU KHOẢN
          </Typography>

          {termsData.map((term) => (
            <Accordion
              key={term.id}
              sx={{
                mb: 2,
                "&:before": {
                  display: "none",
                },
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "rgba(22, 105, 122, 0.04)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {term.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "background.default", p: 3 }}>{term.content}</AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact Info Footer */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
            THÔNG TIN LIÊN HỆ
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            Nếu bạn có thắc mắc hoặc bất kỳ khiếu nại nào, xin vui lòng liên hệ với chúng tôi:
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
            Hotline: 0972 296 068
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
            Email: cskh@thegym.vn
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 2, fontStyle: "italic" }}>
            Đội ngũ chúng tôi rất sẵn lòng phục vụ và sẽ nhanh chóng liên hệ lại với bạn.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default ContactPage
