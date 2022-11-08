const bgScriptConnection = browser.runtime.connect({
    name: "popup"
});


bgScriptConnection.onMessage.addListener(msg => {
    console.log("Recieved message from backgroud");


    if(msg.subject === "update_links"){
        const linksdiv = document.getElementById('links');
        msg.entries.forEach(entry => {
            const href = URL.createObjectURL(entry.blob);
            const filename = entry.filename;

            const tag = document.createElement('a');
            tag.href = href;
            tag.download = tag.text = filename;
            linksdiv.appendChild(tag);


        })
    }
});




document.getElementById("btn").addEventListener("click", (e) => {
    console.log("popup.js: asking scrape.js to scrape")


    browser.tabs.query({active: true, currentWindow: true}, tabs => {
        browser.tabs.sendMessage(tabs[0].id,
            {
                m: tabs[0].id
            }, response => {})
    })

});





