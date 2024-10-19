export { SKIN_NAMES }
import { readFileAsBase64, storeFileAsBase64, getStoredFileURL } from "/scripts/storageUtil.js";
import { getConfigJSON, setConfigJSON } from "/scripts/configUtil.js";
const SKIN_NAMES = [ "board", "wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp"];


document.getElementById("downloadConfig").addEventListener("click", event => {
    downloadConfig();
});

document.getElementById("loadConfig").addEventListener("change", event => {
    loadConfig(event).then(() => {

        console.log("SETTING PREVIEW");
        SKIN_NAMES.forEach((name) => {
            getStoredFileURL(name).then(url => {
                if (url) {

                    //console.log(url);
                    const previewId = `${name}Preview`; // Get corresponding preview ID
                    
                    const preview = document.getElementById(previewId);
                
                    preview.style.backgroundImage = `url(${url})`;
                    preview.style.backgroundSize = 'contain'; // Adjust for better fit
                    preview.style.backgroundRepeat = 'no-repeat';
                    preview.style.backgroundPosition = 'center';
                }
            });
        });
    });
});

document.querySelectorAll('input[type="file"][accept="image/*"]').forEach(input => {

    getStoredFileURL(input.id).then(url => {
        if (url) {
            //  console.log(url);
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


function refreshPreviews()
{

}


async function downloadConfig() {

    const configJSON = await getConfigJSON();
    //console.log(configJSON);


    const blob = new Blob([configJSON], { type: "application/json" });
    //console.log(blob);

    const fileURL = URL.createObjectURL(blob);


    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "chess-skin.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(fileURL);
}


function loadConfig(event) {
    const configFile = event.target.files[0];

    return new Promise((resolve, reject) => {
        setConfigJSON(configFile).then(() => {
            resolve();
        });
    });
}