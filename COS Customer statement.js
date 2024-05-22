/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/format'], 
function(ui, search, record, format) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var customerId = 1100;
           
            if (!customerId) {
                context.response.write('Customer ID is required.');
                return;
            }

            // Create the form
            var form = ui.createForm({ title: 'Customer Statement' });
            form.clientScriptFileId = '8052';
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
            }).defaultValue = customerRecord.getValue('companyname');

            form.addField({
                id: 'custpage_billing_address',
                type: ui.FieldType.TEXT,
                label: 'Billing Address'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = customerRecord.getValue('billaddress');

            form.addField({
                id: 'custpage_email',
                type: ui.FieldType.TEXT,
                label: 'E-mail Address'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = customerRecord.getValue('email');

            form.addField({
                id: 'custpage_phone',
                type: ui.FieldType.TEXT,
                label: 'Phone'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = customerRecord.getValue('phone');

            // form.addField({
            //     id: 'custpage_account_balance',
            //     type: ui.FieldType.CURRENCY,
            //     label: 'Account Balance'
            // }).updateDisplayType({
            //     displayType: ui.FieldDisplayType.INLINE
            // }).defaultValue = customerRecord.getValue('balance');

            // Add sublist for open transactions
            var sublist = form.addSublist({
                id: 'custpage_open_transactions',
                type: ui.SublistType.LIST,
                label: 'Open Transactions'
            });
            form.addField({
                id: 'custpage_account_balance',
                type: ui.FieldType.CURRENCY,
                label: 'Account Balance'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = customerRecord.getValue('balance');

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
                type: ui.FieldType.TEXT,
                label: 'Payment Amount'
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
            form.addField({
                id: 'custpage_total_invoice_payments',
                type: ui.FieldType.CURRENCY,
                label: 'Total Invoice Payments'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = '0.00';

            form.addField({
                id: 'custpage_total_debit_memo_payments',
                type: ui.FieldType.CURRENCY,
                label: 'Total Debit Memo Payments'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = '0.00';

            form.addField({
                id: 'custpage_total_credit_memos_applied',
                type: ui.FieldType.CURRENCY,
                label: 'Total Credit Memos Applied'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = '0.00';

            form.addField({
                id: 'custpage_total_payment_amount',
                type: ui.FieldType.CURRENCY,
                label: 'Total Payment Amount'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.INLINE
            }).defaultValue = '0.00';

            // Add submit button
            form.addSubmitButton({
                label: 'Pay Selected Invoices'
            });
            context.response.writePage(form);

        } else {
            // Handle POST request (form submission)
            var request = context.request;
            var selectedPayments = [];
            var totalInvoicePayments = 0;
            var totalDebitMemoPayments = 0;
            var totalCreditMemosApplied = 0;
            var lineCount = request.getLineCount({ sublistId: 'custpage_open_transactions' });

            for (var i = 0; i < lineCount; i++) {
                var selectToPay = request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_select_to_pay', line: i });
                if (selectToPay === 'T') {
                    var paymentAmount = parseFloat(request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_document_amount', line: i }));
                    var transactionType = request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_transaction_type', line: i });
                    selectedPayments.push({
                        documentNumber: request.getSublistValue({ sublistId: 'custpage_open_transactions', fieldId: 'custpage_document_number', line: i }),
                        paymentAmount: paymentAmount
                    });

                    // Calculate totals
                    if (transactionType === 'Invoice') {
                        totalInvoicePayments += paymentAmount;
                    } else if (transactionType === 'Debit Memo') {
                        totalDebitMemoPayments += paymentAmount;
                    } else if (transactionType === 'Credit Memo') {
                        totalCreditMemosApplied += paymentAmount;
                    }
                }
            }

            var totalPaymentAmount = totalInvoicePayments + totalDebitMemoPayments - totalCreditMemosApplied;

            // Process selected payments (e.g., create a payment record)
            context.response.write('Selected payments processed: ' + JSON.stringify(selectedPayments));
            context.response.write('<br/>Total Invoice Payments: ' + totalInvoicePayments.toFixed(2));
            context.response.write('<br/>Total Debit Memo Payments: ' + totalDebitMemoPayments.toFixed(2));
            context.response.write('<br/>Total Credit Memos Applied: ' + totalCreditMemosApplied.toFixed(2));
            context.response.write('<br/>Total Payment Amount: ' + totalPaymentAmount.toFixed(2));
        }
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
                var daysOverdue = calculateDaysOverdue(dueDate, today);
                var amountRemaining = parseFloat(result.getValue('amountremaining'));
                transactions.push({
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
    
    function calculateDaysOverdue(dueDate, today) {
        try{

            if (!dueDate) return 0;
            var due = new Date(dueDate);
            var timeDiff = today - due;
            //log.debug("timeDiff", timeDiff)
            var daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            return daysDiff;

        }catch(e){
            log.debug("error@calculateDaysOverdue", e)
        }
       
    }

    return {
        onRequest: onRequest
    };
});
