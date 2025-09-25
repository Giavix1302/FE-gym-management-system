import React, { useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
} from "@mui/material"
import {
  AccessTime,
  FitnessCenter,
  CalendarToday,
  CalendarMonth,
  CheckCircle,
  CardMembership,
  Close,
} from "@mui/icons-material"
import { calculateMonthlyPrice, calculateProgressPercent, convertISOToVNTime, formatCurrencyVND } from "~/utils/common"
import { getListMembershipAPI } from "~/apis/membership"
import useMembershipStore from "~/stores/useMembershipStore"
import useUserStore from "~/stores/useUserStore"
import { useState } from "react"
import { SelectPaymentModal } from "~/components/SelectPaymentModal"
import { deleteSubscriptionAPI, getSubscriptionByUserIdAPI } from "~/apis/subscription"
import useMyMembershipStore from "~/stores/useMyMembershipStore"
import MyBackdrop from "~/components/MyBackdrop"
import { useCountdown } from "~/hooks/useCountdown"
import { toast } from "react-toastify"
import ConfirmDialog from "~/utils/ConfirmDialog"

// ================= COMPONENT: InfoBox =================
function InfoBox({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        "&:hover": { transform: "translateY(-2px)" },
        transition: "0.2s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, opacity: 0.8 }}>
        {icon}
        <Typography variant="body2">{label}</Typography>
      </Box>
      <Typography variant="h6" fontWeight="600">
        {value}
      </Typography>
    </Box>
  )
}

// ================= COMPONENT: MembershipCard =================
function MembershipCard() {
  // store
  const { user } = useUserStore()
  const { updateMyMembership, resetMyMembership, myMembership } = useMyMembershipStore()

  const createAt = myMembership?.paymentInfo?.expireAt // ví dụ "2025-09-14T09:39:28.449Z"
  const ttlMs = 60 * 60 * 1000 // 1 giờ
  const expireAtFromCreate = createAt ? new Date(new Date(createAt).getTime() + ttlMs).toISOString() : null

  // ưu tiên dùng expireAt nếu có, nếu không thì dùng expireAtFromCreate
  const expireAt = myMembership?.paymentInfo?.expireAt || expireAtFromCreate

  const { expired, formatted } = useCountdown(expireAt, {
    onExpire: () => {
      const init = async () => {
        if (myMembership.status === "expired") {
          resetMyMembership()
        }
        const dataSub = await getSubscriptionByUserIdAPI(user._id)
        console.log("🚀 ~ init ~ subscription:", dataSub)
        if (dataSub.success) {
          updateMyMembership({
            remainingSessions: dataSub.subscription.remainingSessions,
            startDate: dataSub.subscription.startDate,
            endDate: dataSub.subscription.endDate,
            status: dataSub.subscription.status,
            name: dataSub.subscription.name,
            bannerURL: dataSub.subscription.bannerURL,
            durationMonth: dataSub.subscription.durationMonth,
            totalCheckin: dataSub.subscription.totalCheckin || 0,
            paymentStatus: dataSub.subscription.paymentStatus,
            paymentInfo: dataSub.subscription.paymentInfo,
          })
        } else {
          resetMyMembership()
        }
      }
      init()
    },
  })

  const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleOpenDialogConfirm = () => setOpenDialogConfirm(true)

  const handleCloseDialogConfirm = () => {
    if (!deleting) setOpenDialogConfirm(false)
  }

  const handleDeleteCurrentMembership = async () => {
    try {
      setDeleting(true)
      // xác nhận xóa
      // reset store
      resetMyMembership()
      // call api xóa
      const result = await deleteSubscriptionAPI(myMembership._id)
      // thong bao
      toast.success(result.message)
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error("Xóa thất bại")
    } finally {
      setDeleting(false)
      setOpenDialogConfirm(false)
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mb: 6,
        p: 2,
        borderRadius: 4,
        color: "white",
        background: "linear-gradient(135deg, #16697A 0%, #16697A 100%)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(102,126,234,0.3)",
        transition: "all 0.3s",
      }}
    >
      {/* Decorative Circles */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.08)",
        }}
      />

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardMembership sx={{ fontSize: 36, color: "white" }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Gói tập hiện tại
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Thông tin chi tiết về gói tập của bạn
              </Typography>
            </Box>
          </Box>
          {myMembership.name !== "" && myMembership.paymentStatus === "paid" && (
            <Box>
              <Button onClick={() => handleOpenDialogConfirm()} color="warning" variant="outlined">
                <Typography>Hủy gói hiện tại</Typography>
              </Button>
            </Box>
          )}
          {myMembership.name !== "" && myMembership.paymentStatus === "unpaid" && (
            <Box>
              <Button
                onClick={() => {
                  window.open(myMembership?.paymentInfo?.paymentUrl, "_blank")
                }}
                color="warning"
                variant="contained"
              >
                {expired ? (
                  <Typography>Đã hết hạn</Typography>
                ) : (
                  <Typography>Ấn để thanh toán — Còn {formatted}</Typography>
                )}
              </Button>
            </Box>
          )}
        </Box>
        {myMembership.name === "" ? (
          <Box>
            <Typography variant="h6">Bạn chưa có gói tập nào, hãy mua gói tập phù hợp với bạn</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} alignItems="center">
            {/* Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={myMembership.bannerURL}
                  alt={myMembership.name}
                  sx={{
                    width: "100%",
                    height: 250,
                    borderRadius: 3,
                    objectFit: "cover",
                    boxShadow: 6,
                  }}
                />
                <Avatar
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "rgba(255,255,255,0.95)",
                    width: 50,
                    height: 50,
                    boxShadow: 3,
                  }}
                >
                  <FitnessCenter sx={{ color: "#667eea" }} />
                </Avatar>
              </Box>
            </Grid>

            {/* Info */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" fontWeight="bold">
                {myMembership.name}
              </Typography>
              {myMembership.status === "active" && myMembership.paymentStatus === "paid" && (
                <Chip
                  icon={<CheckCircle color="success.main" />}
                  label="Đang hoạt động"
                  sx={{
                    bgcolor: "success.main",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "20px",
                    my: 2,
                  }}
                />
              )}

              {myMembership.status === "expired" && myMembership.paymentStatus === "unpaid" && (
                <Chip
                  label="Chưa thanh toán"
                  sx={{
                    bgcolor: "error.main",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "20px",
                    my: 2,
                  }}
                />
              )}

              {myMembership.status === "expired" && myMembership.paymentStatus === "paid" && (
                <Chip
                  label="Hết hạn"
                  sx={{
                    bgcolor: "warning.main",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "20px",
                    my: 2,
                  }}
                />
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InfoBox icon={<AccessTime />} label="Thời hạn" value={myMembership.durationMonth + " tháng"} />
                </Grid>
                <Grid item xs={6}>
                  <InfoBox icon={<FitnessCenter />} label="Số lần đi tập" value={myMembership.totalCheckin + " lần"} />
                </Grid>
                <Grid item xs={6}>
                  <InfoBox
                    icon={<CalendarToday />}
                    label="Bắt đầu"
                    value={convertISOToVNTime(myMembership.startDate) || "Chưa có"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoBox
                    icon={<CalendarMonth />}
                    label="Kết thúc"
                    value={convertISOToVNTime(myMembership.endDate) || "Chưa có"}
                  />
                </Grid>
              </Grid>

              {/* Progress */}
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2">Tiến độ sử dụng</Typography>
                  <Typography variant="body2">
                    {calculateProgressPercent(myMembership.startDate, myMembership.endDate)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgressPercent(myMembership.startDate, myMembership.endDate)}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                      background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
      <ConfirmDialog
        open={openDialogConfirm}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa gói ""? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        onCancel={handleCloseDialogConfirm}
        onConfirm={handleDeleteCurrentMembership}
      />
    </Card>
  )
}

// ================= COMPONENT: PackageCard =================
function PackageCard({ data, handleClickSub, setPackageToPayment }) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        boxShadow: 4,
        height: "100%",
        minHeight: 500,
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden", // tránh tràn blur
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${data.bannerURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)", // chỉnh độ mờ ở đây
            transform: "scale(1.1)", // tránh viền trắng do blur
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", // lớp mờ đen 40%
            zIndex: 1,
          },
        }}
      >
        {/* Nội dung chồng lên ảnh */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            zIndex: 2, // phải cao hơn overlay
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography textAlign="left" sx={{ fontWeight: "bold" }} variant="h5">
              {data.name}
            </Typography>
            <Chip
              label={data.durationMonth + " tháng"}
              sx={{ color: "#fff", bgcolor: "warning.main", fontWeight: "bold" }}
            />
          </Box>

          <Typography
            textAlign="left"
            sx={{
              mt: 3,
              fontSize: "2.625rem",
              color: "warning.main",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              fontWeight: 500,
            }}
            variant="h4"
          >
            {formatCurrencyVND(calculateMonthlyPrice(data.durationMonth, data.price, data.discount))}
            <Typography sx={{ fontSize: "1rem", color: "#fff" }} variant="span">
              {" "}
              / tháng
            </Typography>
          </Typography>
          <Typography textAlign="left" sx={{ textDecoration: "line-through" }} variant="body1">
            {formatCurrencyVND(data.price / data.durationMonth)} / tháng
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%", p: 3, height: "100%" }}>
        <Button
          onClick={() => {
            handleClickSub()
            setPackageToPayment(data)
          }}
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1">Đăng kí tập luyện</Typography>
        </Button>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Bạn sẽ nhận được:{" "}
        </Typography>
        {data.features.map((text) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
            <CheckCircle color="primary" />
            <Typography variant="subtitle1">{text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ================= PAGE =================
export default function UserMembershipPage() {
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const handleCloseBackdrop = () => setOpenBackdrop(false)
  const [openSelectPaymentModal, setOpenSelectPaymentModal] = useState(false)
  const [packageToPayment, setPackageToPayment] = useState({})

  // store
  const { listMembership, setPackages } = useMembershipStore()
  const { user } = useUserStore()
  const { updateMyMembership, resetMyMembership, myMembership } = useMyMembershipStore()

  useEffect(() => {
    const init = async () => {
      setOpenBackdrop(true)
      const data = await getListMembershipAPI()
      setPackages(data.memberships)

      if (myMembership.status === "expired") {
        resetMyMembership()
      }
      const dataSub = await getSubscriptionByUserIdAPI(user._id)
      console.log("🚀 ~ init ~ subscription:", dataSub)
      if (dataSub.success) {
        updateMyMembership({
          _id: dataSub.subscription._id,
          remainingSessions: dataSub.subscription.remainingSessions,
          startDate: dataSub.subscription.startDate,
          endDate: dataSub.subscription.endDate,
          status: dataSub.subscription.status,
          name: dataSub.subscription.name,
          bannerURL: dataSub.subscription.bannerURL,
          durationMonth: dataSub.subscription.durationMonth,
          totalCheckin: dataSub.subscription.totalCheckin || 0,
          paymentStatus: dataSub.subscription.paymentStatus,
          paymentInfo: dataSub.subscription.paymentInfo,
        })
      } else {
        resetMyMembership()
      }
      handleCloseBackdrop()
    }
    init()
  }, [])

  const handleClickSub = () => {
    setOpenSelectPaymentModal(true)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Gói tập hiện tại */}
      <MembershipCard />

      {/* Tiêu đề */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            background: "linear-gradient(135deg, #16697A, #489FB5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Các Gói Tập Luyện
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chọn gói tập phù hợp với nhu cầu và mục tiêu của bạn
        </Typography>
      </Box>

      {/* Danh sách gói tập */}
      <Grid container spacing={3}>
        {listMembership?.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard handleClickSub={handleClickSub} setPackageToPayment={setPackageToPayment} data={p} />
          </Grid>
        ))}
      </Grid>
      <SelectPaymentModal
        open={openSelectPaymentModal}
        onClose={() => setOpenSelectPaymentModal(false)}
        packageData={packageToPayment}
      />
      <MyBackdrop open={openBackdrop} handleClose={handleCloseBackdrop} />
    </Container>
  )
}
