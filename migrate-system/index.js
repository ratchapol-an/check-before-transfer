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

const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRlMDBlOGZlNWYyYzg4Y2YwYzcwNDRmMzA3ZjdlNzM5Nzg4ZTRmMWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUmF0YXBhbiBBbmFudGF3YXQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2p5bW5yY09taVQxTU8yTkQ3TXVPVDkyNkNkdjNGZFdGcldDNkU0PXM5Ni1jIiwic3VwZXJVc2VyIjp0cnVlLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2hlY2stYmVmb3JlLXRyYW5zZmVyIiwiYXVkIjoiY2hlY2stYmVmb3JlLXRyYW5zZmVyIiwiYXV0aF90aW1lIjoxNjE2MTc0NDE2LCJ1c2VyX2lkIjoib05UaWFWM3pVaGZlUDR2ZVh2c2JKMmFDWGY1MiIsInN1YiI6Im9OVGlhVjN6VWhmZVA0dmVYdnNiSjJhQ1hmNTIiLCJpYXQiOjE2MTYxNzQ0MTYsImV4cCI6MTYxNjE3ODAxNiwiZW1haWwiOiJyYXRhcGFuQGRyaXZlaHViLmNvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDM5Njk2MTQ3MTA0MDcxMzc3NDUiXSwiZW1haWwiOlsicmF0YXBhbkBkcml2ZWh1Yi5jbyJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.QizES-V23EPM3v4Ij_9wpnCs8OBA7CkNTeHuArn5Jv0A51qbcxxtolIcKEtnVzwz9e-CC8vQJ0GYfE5rYlK-nmFr9r4tRs5AgYnyen56D-iMzVGZq90QAEfqixM4boHkZkcypS9vsLxtM46uVYwctYBELi8GyBhz0w6KloAIpGzvbt7y1TU-ZZeqoT2tG5hQbs9TvUyh9ecuuDDhkMlbryJvdUWT66q3CwtkVcJSUBtUew3YElbzFgtEuPa-TWI2az1WEizpf68TFjwv9vph4zlRJg5k-4a6KmrMmojAvhgDVVZT-0-XSzT_r3DE6np4ZiNb7k-07dcvhYXLZlzZUA";

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
      reporterID: "oNTiaV3zUhfeP4veXvsbJ2aCXf52",
      paymentMethod: paymentMethod,
      productType: productType,
      productLink: "",
      bankCode: bankCode,
      bankAccountNo: bankAccountNo,
      phoneNumber: phoneNumber,
      idNumber: idNumber,
      eventDate: eventDate,
      status: 1,
      attachedFiles: {},
      isDeleted: false,
    };

    try {
      const resp = await ReportModel.create(report);
      console.log(resp.toJSON());
    } catch (e) {
      console.log(e);
    }
    // await sleep(100);
  }
};

insert();
