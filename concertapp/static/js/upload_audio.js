/**
 *  @file       upload_audio.js
 *  Includes all functionality associated with pages that are specific to the audio 
 *  upload page.
 *  This includes the audio upload page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeAudioUploadPage() {
    console.log('Audio upload page initialized.');
    
    /* Handle file upload box */
    uploadFileBehavior();
    
    
}

/**
 *  This is what happens when files are selected in the upload form.
 **/
function uploadFileBehavior() {
    /* When files are selected */
    $('#file_uploader').bind('change', function(){
        /* get the files that have been selected */
        var files = this.files;
        
        /* Document fragment that we will temporarily store the file rows in */
        var out = document.createDocumentFragment();
        /* This is the template for each file row */
        var fileRowTemplate = $('#selected_file');
        
        /* For each file chosen, create row in table */
        for(i = 0, il = files.length; i < il; i++) {
            var file = files[i];
            
            out.appendChild(fileRowTemplate.tmpl({
                filename: file.fileName,
                jsid: i, 
            }).get(0));
        }
        
        /* Clear table, and display the file rows */
        $('#files_table').html('').append(out);
    });
}