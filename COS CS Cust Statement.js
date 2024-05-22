/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function(currentRecord) {
    function fieldChanged(context) {
        var sublistName = context.sublistId;
        console.log("sublistName", sublistName)
        var fieldName = context.fieldId;
        console.log("fieldName", fieldName)
        var line = context.line;
        console.log("line", line)
        var rec = currentRecord.get();
        console.log("rec", rec)

        if (sublistName === 'custpage_open_transactions' && fieldName === 'custpage_select_to_pay') {
            console.log("FIELD CHANGED")

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
            console.log("documentAmount", documentAmount)

            rec.selectLine({
                sublistId: sublistName,
                line: line
            });

            rec.setCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'custpage_payment_amount',
                value: "78.00",
                
                ignoreFieldChange: true
                // forceSyncSourcing: true
            });

            rec.commitLine({
                sublistId: sublistName
            });
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
