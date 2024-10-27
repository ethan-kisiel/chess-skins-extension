function getStoredFileURL (imageName) {
    return new Promise((resolve, reject) => 
    {
        chrome.storage.local.get([imageName], (result) => {
            // console.log(result);
            // console.log(result[imageName]);
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

document.getElementById('editSkinButton').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
});


window.addEventListener("load", function () {
    const boardPreview = document.getElementById("boardPreview");
    
    getStoredFileURL("board").then((url)=>{
        boardPreview.style.backgroundImage = `url(${url})`;
    });

    boardPreview.style.display = "grid";
    boardPreview.style.gridTemplateRows = "repeat(8, 1fr)";
    boardPreview.style.gridTemplateColumns = "repeat(8, 1fr)";



    const boardSetup = [
        ['br', 'bn', 'bb', 'bk', 'bq', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        [], [], [], [], // Empty rows
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wk', 'wq', 'wb', 'wn', 'wr']
    ];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.style.width = `100%`;
            cell.style.height = `100%`;

            // Add piece if it exists in boardSetup
            const piece = boardSetup[row]?.[col];
            if (piece) {
                getStoredFileURL(piece).then((url)=>{
                    cell.style.backgroundImage = `url(${url})`;
                    cell.style.backgroundSize = "contain";
                    cell.style.backgroundRepeat = "no-repeat";
                    cell.style.backgroundPosition = "center";
                });
            }

            boardPreview.appendChild(cell);
        }
    }
});