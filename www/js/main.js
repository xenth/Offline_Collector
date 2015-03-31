$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

var Person = {
    // Keep these in sync with the TSV, but order doesn't matter.
    first: '',
    middle: '',
    last: '',
    suffix: '',
    used_name: '',
    maiden: '',
    email: '',
    add1: '',
    add2: '',
    city: '',
    state: '',
    zip: '',
    byear: '',
    bmonth: '',
    bday: '',
    btime: '',
    blocation: '',
    dyear: '',
    dmonth: '',
    dday: '',
    dtime: '',
    dlocation: '',
    spouse: '',
    ayear: '',
    amonth: '',
    aday: '',
    atime: '',
    father: '',
    mother: '',
    gender: '',
    notes: '',

    displayName: function() {
        var name = this.first + " ";
        if (this.middle) {
            name += this.middle + " ";
        }
        name += this.last;
        if (this.suffix && this.suffix != "none") {
            name += ", " + this.suffix;
        }
        if (this.used_name && this.used_name != this.first) {
            name += " (" + this.used_name + ")";
        }
        return name;
    },

    id: function() {
        return this.first.trim().toLowerCase() + "." +
               this.middle.trim().toLowerCase() + "." +
               this.last.trim().toLowerCase() + "." +
               this.suffix.trim().toLowerCase() + "." +
               this.used_name.trim().toLowerCase();
    }
};

// Global list of people
var peopleDB = [];
var currentPersonId = '';
var dbFileName = 'OfflineCollector.tsv';

// Pages in the editing flow
var pageOrder = [ "#welcome", "#contact", "#mailing", "#genealogy1", "#genealogy2" ];
var currentPage = 0;

function onDeviceReady()
{
    // Now safe to use device APIs
    document.addEventListener("backbutton", onBackKeyDown, false);

    loadPeopleDb();
}

function loadPeopleDb()
{
    console.log("Resolving File URL");
    var dataFile = cordova.file.externalDataDirectory + '/' + dbFileName;
    window.resolveLocalFileSystemURL(dataFile, gotFileEntry, fail);
}

function onBackKeyDown()
{
    prevPage();
}

function gotFileEntry(fileEntry)
{
    console.log("Requesting File from FileEntry");
    fileEntry.file(parsePeopleFile, fail);
}

function parsePeopleFile(file)
{
    console.log("Reading file");
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Parsing CSV into PeopleDB");
        parsePeopleDbFromCSV(evt.target.result);
    };
    reader.readAsText(file);
}

function fail(error)
{
    console.log("Failed: " + error.code);
}

function parsePeopleDbFromCSV(csv)
{
    var headers = [];
    peopleDB = []
    lines = csv.split("\n");
    for (var i=0; i<lines.length; i++) {
        var line = lines[i];
        if (!line) {
            continue;
        }
        var fields = line.split("\t");
        if (headers.length == 0) {
            for (var j=0; j<fields.length; j++) {
                headers[j] = fields[j];
            }
            continue;
        }
        var person = Object.create(Person);
        for (var j=0; j<fields.length; j++) {
            person[headers[j]] = fields[j];
        }
        peopleDB[person.id()] = person;
        console.log("Loaded person " + person.displayName());
    }

    fillPeopleList("#PeopleList", true, '');
}

function fillPeopleList(list_id, allow_new, gender)
{
    var people_list = $(list_id);
    people_list.find('option').remove();
    people_list.append($("<option />").val("").text("Please Make Selection from DB"));
    for (var key in peopleDB) {
        if (!peopleDB.hasOwnProperty(key)) {
            continue;
        }
        var person = peopleDB[key];
        if (!gender || !person.gender || person.gender == gender) {
            people_list.append($("<option />").val(person.id()).text(person.displayName()));
        }
    }
    if (allow_new) {
        people_list.append($("<option />").val("New Person").text("New Person"));
    }
}

function gotoPage(index)
{
    if (index < 0 || index > pageOrder.length-1) {
        console.log("Invalid page index " + index + " requested.");
        return;
    }

    $(pageOrder[currentPage]).hide();
    currentPage = index;
    $(pageOrder[currentPage]).show();
    console.log("New page is " + pageOrder[currentPage]);
}

function nextPage()
{
    if (currentPage >= pageOrder.length-1) {
        console.log("Can't go to next page.  Already on " + currentPage);
        return;
    }
    gotoPage(currentPage + 1);
}

function prevPage()
{
    if (currentPage <= 0 ) {
        console.log("Can't go to previous page.  Already on " + currentPage);
        return;
    }
    gotoPage(currentPage - 1);
}

function startPerson()
{
    var selected = $("#PeopleList").val();
    console.log("Starting entry for person '" + selected + "'");
    if (!selected) {
        alert("Please make a selection from the dropdown.");
        return;
    }
    fillPeopleList("#person_father", false, 'M');
    fillPeopleList("#person_mother", false, 'F');
    fillPeopleList("#person_spouse", false, '');
    $("#photo").attr('src', '');
    var person = null;
    if (selected != "New Person") {
        person = peopleDB[selected];
        if (!person) {
            console.log("Unable to find person in personDB for " + selected);
            alert("Something went wrong.  Please create a new person or restart the app.");
            return;
        }
        loadPersonPhoto(person);
    } else {
        console.log("Creating a new person");
        person = Object.create(Person);
    }

    currentPersonId = person.id();
    for (var key in person) {
        if (typeof person[key] == "function") {
            continue;
        }
        id = "#person_" + key;
        console.log("Setting " + id + "=" + person[key] + " for " + key);
        $(id).val(person[key]);
    }
    nextPage();
}

function savePerson()
{
    var person = gatherPersonFields();
    if (currentPersonId && currentPersonId != person.id()) {
        console.log("Deleting entry for " + currentPersonId);
        delete peopleDB[currentPersonId];
    }
    peopleDB[person.id()] = person;
    console.log("Saved entry for " + person.id());
    currentPersonId = '';
    saveDbFile();
    fillPeopleList("#PeopleList", true, '');
    gotoPage(0);
    $("#thanks").show();
}

function gatherPersonFields()
{
    var person = Object.create(Person);
    for (var key in person) {
        if (typeof person[key] == "function") {
            continue;
        }
        id = "#person_" + key;
        person[key] = $(id).val();
        console.log("Setting " + key + "=" + person[key] + " from " + id);
    }
    return person;
}

function saveDbFile()
{
    var csv = createCsvFromDb();
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
        console.log("Got DirEntry: ", dirEntry);
        dirEntry.getFile(dbFileName, {create:true}, function(fileEntry) {
            console.log("Got FileEntry: ", fileEntry);
            fileEntry.createWriter(function(writer) {
                writer.write(csv);
            });
        });
    });
}

function createCsvFromDb()
{
    // Reuse the same headers repeatedly to ensure we keep the
    // same output for each line.
    var person = Object.create(Person);
    var headers = [];
    for (var key in person) {
        if (typeof person[key] == "function") {
            continue;
        }
        headers.push(key);
    }

    var output = headers.join("\t") + "\n";
    for (var key in peopleDB) {
        person = peopleDB[key];
        var fields = [];
        for (var i=0; i<headers.length; i++) {
            fields.push(person[headers[i]]);
        }
        output += fields.join("\t") + "\n";
    }

    return output;
}

function takePhoto()
{
    var person = gatherPersonFields();
    navigator.camera.getPicture(function(imageData) {
        console.log("Got photo data of size " + imageData.length);
        $("#photo").attr("src", "data:image/jpeg;base64," + imageData);
        savePhoto(imageData, person.id());
    },
    function(message) {
        console.log("Unable to take photo: " + message);
        alert("Unable to get photo: " + message);
    }, {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function savePhoto(imageData, filename)
{
    console.log("Starting save of " + imageData.length + " bytes of image data to " + filename);
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
        console.log("Got DirEntry: ", dirEntry);
        dirEntry.getFile(filename + '.jpg', {create:true}, function(fileEntry) {
            console.log("Got FileEntry: ", fileEntry);
            fileEntry.createWriter(function(writer) {
                var blob = base64toBlob(imageData, 'image/jpeg');
                console.log("Writing " + blob.size + " bytes to file.");
                writer.write(blob);
            });
        });
    });
}

function base64toBlob(base64Data, contentType) {
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytes = new Array[byteCharacters.length];
    for (var i=0; i<byteCharacters.length; i++) {
        bytes[i] = byteCharacters[i].charCodeAt(0);
    }
    return new Blob([bytes], { type: contentType });
}

function loadPersonPhoto(person)
{
    var imgPath = cordova.file.externalDataDirectory + '/' + person.id() + '.jpg';
    $("#photo").attr('src', imgPath);

    window.resolveLocalFileSystemURL(imgPath, function(fileEntry) {
        console.log("Got FileEntry: ", fileEntry);
        fileEntry.file(function(file) {
        });
    });
}
