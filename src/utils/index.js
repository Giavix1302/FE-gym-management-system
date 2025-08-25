export const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
}
