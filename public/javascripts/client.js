document.addEventListener('DOMContentLoaded', function () {
    doc = document.getElementsByTagName("body")[0];
    windowWidth = doc.clientWidth;
    windowHeight = doc.clientHeight;
    checkResolution();
    console.log(windowWidth + " " + windowHeight);
                                                         });

let windowWidth;
let windowHeight;
let doc;

function checkResolution() {
    if(windowHeight < 768 || windowWidth < 1366) {
        alert("Your screen resolution is not yet supported!")
        doc.clientHeight = 768;
        doc.clientWidth = 1366;
    }
}