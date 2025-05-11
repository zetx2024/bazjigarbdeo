let paymentsClient = null;

function getGooglePaymentsConfiguration() {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: "CARD",
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["MASTERCARD", "VISA"]
      },
      tokenizationSpecification: {
        type: "PAYMENT_GATEWAY",
        parameters: {
          gateway: "example", // Use your real gateway here like "stripe"
          gatewayMerchantId: "exampleMerchantId"
        }
      }
    }]
  };
}

function onGooglePayLoaded() {
  paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

  paymentsClient.isReadyToPay(getGooglePaymentsConfiguration())
    .then(function(response) {
      if (response.result) {
        createAndAddButton();
      }
    })
    .catch(function(err) {
      console.error("isReadyToPay error:", err);
    });
}

function createAndAddButton() {
  const button = paymentsClient.createButton({
    onClick: onGooglePaymentButtonClicked
  });
  document.getElementById('google-pay-button').appendChild(button);
}

function getPaymentDataRequest() {
  const paymentDataRequest = Object.assign({}, getGooglePaymentsConfiguration());
  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'FINAL',
    totalPrice: '1.00',
    currencyCode: 'USD',
    countryCode: 'US'
  };
  paymentDataRequest.merchantInfo = {
    merchantId: 'BCR2DN4T267YFFZN', // Optional in TEST mode
    merchantName: 'Youth Research Journal'
  };
  return paymentDataRequest;
}

function onGooglePaymentButtonClicked() {
  const paymentDataRequest = getPaymentDataRequest();
  paymentsClient.loadPaymentData(paymentDataRequest)
    .then(function(paymentData) {
      console.log("Payment successful!", paymentData);
      alert("Payment successful!");
    })
    .catch(function(err) {
      console.error("Payment failed:", err);
    });
}
