/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/redirect', 'N/https', "N/search", "N/task", "N/ui/message", "N/record"], function (ui, redirect, https, search, task, message, record) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var amountCharging = context.request.parameters.totalPaymentAmount

            var intIdsParam = context.request.parameters.intIdsParam

            var custInternalId=context.request.parameters.customerIntId
            log.debug("custInternalId", custInternalId)
            log.debug("type", typeof custInternalId)
            var creditCards = getCrediCardInfo(Number(custInternalId))
            log.debug("creditCard", creditCards)

            var form = ui.createForm({ title: 'Payment Form' });

            form.addFieldGroup({
                id: 'paymentgroup',
                label: 'Select Card'
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
                        text: creditCards[j].text

                    });
                }
            }

          

            // form.addField({
            //     id: 'custpage_edit_card',
            //     type: ui.FieldType.CHECKBOX,
            //     label: 'Edit Card',
            //     container: 'paymentgroup'
            // });

            // form.addButton({
            //     id: 'custpage_delete_card',
            //     label: 'Delete Card',
            //     functionName: 'deleteCard'
            // });

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

            // form.addField({
            //     id: 'custpage_card_number',
            //     type: ui.FieldType.INTEGER,
            //     label: 'Credit Card Number',
            //     container: 'paymentgroup'
            // }).updateDisplayType({
            //     displayType: ui.FieldDisplayType.HIDDEN
            // }).

            form.addField({
                id: 'custpage_cust_id',
                type: ui.FieldType.TEXT,
                label: 'Customer Id',
                container: 'paymentgroup'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            }).defaultValue = context.request.parameters.customerIntId

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

            form.addField({
                id: 'custpage_int_ids_param',
                type: ui.FieldType.TEXT,
                label: 'IntIds Param',
                container: 'paymentgroup'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            }).defaultValue = intIdsParam;

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
            var intIdsParam = request.parameters.custpage_int_ids_param;

            var intIdsNumberArray = intIdsParam.split(',').map(Number);
            var customerIntId = request.parameters.custpage_cust_id;
            log.debug("customerIntId", customerIntId)
            var cardSelected = request.parameters.custpage_card_select;
            log.debug("intIdsNumberArray", intIdsNumberArray);

           // Call MapReduce Script
            // var mrTask = task.create({
            //     taskType: task.TaskType.MAP_REDUCE,
            //     scriptId: 'customscript_cos_mr_createpayments',
            //     deploymentId: 'customdeploy_cos_mr_createpayments',
            //     params: {
            //         custscript_invoice_ids: JSON.stringify(intIdsNumberArray), // Convert array to JSON string
            //         custscript_customer_id: customerIntId.toString(), // Ensure it's a string
            //         custscript_card_id: cardSelected.toString() // Ensure it's a string
            //     }
            // });
            // log.debug("Submitting MR Task with params", {
            //     custscript_invoice_ids: JSON.stringify(intIdsNumberArray),
            //     custscript_customer_id: customerIntId,
            //     custscript_card_id: cardSelected
            // });
            // var mrTaskId = mrTask.submit();
            // log.debug("MapReduce Task ID", mrTaskId);


           createPayment(context,intIdsNumberArray, customerIntId, cardSelected)


            // context.response.write('<html><body><script type="text/javascript">');
            // context.response.write('if (window.opener) {');
            // context.response.write('setTimeout(function() { window.opener.close(); }, 1000);'); // Close after a delay
            // context.response.write('}');
            // context.response.write('</script></body></html>');
        }
    }


    function createPayment(context, invoiceIds, customerId, cardId) {
        try {
            var paymentRecord = record.create({
                type: record.Type.CUSTOMER_PAYMENT,
                isDynamic: true
            });
            paymentRecord.setValue({ fieldId: 'customer', value: customerId });
            paymentRecord.setValue({ fieldId: 'paymentoption', value: cardId });

            invoiceIds.forEach(function (invoiceIds) {
                var line = paymentRecord.findSublistLineWithValue({
                    sublistId: 'apply',
                    fieldId: 'internalid',
                    value: invoiceIds
                });
                if (line !== -1) {
                    paymentRecord.selectLine({ sublistId: 'apply', line: line });
                    paymentRecord.setCurrentSublistValue({ sublistId: 'apply', fieldId: 'apply', value: true });
                    paymentRecord.commitLine({ sublistId: 'apply' });
                }
            });

            var paymentId = paymentRecord.save();
            log.debug('Payment Created', 'Payment ID: ' + paymentId);
            var msgContent = "success";
            openSuccessWindow(context, msgContent);
            //redirectToSuccessPage("success");

        } catch (e) {
            log.debug("err@createPayment", e);
            var msgContent = "Error";
            openSuccessWindow(context, msgContent);
           //redirectToSuccessPage("Error");
        }
    }

    // function redirectToSuccessPage(message) {
    //     var suiteletUrl = 'https://543925-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2222&deploy=1&compid=543925_SB1';
    //      suiteletUrl += '&respMsg=' + message;
    //      var script = "<script>";
    //      script += "window.location.href = '" + suiteletUrl + "';";
    //      script += "</script>";
     
    //      context.response.write(script);
    //     // redirect.redirect({
    //     //     url: suiteletUrl,
    //     //     parameters: {
    //     //         'custparam_test': message
    //     //     }
    //     // });
    // }

    function openSuccessWindow(context, message) {
        var suiteletUrl = 'https://543925-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2222&deploy=1&compid=543925_SB1&ns-at=AAEJ7tMQRYrKV8LMdCYewbXDcYF5O4iymRRLWc5fPS45SsiG970';
        suiteletUrl += '&respMsg=' + encodeURIComponent(message);

        var script = "<script>";
        script += "if (window.opener) {";
        script += "    window.opener.onbeforeunload = null;";
        script += "    window.opener.location.reload();";
        script += "}";
        script += "window.open('" + suiteletUrl + "', '_self');";
        script += "</script>";

        // context.response.write('if (window.opener) {');
            // context.response.write('window.onbeforeunload = function () {};');
            // context.response.write('  window.opener.location.reload();'); // Reload the parent window
            // context.response.write('}');


        // var script = "<script>";
        // script += "if (window.opener) {";
        // script += "    if (window.onbeforeunload) {";
        // script += "        window.onbeforeunload = function() {";
        // script += "            null;";
        // script += "        };";
        // script += "    }";
        // script += "    setTimeout(function() { window.opener.close(); }, 1000);";
        // script += "}";
        // script += "window.open('" + suiteletUrl + "', '_self');";
        // script += "</script>";

        context.response.write(script);
    }


    function getCrediCardInfo(customerIntId) {
        try {

            const customerSearch = search.create({
                type: 'customer',
                filters: ['internalid', 'anyof', customerIntId],
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
