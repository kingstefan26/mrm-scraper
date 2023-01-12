const log = e => console.log(`scrape.js: ${e}`);

function scrape() {
    let recursionprevent;
    // scroll to boottom programitycly
    log("scraping")
    const scrollInterval = setInterval(async () => {
        if ((document.documentElement.scrollTop + window.innerHeight) !== document.documentElement.scrollHeight) {
            document.documentElement.scrollTop += window.innerHeight;
        } else {
            log('scrolled to bottom')
            clearInterval(scrollInterval)
            await finishedcallback()
        }
    }, 200);


    async function finishedcallback() {
        // get all the image elelemts
        log('getting images')
        const aaa = Array.from(document.getElementsByClassName('entry-content')[0].childNodes).map(e => e.firstChild);

        const a = aaa.filter(e => e != null || e != undefined);

        log(`got ${a.length} images`)


        const images = []

        for (let img of a) {
            let object = {
                src: img.src,
                height: img.height,
                width: img.width
            }
            images.push(object)
        }


        const entrytitle = document.getElementsByClassName('entry-title')[0].innerText;

        const metas = Array.from(document.getElementsByClassName('entry-meta')).map(e => e.innerHTML).reduce((partialSum, a) => partialSum + a, '');

        const nextpages = [...new Set(Array.from(document.querySelectorAll('.post-page-numbers:not(.current)')).map(a => a.href))];

        const currentpage = getpagefromurl(window.location.href);


        console.log(currentpage)

        const entry = {
            pages: nextpages,
            currentpage: currentpage,
            title: entrytitle,
            meta: metas,
            images: images
        };

        log(`got entry ${entry}`)


        // TODO: rework this, its supposed to check if there are bad images and then re scroll
        // let repetflag;
        // for (const image of entry.images) {
        //     console.log(image)
        //     if (image.src && image.src.includes('data:image/svg+xml,')) {
        //
        //         repetflag = true;
        //     }
        // }
        //
        // if (repetflag) {
        //     recursionprevent++;
        //     if(recursionprevent > 5){
        //         console.log('recursionprevent')
        //         alert("reached invinite loop")
        //         return;
        //     }
        //     let scrollInterval = setInterval(async () => {
        //         if ((document.documentElement.scrollTop + window.innerHeight) !== document.documentElement.scrollHeight) {
        //             document.documentElement.scrollTop += window.innerHeight;
        //         } else {
        //             clearInterval(scrollInterval)
        //             await finishedcallback()
        //         }
        //     }, 200);
        //     return;
        // }


        // await navigator.clipboard.writeText(JSON.stringify(entry))
        console.log(entry)
        window.scroll(0, 0)

        log('sending entry to backgroudjs')
        let myPort = browser.runtime.connect({name: "port-from-cs"});
        myPort.postMessage({info: "donwlaod", entry})

    }


    function getpagefromurl(url) {


        url = url.replace(/\/$/, "");

        const n = url.lastIndexOf('/');
        const a = url.substring(n + 1);
        parseInt(a);
        if (!a) {
            return '1';
        } else {
            return a
        }
    }

}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    scrape();
});


// (function() {
//     if (window.hasRun) {
//         return;
//     }
//     window.hasRun = true;
//
//
// })();


// let myPort = browser.runtime.connect({name:"port-from-cs"});
// // myPort.postMessage({greeting: "hello from content script"});
//
// myPort.onMessage.addListener(function(m) {
//     console.log("Im content script, received message from background script: " + m.greeting);
//
//     if(m.greeting === 'scrape'){
//         scrape();
//     }
// });
//
// document.body.addEventListener("click", function() {
//     myPort.postMessage({greeting: "they clicked the page!"});
// });