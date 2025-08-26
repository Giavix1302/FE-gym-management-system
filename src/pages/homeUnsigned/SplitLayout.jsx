import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material"
import EastIcon from "@mui/icons-material/East"

function SplitLayout({ content, reverse = false }) {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: reverse ? "row" : "row-reverse",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Box sx={{}}>
        <Typography
          variant="h5"
          sx={{ textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1, color: "text.primary" }}
        >
          {content.heading}
        </Typography>
        {content.descriptions.map((description) => {
          return <Typography sx={{ my: 2, color: "text.secondary" }}>{description}</Typography>
        })}

        <Button sx={{ fontWeight: "bold", mt: 2 }} startIcon={<EastIcon fontSize="small" />}>
          Tìm hiểu thêm
        </Button>
      </Box>
      <Box>
        <Box
          component="img"
          src={content.img}
          alt={content.heading}
          sx={{
            width: "300px",
            height: "300px", // set chiều cao tùy ý
            objectFit: "cover", // có thể là "contain" nếu muốn giữ nguyên tỉ lệ
            borderRadius: 2,
          }}
        />
      </Box>
    </Container>
  )
}

export default SplitLayout
