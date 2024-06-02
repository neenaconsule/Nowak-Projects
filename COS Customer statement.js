/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/format'], 
function(ui, search, record, format) {
    function onRequest(context) {
        if (context.request.method === 'GET') {

            log.debug("context**", context.request)
var respMsg=context.request.parameters.respMsg

if(respMsg && respMsg=="success"){
    log.debug("SUCCESS CONFIRMED")
    var form = ui.createForm({ title: 'Payment Success' });

    form.addField({
        id: 'custpage_success_message',
        type: ui.FieldType.INLINEHTML,
        label: ' '
    }).defaultValue = '<h1>Payment Successful!</h1><p>Your payment has been processed successfully.</p>';

    context.response.writePage(form);
}
else{

            var customerId = 12516;
           
            // if (!customerId) {
            //     context.response.write('Customer ID is required.');
            //     return;
            // }

            // Create the form
            var form = ui.createForm({ title: 'Customer Statement' });
            form.clientScriptFileId = '1288982';
            // Add fields for account information
            var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            });

            form.addField({
                id: 'custpage_name',
                type: ui.FieldType.TEXT,
                label: 'Name'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.OUTSIDE
            }).updateBreakType({
                breakType : ui.FieldBreakType.STARTROW
            }).defaultValue = customerRecord.getValue('companyname');

            form.addField({
                id: 'custpage_billing_address',
                type: ui.FieldType.TEXT,
                label: 'Billing Address'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.OUTSIDE
            }).updateBreakType({
                breakType : ui.FieldBreakType.STARTROW
            }).defaultValue = customerRecord.getValue('billaddress');

            form.addField({
                id: 'custpage_email',
                type: ui.FieldType.TEXT,
                label: 'E-mail Address'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.OUTSIDE
            }).updateBreakType({
                breakType : ui.FieldBreakType.STARTROW
            }).defaultValue = customerRecord.getValue('email');
            
            form.addField({
                id: 'custpage_phone',
                type: ui.FieldType.TEXT,
                label: 'Phone'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.OUTSIDE
            }).updateBreakType({
                breakType : ui.FieldBreakType.STARTROW
            }).defaultValue = customerRecord.getValue('phone');

            form.addField({
                id: 'custpage_internalid',
                type: ui.FieldType.INTEGER,
                label: 'ID'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.OUTSIDE
            }).updateBreakType({
                breakType : ui.FieldBreakType.STARTROW
            }).defaultValue = customerId
            // form.addField({
            //     id: 'custpage_checkbox',
            //     type: ui.FieldType.CHECKBOX,
            //     label: 'Edit Card',
            //   //  container: 'paymentgroup'
            // }).defaultValue="F";

            form.addSubtab({
                id : 'subtabid',
                label : 'Open Transactions',
                
            });

            form.addField({
                id: 'custpage_account_balance',
                type: ui.FieldType.CURRENCY,
                label: 'Account Balance',
                container: 'subtabid'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = customerRecord.getValue('balance');
            var paySelect= form.addField({
                id: 'custpage_payselect',
                type: ui.FieldType.SELECT,
                label: 'Payment Options',
                container: 'subtabid'
            })
            paySelect.addSelectOption({
                value: 'payselectedinv',
                text: 'Pay Selected Invoices'
            });
            paySelect.addSelectOption({
                value: 'payselectfull',
                text: 'Pay Full Balance'
            });
            paySelect.addSelectOption({
                value: 'payselectnintyplus',
                text: 'Pay 91+ Day Balance'
            });
           

            // Add sublist for open transactions
            var sublist = form.addSublist({
                id: 'custpage_open_transactions',
                type: ui.SublistType.LIST,
                label: 'Open Transactions',
                tab: 'subtabid'
            })
            sublist.addField({
                id: 'custpage_intid',
                type: ui.FieldType.TEXT,
                label: 'Internal ID'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            });

            sublist.addField({
                id: 'custpage_document_number',
                type: ui.FieldType.TEXT,
                label: 'Document Number'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_po_number',
                type: ui.FieldType.TEXT,
                label: 'PO Number'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_transaction_type',
                type: ui.FieldType.TEXT,
                label: 'Transaction Type'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_document_date',
                type: ui.FieldType.DATE,
                label: 'Document Date'
            });

            sublist.addField({
                id: 'custpage_due_date',
                type: ui.FieldType.DATE,
                label: 'Due Date'
            });

            sublist.addField({
                id: 'custpage_document_amount',
                type: ui.FieldType.CURRENCY,
                label: 'Document Amount'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_current',
                type: ui.FieldType.CURRENCY,
                label: 'Current'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_select_to_pay',
                type: ui.FieldType.CHECKBOX,
                label: 'Select to Pay'
            });

            sublist.addField({
                id: 'custpage_payment_amount',
                type: ui.FieldType.CURRENCY,
                label: 'Payment Amount'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.ENTRY
            });

            // Add new fields for aging buckets
            sublist.addField({
                id: 'custpage_1_30_days',
                type: ui.FieldType.CURRENCY,
                label: '1-30 Days'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_31_60_days',
                type: ui.FieldType.CURRENCY,
                label: '31-60 Days'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_61_90_days',
                type: ui.FieldType.CURRENCY,
                label: '61-90 Days'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_90_plus_days',
                type: ui.FieldType.CURRENCY,
                label: '90+ Days'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            });

            // Retrieve and populate open transactions
            var transactions = getOpenTransactions(customerId);
            for (var i = 0; i < transactions.length; i++) {

                sublist.setSublistValue({
                    id: 'custpage_intid',
                    line: i,
                    value: transactions[i].internalIdTransaction
                });

                sublist.setSublistValue({
                    id: 'custpage_document_number',
                    line: i,
                    value: transactions[i].documentNumber
                });
                if(transactions[i].poNumber){
                    sublist.setSublistValue({
                        id: 'custpage_po_number',
                        line: i,
                        value: transactions[i].poNumber
                    });
                }
                
                sublist.setSublistValue({
                    id: 'custpage_transaction_type',
                    line: i,
                    value: transactions[i].transactionType
                });
                sublist.setSublistValue({
                    id: 'custpage_document_date',
                    line: i,
                    value: transactions[i].documentDate
                });
                if(transactions[i].dueDate){
                    sublist.setSublistValue({
                        id: 'custpage_due_date',
                        line: i,
                        value: transactions[i].dueDate
                    });
                }
             
                sublist.setSublistValue({
                    id: 'custpage_document_amount',
                    line: i,
                    value: transactions[i].documentAmount
                });
                if(transactions[i].current){
                sublist.setSublistValue({
                    id: 'custpage_current',
                    line: i,
                    value: transactions[i].current
                });
            }
                // Set aging bucket values
                if(transactions[i].oneToThirtyDays){
                    sublist.setSublistValue({
                        id: 'custpage_1_30_days',
                        line: i,
                        value: transactions[i].oneToThirtyDays
                    });
                }
                if(transactions[i].thirtyOneToSixtyDays){
                    sublist.setSublistValue({
                        id: 'custpage_31_60_days',
                        line: i,
                        value: transactions[i].thirtyOneToSixtyDays
                    });
                }
               if(transactions[i].sixtyOneToNinetyDays){
                sublist.setSublistValue({
                    id: 'custpage_61_90_days',
                    line: i,
                    value: transactions[i].sixtyOneToNinetyDays
                });
               }
               if(transactions[i].ninetyPlusDays){
                sublist.setSublistValue({
                    id: 'custpage_90_plus_days',
                    line: i,
                    value: transactions[i].ninetyPlusDays
                });
               }
                
                // Select to Pay checkbox and Payment Amount will be user input
            }


            var mainTab = form.addTab({
                id: 'custpage_maintab',
                label: 'Total Summary'
            });
            form.addField({
                id: 'custpage_total_invoice_payments',
                type: ui.FieldType.CURRENCY,
                label: 'Total Invoice Payments',
                container : 'custpage_maintab'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.ENTRY
            }).defaultValue = '0.00';

            

            form.addField({
                id: 'custpage_total_credit_memos_applied',
                type: ui.FieldType.CURRENCY,
                label: 'Total Credit Memos Applied',
                container : 'custpage_maintab'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.ENTRY
            }).defaultValue = '0.00';

            form.addField({
                id: 'custpage_total_payment_amount',
                type: ui.FieldType.CURRENCY,
                label: 'Total Payment Amount',
                container : 'custpage_maintab'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.ENTRY
            }).defaultValue = '0.00';

            // Add submit button
            form.addButton({
                id: 'custpage_payselectedinv',
                label: 'Pay Selected Invoices',
                functionName: 'openCreditCardPopup'
            });

      
    
            context.response.writePage(form);
        }
        } 
        // else {
        //     // Handle POST request (form submission)
        //     var request = context.request;
        //     var selectedPayments = [];
        //     var totalInvoicePayments = 0;
        //     var totalDebitMemoPayments = 0;
        //     var totalCreditMemosApplied = 0;
        //     var lineCount = request.getLineCount({ sublistId: 'custpage_open_transactions' });

        //     for (var i = 0; i < lineCount; i++) {
        //         var selectToPay = request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_select_to_pay', line: i });
        //         if (selectToPay === 'T') {
        //             var paymentAmount = parseFloat(request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_document_amount', line: i }));
        //             var transactionType = request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_transaction_type', line: i });
        //             selectedPayments.push({
        //                 documentNumber: request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_document_number', line: i }),
        //                 paymentAmount: paymentAmount
        //             });

        //             // Calculate totals
        //             if (transactionType === 'Invoice') {
        //                 totalInvoicePayments += paymentAmount;
        //             } else if (transactionType === 'Debit Memo') {
        //                 totalDebitMemoPayments += paymentAmount;
        //             } else if (transactionType === 'Credit Memo') {
        //                 totalCreditMemosApplied += paymentAmount;
        //             }
        //         }
        //     }

        //     var totalPaymentAmount = totalInvoicePayments + totalDebitMemoPayments - totalCreditMemosApplied;

        //     // Process selected payments (e.g., create a payment record)
        //     context.response.write('Selected payments processed: ' + JSON.stringify(selectedPayments));
        //     context.response.write('<br/>Total Invoice Payments: ' + totalInvoicePayments.toFixed(2));
        //     context.response.write('<br/>Total Debit Memo Payments: ' + totalDebitMemoPayments.toFixed(2));
        //     context.response.write('<br/>Total Credit Memos Applied: ' + totalCreditMemosApplied.toFixed(2));
        //     context.response.write('<br/>Total Payment Amount: ' + totalPaymentAmount.toFixed(2));
        // }
    }

    function getOpenTransactions(customerId) {
        var transactions = [];
        var today = new Date();
        var transactionSearch = search.create({
            type: search.Type.TRANSACTION,
            filters: [
                ['entity', 'anyof', customerId], // Filter by customer ID
                'AND',
                ['type', 'anyof', ['CustInvc', 'CustCred']], // Only retrieve invoices, credit memos, and payments
                'AND',
                ['status', 'anyof', 'CustCred:A', 'CustInvc:A'], // Exclude paid invoices and credit memos
                'AND',
                ['mainline', 'is', 'T']
            ],
            columns: [
                'internalid',
                'tranid',
                'otherrefnum',
                'type',
                'trandate',
                'duedate',
                'amount',
                'amountremaining'
            ]
        });
    
        var pagedData = transactionSearch.runPaged({ pageSize: 1000 });
        var resultCount = transactionSearch.runPaged().count;
        log.debug("result count", resultCount)
        pagedData.pageRanges.forEach(function(pageRange) {
            var currentPage = pagedData.fetch({ index: pageRange.index });
            currentPage.data.forEach(function(result) {
                var documentDate = result.getValue('trandate');
                var dueDate = result.getValue('duedate');
                var daysOverdue = calculateDaysOverdue(dueDate, today, documentDate);
                var amountRemaining = parseFloat(result.getValue('amountremaining'));

                transactions.push({
                    internalIdTransaction: result.getValue('internalid'),
                    documentNumber: result.getValue('tranid'),
                    poNumber: result.getValue('otherrefnum'),
                    transactionType: result.getText('type'),
                    documentDate: documentDate ? format.format({ value: documentDate, type: format.Type.DATE }) : '',
                    dueDate: dueDate ? format.format({ value: dueDate, type: format.Type.DATE }) : '',
                    documentAmount: parseFloat(result.getValue('amount')),
                    current: amountRemaining,
                    oneToThirtyDays: daysOverdue <= 30 ? parseFloat(result.getValue('amount')) : 0,
                    thirtyOneToSixtyDays: daysOverdue > 30 && daysOverdue <= 60 ?parseFloat(result.getValue('amount')) : 0,
                    sixtyOneToNinetyDays: daysOverdue > 60 && daysOverdue <= 90 ? parseFloat(result.getValue('amount')) : 0,
                    ninetyPlusDays: daysOverdue > 90 ? parseFloat(result.getValue('amount')) : 0

                    // oneToThirtyDays: daysOverdue <= 30 ? amountRemaining : 0,
                    // thirtyOneToSixtyDays: daysOverdue > 30 && daysOverdue <= 60 ? amountRemaining : 0,
                    // sixtyOneToNinetyDays: daysOverdue > 60 && daysOverdue <= 90 ? amountRemaining : 0,
                    // ninetyPlusDays: daysOverdue > 90 ? amountRemaining : 0
                });
            });
        });
    
        return transactions;
    }
    
    function calculateDaysOverdue(dueDate, today, tranDateValue) {
        try{

            if (dueDate){
                var due = new Date(dueDate);
                var timeDiff = today - due;
                //log.debug("timeDiff", timeDiff)
                var daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
                return daysDiff;
            }else{
                var due = new Date(tranDateValue);
                var timeDiff = today - due;
                //log.debug("timeDiff", timeDiff)
                var daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
                return daysDiff;
            }
            

        }catch(e){
            log.debug("error@calculateDaysOverdue", e)
        }
       
    }

    return {
        onRequest: onRequest
    };
});
