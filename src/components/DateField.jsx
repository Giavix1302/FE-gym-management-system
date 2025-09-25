import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { toast } from "react-toastify"

function DateField({ label, value, setValue, fontSize = "small" }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        slotProps={{
          textField: {
            // size: "small",
            onKeyDown: (e) => e.preventDefault(),
          },
        }}
        onError={(error) => {
          toast.error(error)
        }}
        onChange={(values) => {
          return setValue((prev) => ({
            ...prev,
            day: values?.$D || 0,
            month: values?.$M + 1 || 0,
            year: values?.$y || 0,
          }))
        }}
        sx={{
          width: "100%",
          // p: 0,
          // width: "100%",
          // "& .MuiPickersSectionList-root": {
          //   py: 1,
          // },
        }}
      />
    </LocalizationProvider>
  )
}

export default DateField
