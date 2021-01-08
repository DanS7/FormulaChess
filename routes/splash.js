//After document is loaded, get playBtn and add event listener which redirects on click to index.html
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playBtn').addEventListener('click', function () {
        location.href = 'index.html';
    })
});
