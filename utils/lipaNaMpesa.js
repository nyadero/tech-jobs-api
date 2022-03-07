const { log } = require("sharp/lib/libvips");

// mpesa api
const Mpesa = require("mpesa-api").Mpesa;

// credentials
const credentials = {
    clientKey: process.env.CLIENT_KEY,
    clientSecret: process.env.CONSUMER_SECRET,
    initiatorPassword: process.env.INITIATOR_PASSWORD,
    securityCredential: process.env.SECURITY_CREDENTIAL,
    certificatePath: null,
}

const environment = "sandbox"

// create a new instance of the class mpesa
const mpesa = new Mpesa(credentials, environment);

// Customer to business api call

// register api call
mpesa.c2bRegister({
    ShortCode: "short code",
    ResponseType: "Completed",
    ConfirmationURL: "",
    ValidationURL: ""
}).then((response) => {
    console.log({response});
}).catch((error) => {
    console.log({error});
})

// simulate
mpesa
  .c2bsimulate({
    ShortCode: 174379,
    Amount: 1000 /* 1000 is an example amount */,
    Msisdn: 254792123456,
    CommandID: "Command ID" /* OPTIONAL */,
    BillRefNumber: "Bill Reference Number" /* OPTIONAL */,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });


//   check account balance
mpesa
  .accountBalance({
    Initiator: "testapi",
    PartyA: 600988,
    IdentifierType: "Identifier Type",
    QueueTimeOutURL: "Queue Timeout URL",
    ResultURL: "Result URL",
    CommandID: "Command ID" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

//   check transaction status
mpesa
  .transactionStatus({
    Initiator: "testapi",
    TransactionID: "Transaction ID",
    PartyA: 600988,
    IdentifierType: "Identifier Type",
    ResultURL: "Result URL",
    QueueTimeOutURL: "Queue Timeout URL",
    CommandID: "Command ID" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
    Occasion: "Occasion" /* OPTIONAL */,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });