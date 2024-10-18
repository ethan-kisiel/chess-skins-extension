import { readFileAsBase64, storeFileAsBase64, getStoredFileURL } from "/scripts/storageUtil.js"



document.querySelectorAll('input[type="file"]').forEach(input => {

    getStoredFileURL(input.id).then(url => {
        if (url) {
            console.log(url);
            const previewId = `${input.id}Preview`; // Get corresponding preview ID
            
            const preview = document.getElementById(previewId);
        
            preview.style.backgroundImage = `url(${url})`;
            preview.style.backgroundSize = 'contain'; // Adjust for better fit
            preview.style.backgroundRepeat = 'no-repeat';
            preview.style.backgroundPosition = 'center';

        }
    });

    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const previewId = `${event.target.id}Preview`; // Get corresponding preview ID

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById(previewId);

                preview.style.backgroundImage = `url(${e.target.result})`;
                preview.style.backgroundSize = 'contain'; // Adjust for better fit
                preview.style.backgroundRepeat = 'no-repeat';
                preview.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file); // Read the file as a data URL'

            storeFileAsBase64(event.target.id, file)
        }
    });
});

document.querySelectorAll("button[class='clearButton'").forEach(button => {
    const fieldId = button.getAttribute("data-target");

    button.addEventListener('click', function(event) {

        const previewId = `${fieldId}Preview`;
        const preview = document.getElementById(previewId);
        
        preview.style.backgroundImage = "";

        storeFileAsBase64(fieldId, null);
    
    });
});