// Development constants

DEBOUNCE_MILLIS = 1000;

// Actual code

var fakeSearch = "";
var search = "";
var searchChanged = new Date().getTime();
var searchTimeoutHandle = 0;
var allLoaded = false;

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

var player;

function getButtonElement(text, soundfile) {
    let elem = '<div class="button-container"><div class="button" onclick="playSound(\'' + soundfile + '\')"><div class="button-text">' + text + '</div></div></div>';
    return $(elem);
}

function createButtons() {
    return sounds.map(sound => {
        return {
            tags: [...sound.name.split(" "), ...sound.tags],
            file: sound.file,
            element: getButtonElement(sound.name, sound.file)
        };
    });
}

const buttons = createButtons();

function playSound(filename) {
    addButtons('');
    player.attr('src', filename);
    player.on('canplay', function() {
        player.get(0).play();
    });
}

function findButtons(searchTerm) {
    let terms = searchTerm.split(" ").map(term => term.toLowerCase());
    return buttons.filter(
        button => {
            return terms.filter(term => 
                button.tags.filter(tag => tag.toLowerCase().indexOf(term) !== -1).length > 0
            ).length === terms.length;
        }
    );
}

function addButtons(searchTerm) {
    let foundButtons = findButtons(searchTerm);
    $("#buttons").empty();
    foundButtons.forEach(button => {
        $("#buttons").append(button.element);
    });
}

function handleKey(event) {
    let key = event.originalEvent.key;
    let time = new Date().getTime();

    searchChanged = time;

    clearTimeout(searchTimeoutHandle);

    if (key.length === 1) { // Maybe not the best way to check for character but whatever
        search += key;
    } else if (key === "Backspace" && search !== "") {
        search = search.slice(0, -1);
    } else if (key === "Enter") {
        playSound(findButtons(fakeSearch).randomElement().file);
        search = "";
    }

    fakeSearch = search;

    addButtons(search);

    searchTimeoutHandle = setTimeout(function() {
        search = "";
        $("#searchText").text(search);
    }, DEBOUNCE_MILLIS);

    $("#searchText").text(search);
}

function loadAll() {
    if (allLoaded) {
        return;
    }
    allLoaded = true;
    let body = $("body");
    let soundfiles = sounds.map(sound => sound.file).forEach(file => {
        body.append("<audio src=\"" + file + "\">");
    });
}

$(document).ready(function() {
    addButtons('');
    player = $("audio");

    $(document).keydown(handleKey);
});

