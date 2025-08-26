import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography, Link } from "@mui/material"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import { Google } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useState, Fragment } from "react"

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

const steps = ["Xác thực tài khoản", "Bổ sung thông tin"]

function Signup() {
  const navigate = useNavigate()

  // set up HorizontalLinearStepper
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = (state) => {
    if (state === "Finish") {
      console.log("🚀 ~ handleNext ~ Finish:")
    }

    if (state === "Next") {
      console.log("🚀 ~ handleNext ~ Next:")
    }

    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box
      sx={{
        px: 5,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 999,
        bgcolor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" color="primary">
        Wellcome to THE GYM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Đăng kí để có những trải nghiệm tốt nhất!
      </Typography>

      <Stepper sx={{ width: "100%", mt: 4, mb: 1 }} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}
          if (isStepOptional(index)) {
            labelProps.optional = false
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step sx={{ p: 0 }} key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          {/* finally */}
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {activeStep + 1 === 1 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              {/* <Typography align="left" sx={{ mt: 2, mb: 1 }}>
                Bước 1: Xác thưc tài khoản
              </Typography> */}

              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Số điện thoại
              </Typography>
              <TextField size="small" fullWidth placeholder="Nhập số điện thoại" type="tel" />

              {/* Mật khẩu */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                Mật khẩu
              </Typography>
              <TextField size="small" fullWidth placeholder="Nhập mật khẩu" type="password" />

              {/* Mật khẩu */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                Nhập lại mật khẩu
              </Typography>
              <TextField size="small" fullWidth placeholder="Nhập lại mật khẩu" type="password" />

              {/* Lưu mật khẩu */}
              <FormControlLabel
                control={<Checkbox color="primary" size="small" />}
                label="Lưu mật khẩu"
                sx={{ mt: 0, width: "100%", justifyContent: "flex-end", mr: 0 }}
              />
            </Box>
          )}

          {activeStep + 1 === 2 && (
            <Box sx={{ width: "100%", mb: 3, mt: 2 }}>
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Họ và tên
              </Typography>
              <TextField size="small" fullWidth placeholder="Nhập số điện thoại" type="tel" />

              {/* Mật khẩu */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                Email
              </Typography>
              <TextField size="small" fullWidth placeholder="Nhập mật khẩu" type="email" />

              {/* Mật khẩu */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
                Ngày tháng năm sinh
              </Typography>
              {/* <TextField size="small" fullWidth placeholder="Nhập lại mật khẩu" type="password" /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(values) => console.log("values:", values)}
                  sx={{
                    p: 0,
                    width: "100%",
                    "& .MuiPickersSectionList-root": {
                      py: 1,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          )}

          <Box sx={{ width: "100%", display: "flex", flexDirection: "row", pt: 2, gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 1, py: 1, borderRadius: 2 }}
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 1, py: 1, borderRadius: 2 }}
                onClick={() => handleNext("Đăng ")}
              >
                Finish
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 1, py: 1, borderRadius: 2 }}
                onClick={() => handleNext("Next")}
              >
                Next
              </Button>
            )}
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Signup
