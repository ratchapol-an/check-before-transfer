/* eslint-disable import/prefer-default-export */
const formatter = new Intl.NumberFormat('th-TH');
export const formatAmount = (value: number) => `${formatter.format(value)} บาท`;
