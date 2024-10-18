export { readFileAsBase64, storeFileAsBase64, getStoredFileURL };

// Convert image to base64 string
function readFileAsBase64(file, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

// Store the base64 string in Chrome storage
function storeFileAsBase64 (imageName, imageFile) {
    if (imageFile) {
        readFileAsBase64 (
            imageFile, (base64Data) => {
                let storeData = { [`${imageName}`]: base64Data };
                chrome.storage.local.set(storeData);
            }
        );
    }
    else {
        chrome.storage.local.set({ [`${imageName}`] : "" });
    }

}


function getStoredFileURL (imageName) {
    return new Promise((resolve, reject) => 
    {
        chrome.storage.local.get([imageName], (result) => {
            console.log(result);
            console.log(result[imageName]);
            try
            {
                resolve(result[imageName]);
            }
            catch (err)
            {
                reject(err);
            }
        });
    });
}