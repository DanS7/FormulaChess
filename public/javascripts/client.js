document.addEventListener('DOMContentLoaded', function () {
    doc = document.getElementsByTagName("body")[0];
    windowWidth = doc.clientWidth;
    windowHeight = doc.clientHeight;
    checkResolution();
    console.log(windowWidth + " " + windowHeight);
    window.addEventListener('resize', function () {
        windowWidth = doc.clientWidth;
        windowHeight = doc.clientHeight;
        checkResolution()
    });
        });
let windowWidth;
let windowHeight;
let doc;

function checkResolution() {
    if((windowHeight < 768 || windowWidth < 1366) /*||
        (parseFloat(windowWidth) / windowHeight < 1.5) ||
        (parseFloat(windowWidth) / windowHeight > 2.1)*/
        ) {
        alert("Your screen resolution is not yet supported!");
    }
}