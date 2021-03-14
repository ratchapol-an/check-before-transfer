/** Declaration file generated by dts-gen */

export type Bank = {
  code: string;
  color: string;
  nice_name: string;
  official_name: string;
  official_name_thai: string;
};

export const data: {
  baac: Bank;
  bay: Bank;
  bbl: Bank;
  cimb: Bank;
  gsb: Bank;
  icbc: Bank;
  kbank: Bank;
  kk: Bank;
  ktb: Bank;
  lhb: Bank;
  scb: Bank;
  tbank: Bank;
  tmb: Bank;
  uob: Bank;
};

export function Get(key: string): Bank;

export function listKey(): string[];