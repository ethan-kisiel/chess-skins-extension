// Handle imports and exports of config files
export { getConfigJSON, setConfigJSON };
import { getStoredFileURL, storeFileAsBase64 } from "/scripts/storageUtil.js";
import { SKIN_NAMES } from "/options.js";



async function getConfigJSON() {
    let data = "{";

    for (let i = 0; i < SKIN_NAMES.length; i++) {
        const name = SKIN_NAMES[i];
        const storedFile = await getStoredFileURL(name); // Wait for the promise to resolve
        const cleanedStoredFile = await removeDataLine(storedFile);
        console.log(cleanedStoredFile);

        data += `\n\t"${name}": "${cleanedStoredFile}"`;
        if (i < SKIN_NAMES.length - 1) {
            data += ",";
        }
    }

    data += "\n}";
    return data; // Return the data after all promises resolve
}


function setConfigJSON(jsonFile) {
    return new Promise((resolve, reject) => {
        if (jsonFile) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const jsonObject = JSON.parse(e.target.result);
                    let promises = [];

                    SKIN_NAMES.forEach(name => {
                        const data = insertDataLine(jsonObject[name]);

                        const promise = new Promise((resolve) => {
                            chrome.storage.local.set({ [name]: data }, () => {
                                console.log("SET STORAGE ITEM for", name);
                                resolve();
                            });
                        });

                        promises.push(promise);
                    });

                    // Wait for all the storage updates to complete
                    Promise.all(promises).then(() => {
                        console.log('All items have been set in storage');
                        resolve(); // Resolve the main Promise when all updates are done
                    });

                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    reject(error);
                }
            };

            reader.readAsText(jsonFile);
        } else {
            console.error('No file selected.');
            reject('No file selected');
        }
    });
}


function removeDataLine(input) {
    return input.replace("data:image", "!DATA_IMAGE!");
}

function insertDataLine(input) {
    return input.replace("!DATA_IMAGE!", "data:image")
}