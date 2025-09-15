import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material"
import {
  CheckCircle,
  Download,
  Share,
  Home,
  ArrowForward,
  ContentCopy,
  CreditCard,
  AccountBalance,
  AccessTime,
  Receipt,
  Celebration,
  Close,
} from "@mui/icons-material"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import { copyToClipboard, formatCurrencyVND } from "~/utils/common"
import successGIF from "~/assets/gif/result_page_success.gif"
import { useSearchParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const MyCardContent = ({ title, content, border, isCopy }) => {
  console.log("🚀 ~ MyCardContent ~ border:", border)
  return (
    <Grid item size={{ xs: 12 }}>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          px: 2,
          bgcolor: border === undefined ? "grey.50" : "success.background",
          border: border === undefined ? "none" : `2px solid #4caf50`,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Typography variant="subtitle1" alignSelf="center" color="text.secondary">
          {title}
          {" :"}
        </Typography>
        {isCopy ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={border === undefined ? "text.primary" : "success.main"}
            >
              {content}
            </Typography>
            <IconButton size="small" onClick={() => copyToClipboard(content, title)}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color={border === undefined ? "text.primary" : "success.main"}
          >
            {content}
          </Typography>
        )}
      </Paper>
    </Grid>
  )
}

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paymentData = {
    service: searchParams.get("service"), // Lấy tham số service
    vnp_Amount: searchParams.get("vnp_Amount"),
    vnp_BankCode: searchParams.get("vnp_BankCode"),
    vnp_BankTranNo: searchParams.get("vnp_BankTranNo"),
    vnp_CardType: searchParams.get("vnp_CardType"),
    vnp_OrderInfo: searchParams.get("vnp_OrderInfo"),
    vnp_PayDate: searchParams.get("vnp_PayDate"),
    vnp_ResponseCode: searchParams.get("vnp_ResponseCode"),
    vnp_TmnCode: searchParams.get("vnp_TmnCode"),
    vnp_TransactionNo: searchParams.get("vnp_TransactionNo"),
    vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus"),
    vnp_TxnRef: searchParams.get("vnp_TxnRef"),
    isVerified: searchParams.get("isVerified") === "true",
    isSuccess: searchParams.get("isSuccess") === "true",
    message: searchParams.get("message"),
  }
  console.log("🚀 ~ PaymentSuccessPage ~ paymentData:", paymentData)

  const formatDateTime = (dateStr) => {
    if (!dateStr || dateStr.length !== 14) return "N/A"

    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const hour = dateStr.substring(8, 10)
    const minute = dateStr.substring(10, 12)
    const second = dateStr.substring(12, 14)

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  const extractPackageInfo = (orderInfo) => {
    if (!orderInfo) return ""
    const match = orderInfo.match(/Thanh toán (.+?) mã:/)
    return match ? match[1] : "Gói tập luyện"
  }

  const getBankName = (bankCode) => {
    const banks = {
      NCB: "Ngân hàng Quốc Dân",
      VCB: "Ngân hàng Vietcombank",
      TCB: "Ngân hàng Techcombank",
      ACB: "Ngân hàng Á Châu",
      VIB: "Ngân hàng Quốc tế",
      MB: "Ngân hàng Quân Đội",
      SHB: "Ngân hàng Sài Gòn - Hà Nội",
    }
    return banks[bankCode] || bankCode
  }

  const handleDownloadReceipt = () => {
    toast.warning("chức năng đang phát triển")
  }

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "Biên lai thanh toán gym",
        text: `Đã thanh toán thành công ${formatCurrencyVND(paymentData.vnp_Amount)} cho ${extractPackageInfo(paymentData.vnp_OrderInfo)}`,
      })
    } else {
      toast.warning("Trình duyệt không hỗ trợ chức năng chia sẻ")
    }
  }

  const paymentInfo = [
    {
      title: "Số tiền thanh toán",
      content: formatCurrencyVND(paymentData.vnp_Amount) || "",
      border: "success.secondary",
      isCopy: false,
    },
    {
      title: "Gói dịch vụ",
      content: extractPackageInfo(paymentData.vnp_OrderInfo) || "",
      isCopy: false,
    },
    {
      title: "Ngân hàng",
      content: getBankName(paymentData.vnp_BankCode) || "",
      isCopy: false,
    },
    {
      title: "Loại thẻ",
      content: paymentData.vnp_CardType || "",
      isCopy: false,
    },
    {
      title: "Thời gian:",
      content: formatDateTime(paymentData.vnp_PayDate) || "",
      isCopy: false,
    },
    {
      title: "Mã giao dịch",
      content: paymentData.vnp_TransactionNo || "",
      isCopy: true,
    },
    {
      title: "Mã đơn hàng:",
      content: paymentData.vnp_TxnRef || "",
      isCopy: true,
    },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e8 0%, #e3f2fd 50%, #f1f8e9 100%)",
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Success Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            bgcolor: "transparent",
            textAlign: "center",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "success.secondary",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 48 }} />
          </Avatar> */}
          <Box component="img" sx={{ width: 100, height: 100 }} src={successGIF} />

          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "success.text" }}>
            Thanh toán thành công!
          </Typography>

          <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
          </Typography>

          <Chip
            icon={<TaskAltIcon color="success.text" />}
            label={paymentData.message}
            sx={{
              bgcolor: "success.background",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "success.text",
              py: 3,
              px: 2,
            }}
          />
        </Paper>

        <Grid container spacing={3}>
          {/* Main Payment Info */}
          <Grid item size={{ xs: 12, md: 8 }}>
            {/* Transaction Summary */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(76, 175, 80, 0.2)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    <Receipt />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Thông tin giao dịch
                  </Typography>
                </Box>
                <CardContent />
                <Grid container spacing={2}>
                  {paymentInfo.map((item) => (
                    <MyCardContent
                      title={item?.title}
                      content={item?.content}
                      border={item?.border}
                      isCopy={item?.isCopy}
                    />
                  ))}

                  <Grid item size={{ xs: 12 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        px: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                      }}
                    >
                      <Typography variant="subtitle1" alignSelf="center" color="text.secondary">
                        Trạng thái:
                      </Typography>
                      {paymentData.isSuccess ? (
                        <Chip icon={<CheckCircle />} label="Thành công" color="success" variant="filled" />
                      ) : (
                        <Chip icon={<Close fontSize="small" />} label="Thất bại" color="error" variant="filled" />
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Bank Transaction Details */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                    <AccountBalance />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Chi tiết giao dịch ngân hàng
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "info.main", color: "white", borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Mã giao dịch ngân hàng
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" fontFamily="monospace">
                        {paymentData.vnp_BankTranNo}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "secondary.main", color: "white", borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Mã đối tác
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" fontFamily="monospace">
                        {paymentData.vnp_TmnCode}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Sidebar */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                position: "sticky",
                top: 24,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Bước tiếp theo
                </Typography>

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={handleDownloadReceipt}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                      boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
                    }}
                  >
                    Tải biên lai
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Share />}
                    onClick={handleShareReceipt}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(45deg, #4CAF50, #45a049)",
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                    }}
                  >
                    Chia sẻ biên lai
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={() => navigate("/user/home")}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(45deg, #FF9800, #F57C00)",
                      boxShadow: "0 4px 20px rgba(255, 152, 0, 0.3)",
                    }}
                  >
                    Về trang chủ
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/user/membership")}
                    sx={{ py: 1.5, borderWidth: 2 }}
                  >
                    Xem gói thành viên
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "warning.main", width: 32, height: 32, mr: 1 }}>
                      <AccessTime sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Lưu ý quan trọng
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    • Gói tập sẽ được kích hoạt trong 24h
                    <br />
                    • Bạn sẽ nhận email xác nhận
                    <br />
                    • Liên hệ hotline nếu cần hỗ trợ
                    <br />• Mang theo CMND khi đến phòng tập
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Security Notice */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            textAlign: "center",
            bgcolor: "rgba(76, 175, 80, 0.1)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <CheckCircle color="success" />
            <Typography variant="body1" color="success.main" fontWeight="bold">
              Giao dịch đã được xác thực và bảo mật bởi VNPay
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PaymentSuccessPage
