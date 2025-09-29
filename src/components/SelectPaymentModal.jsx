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

export const SelectPaymentModal = ({
  open,
  onClose,
  title = "Chọn phương thức thanh toán",
  subtitle = "Hoàn tất thanh toán của bạn",
  summaryCard,
  paymentMethods,
  onPaymentMethodSelect,
  confirmButtonText = "Tiếp tục thanh toán",
  cancelButtonText = "Hủy bỏ",
  isProcessing = false,
  showPaymentMethods = true,
  disabled = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("")

  const defaultPaymentMethods = [
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
      description: "Đến trực tiếp để thanh toán",
      icon: <LocalAtm sx={{ color: "#f44336" }} />,
      color: "#f44336",
    },
  ]

  const methods = paymentMethods || defaultPaymentMethods

  const handleMethodChange = (value) => {
    if (!disabled && !isProcessing) {
      setSelectedMethod(value)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod || isProcessing || disabled) return

    const selectedPaymentMethod = methods.find((method) => method.id === selectedMethod)
    if (onPaymentMethodSelect) {
      await onPaymentMethodSelect(selectedMethod, selectedPaymentMethod)
    }
  }

  const handleClose = () => {
    if (!isProcessing && !disabled) {
      setSelectedMethod("")
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "400px",
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
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }} disabled={isProcessing || disabled}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1, sm: 3 }, mt: 2 }}>
        {/* Summary Card (optional) */}
        {summaryCard && (
          <>
            {summaryCard}
            <Divider sx={{ mb: { xs: 1, sm: 3 } }} />
          </>
        )}

        {/* Payment Methods */}
        {showPaymentMethods && (
          <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: { xs: 1, sm: 2 } }}>
              Chọn phương thức thanh toán:
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup value={selectedMethod} onChange={(e) => handleMethodChange(e.target.value)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {methods.map((method) => (
                    <Card
                      key={method.id}
                      sx={{
                        cursor: isProcessing || disabled ? "default" : "pointer",
                        transition: "all 0.2s ease",
                        border: selectedMethod === method.id ? `2px solid ${method.color}` : "1px solid #e0e0e0",
                        bgcolor: selectedMethod === method.id ? `${method.color}08` : "white",
                        opacity: isProcessing || disabled ? 0.7 : 1,
                        "&:hover": !(isProcessing || disabled)
                          ? {
                              transform: "translateY(-2px)",
                              boxShadow: 3,
                            }
                          : {},
                      }}
                      onClick={() => {
                        if (!(isProcessing || disabled)) {
                          setSelectedMethod(method.id)
                        }
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
                          control={<Radio sx={{ color: method.color }} disabled={isProcessing || disabled} />}
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
          </>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ minWidth: 120 }}
          disabled={isProcessing || disabled}
        >
          {cancelButtonText}
        </Button>
        {onPaymentMethodSelect && (
          <Button
            onClick={handlePayment}
            variant="contained"
            size="large"
            disabled={(!selectedMethod && showPaymentMethods) || isProcessing || disabled}
            sx={{
              minWidth: 180,
              background:
                (!selectedMethod && showPaymentMethods) || isProcessing || disabled
                  ? undefined
                  : "linear-gradient(135deg, #16697A 0%, #489FB5 100%)",
              "&:hover": {
                background:
                  (!selectedMethod && showPaymentMethods) || isProcessing || disabled
                    ? undefined
                    : "linear-gradient(135deg, #145864 0%, #3d8ba3 100%)",
              },
            }}
          >
            {isProcessing ? "Đang xử lý..." : confirmButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
