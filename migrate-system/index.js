const XLSX = require("xlsx");
const dayjs = require("dayjs");
const { mapBankName } = require("./service");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const Sequelize = require("sequelize");
const db = require("./db/models/index").sequelize;
const Reports = require("./db/models/report");

dayjs.extend(customParseFormat);
require("dayjs/locale/th");

const workbook = XLSX.readFile("FIRST2000.xlsx");
const sheetName = workbook.SheetNames[0];

var worksheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

const paymentMethodCaptions = {
  อื่นๆ: 0,
  โอนเงินผ่านบัญชีธนาคาร: 1,
  "True Wallet": 2,
  พร้อมเพย์: 3,
};
const productTypeCaptions = {
  อื่นๆ: 0,
  สินค้าออนไลน์: 1,
  บริการ: 2,
  เงินกู้: 3,
  พนันออนไลน์: 4,
  วงแชร์: 5,
  "ลงทุน/ออมเงิน": 6,
  หลอกลวงเชิงบุคคล: 7,
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const insert = async () => {
  const ReportModel = Reports(db, Sequelize);

  for (i = 0; i < rawData.length; i++) {
    const row = rawData[i];

    const bankRef = await mapBankName(row["ธนาคาร"]);
    const productTypeRef = row["สินค้า/บริการ"];
    let bankAccountNo = row["เลขบัญชี"];
    let phoneNumber = "";
    let bankCode = "";
    let idNumber = "";
    let paymentMethod = paymentMethodCaptions["อื่นๆ"];
    const eventDate = row["วันที่รายงาน"]
      ? dayjs(`${row["วันที่รายงาน"].replace(/\s/g, "")}`, "DD-MM-YYYY").format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        )
      : "";
    const productType = productTypeCaptions[productTypeRef]
      ? productTypeCaptions[productTypeRef]
      : productTypeCaptions["อื่นๆ"];
    if (bankRef.bankCode !== undefined && bankRef.bankCode !== "") {
      bankCode = bankRef.bankCode;
      paymentMethod = paymentMethodCaptions["โอนเงินผ่านบัญชีธนาคาร"];
    }
    if (bankRef.bankCode === undefined || bankRef.bankCode == "") {
      if (bankRef.ref !== "") {
        switch (bankRef.ref) {
          case "True Wallet":
            if (row["เลขบัญชี"].length <= 13) {
              if (row["เลขบัญชี"].length > 10) {
                idNumber = row["เลขบัญชี"];
              } else {
                phoneNumber = `0${row["เลขบัญชี"]}`;
              }
              paymentMethod = paymentMethodCaptions["True Wallet"];
            }
            break;
          case "พร้อมเพย์ (PromptPay)": {
            if (row["เลขบัญชี"].length > 10) {
              idNumber = row["เลขบัญชี"];
            } else {
              phoneNumber = `0${row["เลขบัญชี"]}`;
            }
            paymentMethod = paymentMethodCaptions["พร้อมเพย์"];
            break;
          }
          default:
        }
      }
      bankAccountNo = "";
    }

    const report = {
      name: row["ชื่อคนขาย"]
        ? row["ชื่อคนขาย"].replace(/(?:\r\n|\r|\n)/g, "").replace("  ", " ")
        : "",
      amount: parseFloat(row["ยอดเงิน"].replaceAll(",", "")),
      eventDetail: row["รายละเอียดเพิ่มเติม"]
        ? row["รายละเอียดเพิ่มเติม"].replace(/(?:\r\n|\r|\n)/g, "")
        : "",
      reporterID: "TDULMbEwo3MS2NKBFqgc72VRZbK2",
      paymentMethod: paymentMethod,
      productType: productType,
      productLink: "",
      bankCode: bankCode,
      bankAccountNo: bankAccountNo,
      phoneNumber: phoneNumber,
      idNumber: idNumber,
      eventDate: eventDate,
      status: 2,
      attachedFiles: {},
      isDeleted: false,
    };

    try {
      const resp = await ReportModel.create(report);
      console.log(resp.toJSON());
    } catch (e) {
      console.log(e);
    }
  }
};

insert();
