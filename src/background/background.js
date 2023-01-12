import '../lib/jszip.js';


const log = e => console.log(`background.js: ${e}`);

let portToPopup;
const links = [];

function updatepopup(portToPopup) {
    if (!portToPopup) return;
    portToPopup.postMessage({
        subject: "update_links",
        entries: links
    });
    console.log('updated popup with')
    console.log(links)
}

browser.runtime.onConnect.addListener(p => {
    portToPopup = p;
    portToPopup.postMessage({greeting: "hi there content script!"});

    if(links.length > 0){
        updatepopup(portToPopup);
    }

    portToPopup.onMessage.addListener(async (m) => {
        console.log("In background script, received message from content script")
        if (m.info === "donwlaod") {

            log('starting image download')

            for (const img of m.entry.images) {
                await fetch(img.src)
                    .then(res => res.blob())
                    .catch(err => {
                        console.log(err);
                    })
                    .then(down => {
                        if (down !== undefined) {
                            log(`downloaded blob ${img.src}`)
                            img.blob = down
                        }
                    });
            }


            console.log(m)

            const zip = new JSZip();

            for (const imgobj of m.entry.images) {
                const index = m.entry.images.indexOf(imgobj);
                // if (!imgobj) continue;

                switch (imgobj.blob.type) {
                    case 'image/jpeg':
                        zip.file(`${index}.jpg`, imgobj.blob);
                        break;
                    case 'image/png':
                        zip.file(`${index}.png`, imgobj.blob);
                        break;
                    case 'image/gif':
                        zip.file(`${index}.gif`, imgobj.blob);
                    default:
                        zip.file(`${index}`, imgobj.blob);
                }

                console.log(`added ${index} to zip`)
            }


            const additionalmeta = m.entry

            additionalmeta.images = additionalmeta.images.map(imgobj => {
                delete imgobj.blob;
                return imgobj;
            })

            zip.file('meta.json', JSON.stringify(additionalmeta));


            console.log(zip.files)
            await zip.generateAsync({type: "blob"}).then(blob => {
                // browser.downloads.download(
                //     {url: imageUrl, filename: `aaa.zip`, saveAs: false}
                // )


                // const tag = document.createElement('a');
                // tag.href = imageUrl;
                // tag.download = `${m.entry.title}.zip`;
                // document.body.appendChild(tag);
                // tag.click();

                // document.body.removeChild(tag);

                links.push({blob: blob, filename: `${m.entry.title}.zip`})

                updatepopup(portToPopup);


            })

        }


    });
    portToPopup.onDisconnect.addListener(() => {
        portToPopup = null
    });
});

