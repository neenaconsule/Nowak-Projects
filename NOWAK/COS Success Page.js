/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(ui) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = ui.createForm({ title: 'Payment Success' });

            form.addField({
                id: 'custpage_success_message',
                type: ui.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue = '<h1>Payment Successful!</h1><p>Your payment has been processed successfully.</p>';

            context.response.writePage(form);
        }
    }

    return {
        onRequest: onRequest
    };
});
