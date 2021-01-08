//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        location.href = 'splash.html';
    })
});

//Creating the chess board
function createBoard() {
    var container = document.getElementById("board");

    for(let i = 0; i < 8; i++) {
        var row = createRow();
        container.appendChild(row);
    }
}

function createRow() {
    var row = document.createElement('div');
    row.id = 'row';
    for(let i = 0; i < 8; i++) {
        var testChild = document.createElement('div');
        testChild.id = 'square';
        testChild.innerHTML = i;
        row.appendChild(testChild);
    }
    return row;
}

document.addEventListener('DOMContentLoaded', createBoard);