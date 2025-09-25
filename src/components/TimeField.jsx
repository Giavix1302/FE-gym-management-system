import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { useState } from "react"

export default function TimeField({ label, setDetailValue }) {
  const [value, setValue] = useState(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        ampm={false}
        label={label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          setDetailValue((prev) => ({
            ...prev,
            hour: newValue.$H || 0,
            minute: newValue.$m || 0,
          }))
        }}
      />
    </LocalizationProvider>
  )
}
