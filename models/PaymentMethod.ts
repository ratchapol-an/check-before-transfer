enum PaymentMethod {
  Others = 0,
  BankAccountTransfer = 1,
  TrueWallet = 2,
  PromptPay = 3,
}

const paymentMethodCaptions: Record<PaymentMethod, string> = {
  0: 'อื่นๆ',
  1: 'โอนเงินผ่านบัญชีธนาคาร',
  2: 'True Wallet',
  3: 'พร้อมเพย์',
};

export { paymentMethodCaptions };
export default PaymentMethod;
