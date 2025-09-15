import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
} from "@mui/material"
import {
  Close,
  AccountBalanceWallet,
  CreditCard,
  AccountBalance,
  QrCode2,
  LocalAtm,
  CheckCircle,
} from "@mui/icons-material"
import { calculateDiscountedPrice, formatCurrencyVND } from "~/utils/common"
import { toast } from "react-toastify"
import useUserStore from "~/stores/useUserStore"
import { createSubscriptionAPI } from "~/apis/subscription"
import { createLinkVnpayAPI } from "~/apis/payment"
import MyBackdrop from "./MyBackdrop"
import { useNavigate } from "react-router-dom"

export const SelectPaymentModal = ({ open, onClose, packageData }) => {
  const navigate = useNavigate()
  // store
  const { user } = useUserStore()
  const [selectedMethod, setSelectedMethod] = useState("")

  // backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const handleOpenBackdrop = () => setOpenBackdrop(true)
  const handleCloseBackdrop = () => setOpenBackdrop(false)

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      description: "Thanh toán qua ví điện tử VNPay",
      icon: <AccountBalanceWallet sx={{ color: "#1976d2" }} />,
      color: "#1976d2",
      popular: true,
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, MasterCard, JCB",
      icon: <CreditCard sx={{ color: "#ff9800" }} />,
      color: "#ff9800",
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Internet Banking, Mobile Banking",
      icon: <AccountBalance sx={{ color: "#4caf50" }} />,
      color: "#4caf50",
    },
    {
      id: "qr_code",
      name: "Quét mã QR",
      description: "QR Pay, Banking App",
      icon: <QrCode2 sx={{ color: "#9c27b0" }} />,
      color: "#9c27b0",
    },
    {
      id: "cash",
      name: "Thanh toán tại quầy",
      description: "Đến trực tiếp phòng tập để thanh toán",
      icon: <LocalAtm sx={{ color: "#f44336" }} />,
      color: "#f44336",
    },
  ]

  const handleMethodChange = (value) => {
    console.log("🚀 ~ handleMethodChange ~ event.target.value:", value)
    setSelectedMethod(value)
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    if (selectedMethod === "vnpay") {
      handleOpenBackdrop()
      // get data
      const { _id: userId } = user
      console.log("🚀 ~ handlePayment ~ userId:", userId)
      const { _id: membershipId } = packageData
      console.log("🚀 ~ handlePayment ~ membershipId:", membershipId)

      // call api lấy subId
      const data = await createSubscriptionAPI(userId, membershipId)

      // call api lầy nữa lấy link thanh toán
      const vnpay = await createLinkVnpayAPI(data.subscriptionId)
      console.log("🚀 ~ handlePayment ~ link:", vnpay.paymentUrl)

      window.open(vnpay.paymentUrl, "_blank")

      navigate("/user/membership")

      // chuyển qua trang thanh toán

      // Đóng modal và chuyển đến trang thanh toán
      // onClose()

      // Thông báo thành công hoặc chuyển hướng

      // alert(`Đã chọn phương thức: ${paymentMethods.find((m) => m.id === selectedMethod)?.name}`)
    } else {
      toast.warning("Phương thức này đang phát triển")
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "600px",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          background: "linear-gradient(135deg, #16697A 0%, #489FB5 100%)",
          color: "white",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Chọn phương thức thanh toán
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Hoàn tất đăng ký gói tập luyện của bạn
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1, sm: 3 }, mt: 2 }}>
        {/* Package Summary */}
        {packageData && (
          <Card sx={{ mb: 3, bgcolor: "grey.50", border: "2px solid #e3f2fd" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {packageData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thời hạn: {packageData.durationMonth} tháng
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", lineHeight: 0 }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatCurrencyVND(calculateDiscountedPrice(packageData.price, packageData.discount).finalPrice)}
                  </Typography>
                  <Typography
                    sx={{ textDecoration: "line-through" }}
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    {formatCurrencyVND(packageData.price)}
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Tiết kiệm {packageData.discount}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Divider sx={{ mb: { xs: 1, sm: 3 } }} />

        {/* Payment Methods */}
        <Typography variant="h6" fontWeight="bold" sx={{ md: { xs: 1, sm: 2 } }}>
          Chọn phương thức thanh toán:
        </Typography>

        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup value={selectedMethod} onChange={(e) => handleMethodChange(e.target.value)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: selectedMethod === method.id ? `2px solid ${method.color}` : "1px solid #e0e0e0",
                    bgcolor: selectedMethod === method.id ? `${method.color}08` : "white",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => {
                    setSelectedMethod(method.id)
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 1, sm: 2 },
                      "&:last-child": {
                        pb: { xs: 1, sm: 2 },
                      },
                    }}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio sx={{ color: method.color }} />}
                      sx={{ m: 0, width: "100%", display: "flex" }}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", ml: 1 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: `${method.color}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {method.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {method.name}
                              </Typography>
                              {method.popular && (
                                <Chip
                                  label="Phổ biến"
                                  size="small"
                                  sx={{
                                    bgcolor: "success.main",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                          {selectedMethod === method.id && (
                            <CheckCircle
                              sx={{
                                color: method.color,
                                fontSize: 28,
                                display: { xs: "none", sm: "block" },
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" size="large" sx={{ minWidth: 120 }}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          size="large"
          disabled={!selectedMethod}
          sx={{
            minWidth: 180,
            background: selectedMethod ? "linear-gradient(135deg, #16697A 0%, #489FB5 100%)" : undefined,
            "&:hover": {
              background: selectedMethod ? "linear-gradient(135deg, #145864 0%, #3d8ba3 100%)" : undefined,
            },
          }}
        >
          Tiếp tục thanh toán
        </Button>
      </DialogActions>
      <MyBackdrop open={openBackdrop} handleClose={handleCloseBackdrop} />
    </Dialog>
  )
}
