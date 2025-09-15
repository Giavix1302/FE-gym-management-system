import { Card, CardContent, Typography, Box, Divider, Button } from "@mui/material"
import { formatCurrencyVND } from "~/utils/common"

export default function MembershipCard({ content, contrast = false }) {
  console.log("🚀 ~ MembershipCard ~ content:", content)
  return (
    <Card
      sx={{
        maxWidth: 280,
        borderRadius: 4,
        boxShadow: 4,
        textAlign: "center",
        p: 2,
        bgcolor: contrast ? "primary.main" : "background.paper",
      }}
    >
      {/* Hàng 1 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color={contrast ? "warning" : "primary.main"}
          sx={{ textTransform: "uppercase" }}
        >
          {content.duration}
        </Typography>
        <Box sx={{ bgcolor: (theme) => theme.palette.warning.main, px: 1, borderRadius: 1 }}>
          <Typography sx={{ textTransform: "uppercase" }} variant="caption" fontWeight="bold" color="primary.main">
            {content.location}
          </Typography>
        </Box>
      </Box>

      {/* Hàng 2 */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ my: 2, color: contrast ? "background.default" : "secondary.main" }}
      >
        {formatCurrencyVND(content.price)} / Tháng
      </Typography>

      <Divider />

      {/* Hàng 3 */}
      <CardContent>
        <Typography
          variant="body2"
          color={contrast ? "background.default" : "text.secondary"}
          sx={{ textAlign: "justify" }}
        >
          {content.description}
        </Typography>
      </CardContent>

      <Divider sx={{ mb: 2 }} />

      {/* Hàng 4 */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="text">
          <Typography
            sx={{ textDecoration: "underline", fontWeight: "bold", color: contrast ? "background.default" : "primary" }}
          >
            Xem chi tiết
          </Typography>
        </Button>
        <Button variant="contained" color="warning" sx={{ fontWeight: "bold" }}>
          Tham gia
        </Button>
      </Box>
    </Card>
  )
}
