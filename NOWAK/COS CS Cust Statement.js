/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/url'], function(currentRecord, url) {
    function fieldChanged(context) {
        var bodyField = context.fieldId;
        var sublistName = context.sublistId;
        var fieldName = context.fieldId;
        var line = context.line;
        var rec = currentRecord.get();
        var customerIntId= rec.getValue({
            fieldId:'custpage_internalid'
        })
        console.log("customerIntId", customerIntId)
        if (sublistName === 'custpage_open_transactions' && fieldName === 'custpage_select_to_pay') {
            console.log("Enter1");
            var isSelected = rec.getSublistValue({
                sublistId: sublistName,
                fieldId: fieldName,
                line: line
            });

            var documentAmount = rec.getSublistValue({
                sublistId: sublistName,
                fieldId: 'custpage_document_amount',
                line: line
            });
            console.log("documentAmount", documentAmount);
            rec.selectLine({
                sublistId: sublistName,
                line: line
            });

            rec.setCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'custpage_payment_amount',
                value: isSelected ? documentAmount : 0,
            });

            rec.commitLine({
                sublistId: sublistName
            });

            // Calculate the new totals
            updateTotals(rec);
        }

        if (bodyField === 'custpage_payselect') {
            console.log("Enter 2");
            var selectedValue = rec.getValue({
                fieldId: 'custpage_payselect'
            });

            var lineCount = rec.getLineCount({
                sublistId: 'custpage_open_transactions'
            });

            for (var i = 0; i < lineCount; i++) {
                rec.selectLine({
                    sublistId: 'custpage_open_transactions',
                    line: i
                });

                if (selectedValue === 'payselectfull') {
                    console.log("Enter 3");
                    rec.setCurrentSublistValue({
                        sublistId: 'custpage_open_transactions',
                        fieldId: 'custpage_select_to_pay',
                        value: true,
                        ignoreFieldChange: true
                    });
                    var documentAmount = rec.getSublistValue({
                        sublistId: 'custpage_open_transactions',
                        fieldId: 'custpage_document_amount',
                        line: i
                    });
                    console.log("documentAmount *", documentAmount);
                    rec.setCurrentSublistValue({
                        sublistId: 'custpage_open_transactions',
                        fieldId: 'custpage_payment_amount',
                        value: documentAmount,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });
                } else if (selectedValue === 'payselectnintyplus') {
                    console.log("Enter 4");
                    var ninetyPlusDays = rec.getSublistValue({
                        sublistId: 'custpage_open_transactions',
                        fieldId: 'custpage_90_plus_days',
                        line: i
                    });
                    console.log("ninetyPlusDays value:", ninetyPlusDays);

                    if (ninetyPlusDays && parseFloat(ninetyPlusDays) > 0) {
                        console.log("Enter 5");
                        rec.setCurrentSublistValue({
                            sublistId: 'custpage_open_transactions',
                            fieldId: 'custpage_select_to_pay',
                            value: true,
                            ignoreFieldChange: true
                        });
                        var documentAmount = rec.getSublistValue({
                            sublistId: 'custpage_open_transactions',
                            fieldId: 'custpage_document_amount',
                            line: i
                        });
                        console.log("documentAmount **", documentAmount);
                        rec.setCurrentSublistValue({
                            sublistId: 'custpage_open_transactions',
                            fieldId: 'custpage_payment_amount',
                            value: documentAmount,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true
                        });
                    } else {
                        console.log("Enter 7");
                        rec.setCurrentSublistValue({
                            sublistId: 'custpage_open_transactions',
                            fieldId: 'custpage_select_to_pay',
                            value: false,
                            ignoreFieldChange: true
                        });
                    }
                }

                rec.commitLine({
                    sublistId: 'custpage_open_transactions'
                });
            }

            // Calculate the new totals after updating all lines
            updateTotals(rec);
        }
    }

    function updateTotals(rec) {
        var lineCount = rec.getLineCount({
            sublistId: 'custpage_open_transactions'
        });
        var totalInvoices = 0;
        var totalCreditMemos = 0;
        var totalPayment = 0;

        for (var i = 0; i < lineCount; i++) {
            var isSelected = rec.getSublistValue({
                sublistId: 'custpage_open_transactions',
                fieldId: 'custpage_select_to_pay',
                line: i
            });

            var transactionType = rec.getSublistValue({
                sublistId: 'custpage_open_transactions',
                fieldId: 'custpage_transaction_type',
                line: i
            });

            var documentAmount = rec.getSublistValue({
                sublistId: 'custpage_open_transactions',
                fieldId: 'custpage_document_amount',
                line: i
            });

            if (isSelected) {
                if (transactionType === 'Invoice') {
                    totalInvoices += parseFloat(documentAmount) || 0;
                } else if (transactionType === 'Credit Memo') {
                    totalCreditMemos += parseFloat(documentAmount) || 0;
                }

                totalPayment += parseFloat(documentAmount) || 0;
            }
        }

        rec.setValue({
            fieldId: 'custpage_total_invoice_payments',
            value: totalInvoices.toFixed(2)
        });

        rec.setValue({
            fieldId: 'custpage_total_credit_memos_applied',

            value: totalCreditMemos.toFixed(2)
        });

        rec.setValue({
            fieldId: 'custpage_total_payment_amount',
            value: totalPayment.toFixed(2)
        });
    }

    function openCreditCardPopup() {
        
        var rec = currentRecord.get();



// Array to hold the checked custpage_intid values
var checkedIntIds = [];

// Get the line count of the sublist
var lineCount = rec.getLineCount({
    sublistId: 'custpage_open_transactions'
});

// Loop through each line to collect checked custpage_intid values
for (var i = 0; i < lineCount; i++) {
    var isSelected = rec.getSublistValue({
        sublistId: 'custpage_open_transactions',
        fieldId: 'custpage_select_to_pay',
        line: i
    });

    if (isSelected) {
        var intId = rec.getSublistValue({
            sublistId: 'custpage_open_transactions',
            fieldId: 'custpage_intid',
            line: i
        });
        checkedIntIds.push(intId);
    }
}

// Join the checked intIds into a comma-separated string
var intIdsParam = checkedIntIds.join(',');


        // Retrieve the value of custpage_total_payment_amount
        var totalPaymentAmount = rec.getValue({
            fieldId: 'custpage_total_payment_amount'
        });
        var customerIntId= rec.getValue({
            fieldId:'custpage_internalid'
        })

       // var suiteletUrl = 'https://543925-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2221&deploy=1&compid=543925_SB1&ns-at=AAEJ7tMQWIbXLXSCiAhySaJnktVQZj-1SzzldJMhnhXiuNDVPk0';
var suiteletUrl = 'https://543925-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2221&deploy=1&compid=543925_SB1&ns-at=AAEJ7tMQWIbXLXSCiAhySaJnktVQZj-1SzzldJMhnhXiuNDVPk0';
    
suiteletUrl += '&totalPaymentAmount=' + totalPaymentAmount +'&customerIntId='+ customerIntId + '&checkedIntIds=' + intIdsParam;
        // Open the popup window
        window.open(suiteletUrl, 'Credit Card Payment', 'width=600,height=600');
    }

    return {
        fieldChanged: fieldChanged,
        openCreditCardPopup: openCreditCardPopup
    };
});
