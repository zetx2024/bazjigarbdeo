let paymentsClient = null;

function onGooglePayLoaded() {
  paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example', // Replace with 'stripe' and real info for production
          gatewayMerchantId: 'exampleGatewayMerchantId'
        }
      }
    }],
    merchantInfo: {
      merchantName: "T-Shirt Store"
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '12.00',
      currencyCode: 'USD',
      countryCode: 'US'
    }
  };

  paymentsClient.isReadyToPay({ apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods })
    .then(function(response) {
      if (response.result) {
        const button = paymentsClient.createButton({
          onClick: function() {
            paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
              console.log("PaymentData:", paymentData);
              window.location.href = "confirmation.html";
            }).catch(function(err) {
              console.error("Google Pay Error:", err);
            });
          }
        });
        document.getElementById('google-pay-button').appendChild(button);
      }
    });
}
