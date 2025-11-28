import { Box, Container, Typography, Grid, Card, CardMedia } from "@mui/material"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import PersonIcon from "@mui/icons-material/Person"
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

function FitnessClassPage() {
  const classes = [
    {
      id: 1,
      name: "YOGA",
      intensity: "Vừa phải",
      duration: "60 Phút",
      image: "/public/yoga.jpg",
    },
    {
      id: 2,
      name: "DANCE",
      intensity: "Cơ bản",
      duration: "60 Phút",
      image: "/public/dance.jpg",
    },
    {
      id: 3,
      name: "BOXING",
      intensity: "Trung bình đến nâng cao",
      duration: "60 Phút",
      image: "/public/boxing.jpg",
    },
    {
      id: 4,
      name: "CARDIO & CORE",
      intensity: "Trung bình đến nâng cao",
      duration: "60 Phút",
      image: "/public/cadio.jpg",
    },
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 300, md: 350 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(11, 49, 56, 0.88) 0%, rgba(26, 57, 64, 0.85) 50%, rgba(35, 52, 55, 0.82) 100%)",
          backgroundImage: "url('/class.jpg')",
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
              LỚP TẬP NHÓM
            </Typography>
          </Box>
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
            Tham gia các lớp tập nhóm với huấn luyện viên chuyên nghiệp
          </Typography>
        </Container>
      </Box>

      {/* Classes Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {classes.map((classItem) => (
            <Grid size={{ xs: 12, md: 6 }} key={classItem.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {/* Title Above Image */}
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    py: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      letterSpacing: 1,
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      paddingX: 3,
                      paddingY: 1,
                      bgcolor: "white",
                      borderRadius: 999,
                    }}
                  >
                    {classItem.name}
                  </Typography>
                </Box>

                {/* Image with rounded corners */}
                <CardMedia
                  sx={{
                    height: 400,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(22, 105, 122, 0.9) 0%, rgba(72, 159, 181, 0.9) 100%)",
                    borderRadius: 3,
                    mx: 2,
                    my: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Box component="img" src={classItem.image} sx={{ objectFit: "cover", overflow: "hidden" }} />
                  </Box>
                </CardMedia>

                {/* Icons Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    px: 3,
                    py: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  {/* Class Type Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        border: "3px solid",
                        borderColor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 28, color: "primary.main" }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {classItem.name}
                    </Typography>
                  </Box>

                  {/* Intensity Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        border: "3px solid",
                        borderColor: "secondary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                      }}
                    >
                      <SignalCellularAltIcon sx={{ fontSize: 28, color: "secondary.main" }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      Cường độ {classItem.intensity.toLowerCase()}
                    </Typography>
                  </Box>

                  {/* Duration Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        border: "3px solid",
                        borderColor: "info.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 28, color: "info.main" }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {classItem.duration}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default FitnessClassPage
