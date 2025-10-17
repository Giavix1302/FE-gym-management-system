import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material"
import {
  QrCodeScanner as QrCodeScannerIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import { format, parseISO, startOfDay, endOfDay } from "date-fns"
import { vi } from "date-fns/locale"

// QR Scanner library
import QrScanner from "qr-scanner"

// API imports
import { toggleAttendanceQrCodeAPI, getListAttendanceByLocationIdAPI } from "~/apis/attendance"
import { toast } from "react-toastify"

// Configuration - replace with actual values
// sau này khi thêm role staff thì nhớ lấy từ store staff ra không fix cứng
const LOCATION_ID = "68e62d5b8bc0ac69b9eb15f7" // Replace with actual location ID

export default function AdminCheckinPage() {
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)

  const [stream, setStream] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [checkinHistory, setCheckinHistory] = useState([])
  const [recentAction, setRecentAction] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [lastScannedQR, setLastScannedQR] = useState(null)
  const [qrCooldownSeconds, setQrCooldownSeconds] = useState(0)
  const [qrDisappeared, setQrDisappeared] = useState(true) // Track if QR disappeared
  const [isBlocked, setIsBlocked] = useState(false) // Simple blocking flag
  const countdownTimerRef = useRef(null) // Track countdown timer
  const isProcessingRef = useRef(false) // Ref-based blocking (immediate)

  // New states for API integration
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [locationInfo, setLocationInfo] = useState(null)

  // Load attendance history from API
  const loadAttendanceHistory = useCallback(async () => {
    try {
      setHistoryLoading(true)
      const startDateISO = startOfDay(new Date(startDate)).toISOString()
      const endDateISO = endOfDay(new Date(endDate)).toISOString()

      const result = await getListAttendanceByLocationIdAPI(LOCATION_ID, {
        startDate: startDateISO,
        endDate: endDateISO,
      })

      if (result.success) {
        // Transform API data to match component structure
        const transformedData = result.attendances.map((item) => ({
          _id: item._id,
          fullName: item.user.fullName,
          phone: item.user.phone,
          checkinTime: item.checkinTime,
          checkoutTime: item.checkoutTime,
          hours: item.hours,
          userId: item.userId,
        }))

        setCheckinHistory(transformedData)
        setLocationInfo(result.location)
      } else {
        toast.error(`Lỗi tải dữ liệu: ${result.message}`)
      }
    } catch (error) {
      console.error("Error loading attendance:", error)
      toast.error(`Lỗi kết nối API: ${error.message}`)
    } finally {
      setHistoryLoading(false)
    }
  }, [startDate, endDate])

  // Utility functions - moved before API handlers to fix hoisting
  const formatTime = useCallback((timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "HH:mm", { locale: vi })
  }, [])

  const formatDate = useCallback((timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "dd/MM/yyyy HH:mm", { locale: vi })
  }, [])

  // Handle toggle attendance API call - unified checkin/checkout
  const handleToggleAttendanceAPI = useCallback(
    async (userId) => {
      try {
        setLoading(true)
        const result = await toggleAttendanceQrCodeAPI({
          userId,
          locationId: LOCATION_ID,
        })

        if (result.success) {
          const attendance = result.attendance
          const action = result.action // "checkin" or "checkout"

          setRecentAction({
            type: action,
            user: {
              fullName: attendance.user.fullName,
              phone: attendance.user.phone,
              membershipStatus: "active",
            },
            time: action === "checkin" ? attendance.checkinTime : attendance.checkoutTime,
            hours: attendance.hours || 0,
          })

          if (action === "checkin") {
            toast.success(
              `✅ Checkin thành công!\n${attendance.user.fullName}\nVào lúc: ${formatTime(attendance.checkinTime)}`,
            )
          } else {
            toast.success(`✅ Checkout thành công!\n${attendance.user.fullName}\nThời gian tập: ${attendance.hours}h`)
          }

          // Reload history to show updated data
          await loadAttendanceHistory()
          return { success: true, action }
        } else {
          toast.error(`Lỗi: ${result.message}`)
          return { success: false, message: result.message }
        }
      } catch (error) {
        console.error("Toggle attendance error:", error)

        // Handle AxiosError - extract error message from response
        let errorMessage = error.message
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }

        toast.error(`Lỗi: ${errorMessage}`)
        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [loadAttendanceHistory, formatTime],
  )

  // Load initial data
  useEffect(() => {
    loadAttendanceHistory()
  }, [loadAttendanceHistory])

  // Optimized camera constraints - prioritize performance
  const getCameraConstraints = useCallback(
    () => [
      {
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: "environment",
        },
      },
      {
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: "user",
        },
      },
      {
        video: { width: 640, height: 480 },
      },
      {
        video: true,
      },
    ],
    [],
  )

  // Handle checkin API call - simplified without auto-checkout

  // Start camera with optimized settings
  const startCamera = useCallback(async () => {
    setCameraLoading(true)
    setCameraError(null)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser không hỗ trợ camera")
      }

      const constraints = getCameraConstraints()
      let mediaStream = null

      // Try constraints in order
      for (const constraint of constraints) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraint)
          break
        } catch (error) {
          continue
        }
      }

      if (!mediaStream) {
        throw new Error("Không thể khởi động camera")
      }

      setStream(mediaStream)
      setCameraActive(true)

      // Setup video element
      const setupVideo = () => {
        if (!videoRef.current) {
          setTimeout(setupVideo, 50)
          return
        }

        videoRef.current.srcObject = mediaStream
        videoRef.current.onplaying = () => {
          setTimeout(() => startQRScanner(), 500)
        }

        videoRef.current.play().catch(() => {
          setTimeout(() => videoRef.current?.play(), 100)
        })
      }

      setupVideo()
    } catch (error) {
      setCameraError(`Lỗi camera: ${error.message}`)

      if (error.name === "NotAllowedError") {
        toast.error("Vui lòng cấp quyền truy cập camera")
      } else if (error.name === "NotFoundError") {
        toast.error("Không tìm thấy camera")
      } else {
        toast.error(`Lỗi camera: ${error.message}`)
      }
    }
    setCameraLoading(false)
  }, [getCameraConstraints])

  // Start QR Scanner with optimization
  const startQRScanner = useCallback(() => {
    if (!videoRef.current || qrScannerRef.current) return

    try {
      // Override Page Visibility for consistent scanning
      Object.defineProperty(document, "hidden", {
        value: false,
        configurable: true,
      })

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          // QR detected
          console.log("📱 QR Scanner: QR detected, setting disappeared = false")
          setQrDisappeared(false)
          handleQRDetected(result.data)
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 1, // Reduced from 4 to 1 to prevent rapid duplicates
          preferredCamera: "environment",
          onDecodeError: () => {
            // No QR detected - mark as disappeared after a short delay
            setTimeout(() => {
              console.log("👻 QR Scanner: No QR detected, setting disappeared = true after delay")
              setQrDisappeared(true)
            }, 500)
          },
        },
      )

      qrScanner
        .start()
        .then(() => {
          qrScannerRef.current = qrScanner
          setScanning(true)

          // Force trigger scanner activation
          setTimeout(() => {
            const event = new Event("visibilitychange")
            Object.defineProperty(document, "hidden", { value: true, configurable: true })
            document.dispatchEvent(event)

            setTimeout(() => {
              Object.defineProperty(document, "hidden", { value: false, configurable: true })
              document.dispatchEvent(event)
            }, 50)
          }, 500)
        })
        .catch(() => {
          setCameraError("QR Scanner khởi động thất bại")
        })
    } catch (error) {
      setCameraError("Lỗi khởi tạo QR Scanner")
    }
  }, [])

  // Process QR Code - Simplified with unified toggle API
  const processQRCode = useCallback(
    async (qrData) => {
      try {
        // Early exit if already processing
        if (loading) {
          console.log("⚠️ Already processing, skipping")
          return
        }

        let userId = null

        // Parse QR JSON
        try {
          const qrJson = JSON.parse(qrData)
          userId = qrJson.userId

          if (!userId) {
            toast.error("QR Code không chứa thông tin userId hợp lệ")
            return
          }
        } catch {
          toast.error("QR Code không đúng định dạng JSON")
          return
        }

        console.log("=== QR SCAN DEBUG ===")
        console.log("QR Data:", qrData)
        console.log("User ID:", userId)

        // Call unified toggle API - backend will decide checkin or checkout
        console.log("→ Calling unified toggle attendance API for user", userId)
        const result = await handleToggleAttendanceAPI(userId)

        if (result.success) {
          console.log(`✅ ${result.action} successful`)
        } else {
          console.log(`❌ Toggle attendance failed: ${result.message}`)
        }

        console.log("=== END QR SCAN DEBUG ===")
      } catch (error) {
        console.error("QR processing error:", error)
        toast.error(`Lỗi xử lý QR: ${error.message}`)
      }
    },
    [loading, handleToggleAttendanceAPI],
  )

  // Handle QR detection with hard 5-second delay and disappearance tracking
  const handleQRDetected = useCallback(
    (qrData) => {
      console.log("🔍 QR Detected:", qrData)

      // MASTER SWITCH: Ref-based blocking (immediate, no state delays)
      if (isProcessingRef.current) {
        console.log("❌ MASTER BLOCK - Still processing previous QR")
        return
      }

      // FIRST AND MOST IMPORTANT: Block during cooldown
      if (qrCooldownSeconds > 0) {
        console.log("❌ COOLDOWN ACTIVE - Blocking all processing")
        return
      }

      console.log("🔒 Last scanned:", lastScannedQR)
      console.log("⏰ Loading state:", loading)
      console.log("⏲️ Cooldown seconds:", qrCooldownSeconds)
      console.log("👻 QR disappeared:", qrDisappeared)

      // Prevent duplicate scans - same QR within cooldown period
      if (lastScannedQR === qrData) {
        console.log("❌ Same QR detected during cooldown, ignoring")
        return
      }

      // Prevent scan while processing API
      if (loading) {
        console.log("❌ Still processing API call, ignoring")
        return
      }

      // Prevent scan during cooldown period
      if (qrCooldownSeconds > 0) {
        console.log("❌ Still in cooldown period, ignoring")
        return
      }

      // NEW: Require QR to have disappeared before allowing new scan
      if (!qrDisappeared && lastScannedQR !== null) {
        console.log("❌ QR hasn't disappeared since last scan, ignoring")
        return
      }

      console.log("✅ Processing QR:", qrData)

      // ACTIVATE MASTER BLOCK immediately
      isProcessingRef.current = true
      console.log("🚫 MASTER BLOCK activated")

      // Set the QR immediately to prevent duplicates
      setLastScannedQR(qrData)

      // Mark QR as not disappeared (will be set to true when QR disappears)
      setQrDisappeared(false)

      // Clear any existing countdown timer to prevent overlaps
      if (countdownTimerRef.current) {
        console.log("🧹 Clearing existing countdown timer")
        clearInterval(countdownTimerRef.current)
        countdownTimerRef.current = null
      }

      // Start countdown timer
      console.log("🔥 Starting 5-second countdown timer")
      setQrCooldownSeconds(5)

      // Process the QR code
      processQRCode(qrData)

      // Countdown timer - update every second
      countdownTimerRef.current = setInterval(() => {
        setQrCooldownSeconds((prev) => {
          console.log(`⏰ Countdown: ${prev} -> ${prev - 1}`)
          if (prev <= 0) {
            console.log("🏁 Countdown reached 0, clearing interval")
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
            setLastScannedQR(null)
            // DEACTIVATE MASTER BLOCK
            isProcessingRef.current = false
            console.log("🔓 MASTER BLOCK deactivated - Ready for next scan")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    [lastScannedQR, loading, qrCooldownSeconds, qrDisappeared, processQRCode],
  )

  // Stop camera with complete cleanup
  const stopCamera = useCallback(() => {
    // Stop QR Scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    // Clean video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.load()
    }

    // Remove overlays
    document.querySelectorAll(".qr-scanner-overlay, .scan-region-highlight").forEach((overlay) => overlay.remove())

    // Reset Page Visibility
    try {
      delete document.hidden
      delete document.visibilityState
    } catch {}

    // Reset states
    setCameraActive(false)
    setScanning(false)
    setLastScannedQR(null)
    setCameraError(null)
  }, [stream])

  // Handle date filter changes
  const handleDateFilter = useCallback(() => {
    loadAttendanceHistory()
  }, [loadAttendanceHistory])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup QR Scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
      }

      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // Cleanup countdown timer
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }

      // Cleanup DOM elements
      document.querySelectorAll(".qr-scanner-overlay, .scan-region-highlight").forEach((overlay) => overlay.remove())

      // Reset document properties
      try {
        delete document.hidden
        delete document.visibilityState
      } catch {}
    }
  }, [stream])

  const getStatusChip = useCallback((checkinTime, checkoutTime) => {
    if (!checkoutTime) {
      return <Chip label="Đang tập luyện" color="success" size="small" icon={<FitnessCenterIcon />} />
    }
    return <Chip label="Đã hoàn thành" color="default" size="small" icon={<CheckCircleIcon />} />
  }, [])

  const stats = {
    activeUsers: checkinHistory.filter((item) => !item.checkoutTime).length,
    completedSessions: checkinHistory.filter((item) => item.checkoutTime).length,
    totalSessions: checkinHistory.length,
  }

  return (
    <Box sx={{ p: 1, height: "100vh" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <QrCodeScannerIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  Quản lý Checkin/Checkout
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" color="text.secondary">
                Hôm nay: {format(new Date(), "dd/MM/yyyy", { locale: vi })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={1}>
        {/* Camera Section */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 514 }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Camera QR Scanner {scanning && "(Đang quét)"}
                  </Typography>
                  {/* Status indicator */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: cameraActive ? (scanning ? "success.main" : "warning.main") : "error.main",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {cameraActive ? (scanning ? "Đang quét QR" : "Camera sẵn sàng") : "Camera tắt"}
                      {loading && " - Đang xử lý"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {!cameraActive ? (
                    <Button
                      variant="contained"
                      startIcon={cameraLoading ? <CircularProgress size={16} /> : <VideocamIcon />}
                      onClick={startCamera}
                      disabled={cameraLoading || loading}
                    >
                      {cameraLoading ? "Đang khởi động..." : "Bật Camera"}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<VideocamOffIcon />}
                      onClick={stopCamera}
                      disabled={loading}
                    >
                      Tắt Camera
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Camera Display */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: cameraError
                    ? "error.main"
                    : scanning
                      ? "success.main"
                      : cameraActive
                        ? "primary.main"
                        : "grey.300",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 0, // Important: allows flex child to shrink
                }}
              >
                {cameraError ? (
                  <Box sx={{ textAlign: "center", p: 4, color: "error.main" }}>
                    <Typography variant="h6">Lỗi Camera</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {cameraError}
                    </Typography>
                    <Button variant="contained" onClick={startCamera} disabled={loading}>
                      Thử lại
                    </Button>
                  </Box>
                ) : cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        maxHeight: "100%", // Prevent overflow
                        maxWidth: "100%", // Prevent overflow
                      }}
                    />
                    {scanning && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 20,
                          left: "50%",
                          transform: "translateX(-50%)",
                          bgcolor: "rgba(0,0,0,0.7)",
                          color: "white",
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {loading
                            ? "Đang xử lý..."
                            : qrCooldownSeconds > 0
                              ? `Chờ ${qrCooldownSeconds}s để quét tiếp...`
                              : "Đưa QR code vào camera để quét"}
                        </Typography>
                      </Box>
                    )}
                    {loading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          bgcolor: "rgba(0,0,0,0.8)",
                          color: "white",
                          px: 3,
                          py: 2,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <CircularProgress size={24} color="inherit" />
                        <Typography>Đang xử lý...</Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", p: 4 }}>
                    <VideocamOffIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Camera chưa được bật
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nhấn "Bật Camera" để bắt đầu quét QR code
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Recent Action */}
        <Grid item size={{ xs: 12, md: 6 }}>
          {/* Stats Cards */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            <Grid item size={{ xs: 4 }}>
              <Card>
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {stats.activeUsers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Đang tập
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 4 }}>
              <Card>
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {stats.completedSessions}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hoàn thành
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 4 }}>
              <Card>
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {stats.totalSessions}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tổng cộng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Action */}
          <Card sx={{ height: 408 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Hoạt động gần nhất
              </Typography>

              {recentAction ? (
                <Box>
                  <Alert
                    severity={recentAction.type === "checkin" ? "success" : "info"}
                    sx={{ mb: 2 }}
                    icon={recentAction.type === "checkin" ? <CheckCircleIcon /> : <CancelIcon />}
                  >
                    <Typography variant="subtitle2">
                      {recentAction.type === "checkin" ? "Checkin thành công!" : "Checkout thành công!"}
                    </Typography>
                  </Alert>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{recentAction.user.fullName.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {recentAction.user.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(recentAction.time)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số điện thoại
                        </Typography>
                        <Typography variant="body1">{recentAction.user.phone}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {recentAction.type === "checkin" ? "Thời gian vào" : "Thời gian ra"}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {formatTime(recentAction.time)}
                        </Typography>
                      </Box>
                    </Box>

                    {recentAction.type === "checkout" && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FitnessCenterIcon color="action" fontSize="small" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Thời gian tập luyện
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            {recentAction.hours}h
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <QrCodeScannerIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Chưa có hoạt động
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cameraActive ? "Đưa QR code vào camera để quét" : "Bật camera để bắt đầu"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Date Filter */}
        <Grid item size={{ xs: 12 }}>
          <Card sx={{}}>
            <CardContent
              sx={{
                "&:last-child": {
                  pb: 2,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <FilterListIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Bộ lọc ngày:
                </Typography>
                <TextField
                  label="Từ ngày"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  disabled={historyLoading}
                />
                <TextField
                  label="Đến ngày"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  disabled={historyLoading}
                />
                <Button
                  variant="contained"
                  startIcon={historyLoading ? <CircularProgress size={16} /> : <FilterListIcon />}
                  onClick={handleDateFilter}
                  disabled={historyLoading}
                >
                  {historyLoading ? "Đang tải..." : "Áp dụng"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* History Table */}
        <Grid item size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Lịch sử checkin/checkout ({checkinHistory.length} lượt)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={historyLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                  size="small"
                  onClick={loadAttendanceHistory}
                  disabled={historyLoading}
                >
                  {historyLoading ? "Đang tải..." : "Làm mới"}
                </Button>
              </Box>

              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Thành viên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Giờ vào</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Giờ ra</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Thời gian tập</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                          <CircularProgress size={32} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Đang tải dữ liệu...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : checkinHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Không có dữ liệu trong khoảng thời gian đã chọn
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      checkinHistory.map((record) => (
                        <TableRow key={record._id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar>{record.fullName.charAt(0)}</Avatar>
                              <Box>
                                <Typography fontWeight="medium">{record.fullName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {record.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {formatTime(record.checkinTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {formatTime(record.checkoutTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={record.hours > 0 ? "success.main" : "text.secondary"}
                            >
                              {record.hours > 0 ? `${record.hours}h` : "--"}
                            </Typography>
                          </TableCell>
                          <TableCell>{getStatusChip(record.checkinTime, record.checkoutTime)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
