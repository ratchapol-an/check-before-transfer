const { bankObj } = require("./bank");

const mapBankName = (bankRef) => {
  let bankName = bankRef ? bankRef.trim() : bankRef;
  switch (bankName) {
    case "True Wallet":
    case "พร้อมเพย์ (PromptPay)":
    case "เก็บเงินปลายทาง":
    case "AirPay (แอร์เพย์)":
      return {
        bankCode: undefined,
        name: "",
        ref: bankName,
      };
    case "N/A":
    case undefined:
    case "undefined":
    case "3":
    case "#ERROR!":
      return {
        bankCode: "",
        name: "",
        ref: "",
      };
    case "ธนาคารธนชาติ":
      return bankObj["ธนาคารธนชาต"];
    case "ธนาคารซีไอเอ็มบี":
      return bankObj["ธนาคารซีไอเอ็มบีไทย"];
    case "ธนาคารแลนด์แอนด์เฮ้าส์":
      return bankObj["ธนาคารแลนด์แอนด์ เฮ้าส์"];
    case "ธนาคารอิสลาม":
      return bankObj["ธนาคารอิสลามแห่งประเทศไทย"];
    case "ธนาคารเกียรตินาคิน":
      return bankObj["ธนาคารเกียรตินาคินภัทร"];
    default:
      return bankObj[`${bankName}`];
  }
};

module.exports = {
  mapBankName,
};
