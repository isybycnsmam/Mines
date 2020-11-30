var minesNumber = document.getElementById("minesNumber");
var areaSizeX = document.getElementById("areaSizeX");
var areaSizeY = document.getElementById("areaSizeY");
var area = document.getElementById("area");
var fields = [];
var size_x, size_y, mines;
var enabled = false, contextMenu = false;

function updateLimits() {
    let maxMines = minesNumber.max = areaSizeX.value * areaSizeY.value - 1;
    if (minesNumber.value > maxMines) {
        minesNumber.value = maxMines;
    }
}

function startGame() {
    document.getElementById("controlls").style.display = "none";
    size_x = parseInt(areaSizeX.value);
    size_y = parseInt(areaSizeY.value);
    mines = parseInt(minesNumber.value);

    area.style.height = size_y * 50;
    area.style.width = size_x * 50;
    let fieldsCount = size_x * size_y;

    let emptyFieldsIndexes = [...Array(fieldsCount).keys()];
    for (let i = 0; i < mines; i++) {
        let pick = Math.floor(Math.random() * emptyFieldsIndexes.length);
        emptyFieldsIndexes.splice(pick, 1);
    }

    fields = [];
    area.innerHTML = "";
    for (let y = 0; y < size_y; y++) {
        for (let x = 0; x < size_x; x++) {
            let index = y * size_x + x;

            let field = document.createElement("button");
            field.classList = "field uncovered";
            field.onclick = uncover;
            field.oncontextmenu = flag;
            field.dataset.index = index;
            field.dataset.x = x;
            field.dataset.y = y;
            field.dataset.mine = !emptyFieldsIndexes.includes(index);

            fields.push(field);
            area.append(field);
        }
    }

    enabled = true;
    area.style.display = "block";
}

function getNeibours(current_x, current_y) {
    let min_y = current_y - 1,
        max_y = current_y + 1,
        min_x = current_x - 1,
        max_x = current_x + 1,
        result = [];

    for (let y = min_y; y <= max_y; y++)
        for (let x = min_x; x <= max_x; x++)
            if (x >= size_x || x < 0 || y >= size_y || y < 0)
                continue;
            else if (x === current_x && y === current_y)
                continue;
            else
                result.push(y * size_x + x);

    return result;
}

function flag(event) {
    if (enabled)
        event.target.classList.toggle("flag");
    return contextMenu;
}

function uncover(event) {
    let target = event.target;
    if (!enabled || target.disable || target.classList.contains("flag"))
        return;

    if (target.dataset.mine == "true") {
        fields[target.dataset.index].classList = "field mine";
        lose();
    }
    else {
        let neibours = getNeibours(parseInt(target.dataset.x), parseInt(target.dataset.y))
            .map(i => fields[i]);
        let minesNear = neibours
            .filter(e => e.dataset.mine == "true")
            .length;

        target.classList = "field empty";
        target.disable = true;
        if (minesNear > 0)
            target.innerHTML = minesNear;
        else
            neibours.forEach(e => uncover({ target: e, rep: true }));
    }

    if (event.rep == undefined) {
        if (fields.filter(e => e.disable).length + mines === fields.length) {
            win();
        }
    }
}

function win() {
    enabled = false;
    document.querySelector("body").style.backgroundColor = "green";
}

function lose() {
    enabled = false;
    document.querySelector("body").style.backgroundColor = "red";
}