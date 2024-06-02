/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(ui) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            try{
                log.debug("******Final Page*****")
                var form = ui.createForm({ title: 'Payment Success' });

                // Display a success message if 'respMsg' is 'success'
               
    
                context.response.writePage(form);
            }catch(e){
                log.debug("error", e)
                }
            }
            // Retrieve the 'respMsg' parameter from the request
         //   var respMsg = context.request.parameters.respMsg;

            
        
    }

    return {
        onRequest: onRequest
    };
});
