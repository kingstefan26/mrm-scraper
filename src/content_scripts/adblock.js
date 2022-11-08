document.addEventListener("DOMContentLoaded", e => {
    let centers = document.querySelectorAll("center")
    if(centers.length === 2){
        centers.forEach(e => {
            e.remove();
        })
    }
    // let toprightad = document.querySelectorAll(".exo-ipp-container");
    // if(toprightad[0]){
    //     toprightad[0].parentElement.parentElement.remove();
    // }
})