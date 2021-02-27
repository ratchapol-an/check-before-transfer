/* eslint-disable import/prefer-default-export */
const numberFormatter = new Intl.NumberFormat('th-TH');
export const formatAmount = (value: number) => `${numberFormatter.format(value)} บาท`;

const datetimeFormatter = new Intl.DateTimeFormat('th-TH', { month: 'long' });
export const formatDate = (value: string) => datetimeFormatter.format(new Date(value));
