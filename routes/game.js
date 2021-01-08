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
        var row = createRow(i);
        container.appendChild(row);
    }
}

function createRow(rownum) {
    var row = document.createElement('div');
    row.id = 'row';
    for(let i = 0; i < 8; i++) {
        var testChild = document.createElement('div');
        if((rownum + i) % 2 === 0) {
            testChild.id = 'white';
        }
        else {
            testChild.id = 'black';
        }
        row.appendChild(testChild);
    }
    return row;
}

document.addEventListener('DOMContentLoaded', createBoard);