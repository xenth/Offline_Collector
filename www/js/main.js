$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

var Person = {
    displayName: function() {
        var name = this.first + " ";
        if (this.middle) {
            name += this.middle_name + " ";
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

// Pages in the editing flow
var pageOrder = [ "#welcome", "#contact", "#mailing", "#genealogy1", "#genealogy2" ];
var currentPage = 0;

function onDeviceReady()
{
    // Now safe to use device APIs
    document.addEventListener("backbutton", onBackKeyDown, false);

    console.log("Resolving File URL");
    var dataFile = cordova.file.externalDataDirectory + '/OfflineCollector.tsv';
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

function nextPage()
{
    if (currentPage >= pageOrder.length-1) {
        console.log("Can't go to next page.  Already on " + currentPage);
        return;
    }
    $(pageOrder[currentPage]).hide();
    currentPage++;
    $(pageOrder[currentPage]).show();
    console.log("New page is " + pageOrder[currentPage]);
}

function prevPage()
{
    if (currentPage <= 0 ) {
        console.log("Can't go to previous page.  Already on " + currentPage);
        return;
    }
    $(pageOrder[currentPage]).hide();
    currentPage--;
    $(pageOrder[currentPage]).show();
    console.log("New page is " + pageOrder[currentPage]);
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
    if (selected != "New Person") {
        var person = peopleDB[selected];
        if (!person) {
            console.log("Unable to find person in personDB for " + selected);
            alert("Something went wrong.  Please create a new person or restart the app.");
            return;
        }
        for (var key in person) {
            if (!person.hasOwnProperty(key)) {
                continue;
            }
            id = "#person_" + key;
            console.log("Setting " + id + " for " + key);
            $(id).val(person[key]);
        }
    } else {
        console.log("Creating a new person");
    }
    nextPage();
}
