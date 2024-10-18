const SKIN_NAMES = [ "board", "wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp"];

//"theme-background",

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


window.addEventListener("load", function () {

    applySkin();

    observeBoardDiv();

    // Function to observe the DOM for the addition of the 'board' div
    function observeBoardDiv() {
        const observer = new MutationObserver(mutations => {
            applySkin();
        });
    
        // Start observing the document body for added child nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
  
    function applySkin()
    {
        SKIN_NAMES.forEach(skin => {
            getStoredFileURL(skin).then((url) => {
                if (url)
                {
                    let pieceDivs = document.querySelectorAll(`.${skin}`);
                    //console.log("Running loop");
                    pieceDivs.forEach((pieceDiv) => {
                        pieceDiv.style.backgroundImage = `url('${url}')`;
                        pieceDiv.style.backgroundSize = 'contain'; // Adjust for better fit
                        pieceDiv.style.backgroundRepeat = 'no-repeat';
                        pieceDiv.style.backgroundPosition = 'center';
            
                        //console.log("applied style");
                    });
                }
            });

        });
    }
});

