import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from "@mui/material"

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  description = "Bạn có chắc muốn thực hiện thao tác này?",
  confirmText = "Xóa",
  cancelText = "Hủy",
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <Typography id="confirm-dialog-description" variant="body2">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
