/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
/*********
 * Script to send payment file to SFTP server
 */

define(['N/search','N/runtime','N/record', "N/sftp", "N/file"],
    /**
 * @param{email} email
 */
    (search,runtime,record,sftp, file) => {

      

        const afterSubmit = (scriptContext) => {
            try {

               
               if (scriptContext.type == "create" || scriptContext.type == "xedit" ) {

                var pfaRec= scriptContext.newRecord

                var fileRef= pfaRec.getValue({
                    fieldId:'custrecord_2663_file_ref'
                });
                log.debug("fileRef", fileRef);

                if(fileRef){
             let guidPassword ="247b617bde9340d6a3a34cd8ce742b40"         // change
             let hostKey = "AAAAB3NzaC1yc2EAAAADAQABAAABAQDCMe/Cuh0jyJoz+Ejww74aaK6WnmN9qd2gl+nYS/H/2f71VpA/LsPYBu9DUqkhALmzeAPp0Atp9YfkulgkX49IwprnUsVJ+Sou/Wy0Aay/qAHphYkFiCubezXWK/fQ9YIMAG1eN7puX7o4+sVPmfikZNiaCtkBRCWQbPa5IhyVrmg7pVEzDV83HF90XEvB58Adh/ZYIMsYnDxsSH2BgLfvjNA0ClGP+mUrMopVOwzHp11VChaZlUDMdFbBdP0fD5984ADAeTevFO7M2M3pypoO/+mro+pWRD33bW04uNopJRHSEnMhxdKhKxDTq0jvmI9odQeVDGlNi0dMXANsfYCF"
             let connection = sftp.createConnection({
                 username: 'NOWAKDEN@ftpuser1',
                 passwordGuid: guidPassword,
                 url: 'hancockwhitneycert.olbanking.com',
                 hostKey: hostKey,
                 directory: 'ACH',
                 port: 22
             });
             log.debug("connection", connection)

             try {
                let loadedFile = file.load({
                    id: fileRef
                });
            
                var fileName = loadedFile.name;
                let conObj = connection.upload({
                    filename: fileName,
                    file: loadedFile,
                    replaceExisting: true
                });
            
                loadedFile.folder = 1197863;
                loadedFile.save();
            } catch (e) {
                log.error("Error occurred:", e);
            }
        }
    }
            }catch (e) {
                log.error("error@afterSubmit",e);
            }

                }

        return {afterSubmit}

    });

