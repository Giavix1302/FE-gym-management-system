import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"

export default function TimeField({ label, value, setDetailValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        ampm={false}
        label={label}
        value={value}
        onChange={(newValue) => {
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
