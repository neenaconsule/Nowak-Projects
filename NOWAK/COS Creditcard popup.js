/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/redirect', 'N/https',"N/search"], function (ui, redirect, https, search) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var amountCharging = context.request.parameters.totalPaymentAmount
  log.debug("intIdsParam", context.request.parameters.intIdsParam)
            var creditCards = getCrediCardInfo()

            //   var isPopup = context.request.parameters.isPopup;
            // if (isPopup) {
            var form = ui.createForm({ title: 'Payment Form' });

            form.addFieldGroup({
                id: 'paymentgroup',
                label: 'Select / Add Card'
            });



            var cardField = form.addField({
                id: 'custpage_card_select',
                type: ui.FieldType.SELECT,
                label: 'Cards on File',
                container: 'paymentgroup'
            });

            log.debug("creditCards",creditCards)
            if (creditCards.length > 0) {

                for (var j = 0; j < creditCards.length; j++) {
                    //log.debug("creditCards",creditCards[j])
                    cardField.addSelectOption({
                        value: creditCards[j].value,
                        text:creditCards[j].text

                    });
                }
            }

            // cardField.addSelectOption({
            //     value: '1',
            //     text: '(Default) Mastercard ....***'
            // });
            // cardField.addSelectOption({
            //     value: '2',
            //     text: 'Visa ....***'
            // });

            form.addField({
                id: 'custpage_edit_card',
                type: ui.FieldType.CHECKBOX,
                label: 'Edit Card',
                container: 'paymentgroup'
            });

            form.addButton({
                id: 'custpage_delete_card',
                label: 'Delete Card',
                functionName: 'deleteCard'
            });

            var cardType = form.addField({
                id: 'custpage_card_type',
                type: ui.FieldType.SELECT,
                label: 'Credit Card Type',
                container: 'paymentgroup'
            });
            cardType.addSelectOption({
                value: 'mastercard',
                text: 'MasterCard'
            });
            cardType.addSelectOption({
                value: 'visa',
                text: 'Visa'
            });

            form.addField({
                id: 'custpage_card_number',
                type: ui.FieldType.TEXT,
                label: 'Credit Card Number',
                container: 'paymentgroup'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            });

            form.addField({
                id: 'custpage_expiration_date',
                type: ui.FieldType.DATE,
                label: 'Expiration Date',
                container: 'paymentgroup'
            });

            form.addField({
                id: 'custpage_cvv',
                type: ui.FieldType.TEXT,
                label: 'CVV',
                container: 'paymentgroup'
            }).isMandatory = true;

            form.addField({
                id: 'custpage_cardholder_name',
                type: ui.FieldType.TEXT,
                label: 'Cardholder Name',
                container: 'paymentgroup'
            });

            form.addField({
                id: 'custpage_street_address',
                type: ui.FieldType.TEXT,
                label: 'Street Address',
                container: 'paymentgroup'
            }).isMandatory = true;

            form.addField({
                id: 'custpage_zip_code',
                type: ui.FieldType.TEXT,
                label: 'Zip Code',
                container: 'paymentgroup'
            }).isMandatory = true;

            form.addField({
                id: 'custpage_default_payment',
                type: ui.FieldType.CHECKBOX,
                label: 'Make this default payment method',
                container: 'paymentgroup'
            });

            form.addField({
                id: 'custpage_amount_to_charge',
                type: ui.FieldType.CURRENCY,
                label: 'Amount to Charge: ',
                container: 'paymentgroup'
            }).defaultValue = amountCharging;


            form.addSubmitButton({
                label: 'Charge Card',
                container: 'paymentgroup'
            });

            context.response.writePage(form);
            // } else {
            //     // Your existing GET logic
            // }
        } else {
            // Handle POST request
            var request = context.request;

            // Process the payment...



            var successUrl = 'https://543925-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2222&deploy=1&compid=543925_SB1&ns-at=AAEJ7tMQRYrKV8LMdCYewbXDcYF5O4iymRRLWc5fPS45SsiG970';
            // context.response.write('<html><body><script type="text/javascript">window.location.href = "' + successUrl + '";</script></body></html>');
            context.response.write('<html><body><script type="text/javascript">window.opener.location.reload(true); window.location.href = "' + successUrl + '";</script></body></html>');

        }
    }

    function getCrediCardInfo() {
        try {

            const customerSearch = search.create({
                type: 'customer',
                filters: ['internalid', 'anyof', '12516'],
                columns: [
                    search.createColumn({ name: 'internalid', join: 'paymentinstrument' }),
                    search.createColumn({ name: 'default', join: 'paymentinstrument' }),
                    search.createColumn({ name: 'mask', join: 'paymentinstrument' })

                ],
            });
            var searchResultCount = customerSearch.runPaged().count;
            if (searchResultCount > 0) {
                var creditArray = [];
                customerSearch.run().each(function (result) {
                    //  var creditObject = {};
                   // creditArray.push(result.getValue({ name: 'internalid', join: 'paymentinstrument' }))
                    creditArray.push({
                        value: result.getValue({ name: 'internalid', join: 'paymentinstrument' }),
                        text: result.getValue({ name: 'mask', join: 'paymentinstrument' })
                    });
                    return true
                });
            }

            return creditArray;
        } catch (e) {
            log.debug("error@getCreditCardInfo", e)
        }
    }




    return {
        onRequest: onRequest
    };
});
