# Offline_Collector
Off-line application to collect data from friends and family.  To be used on tablet with no consistent Internet connection.  Files generated will be synced to backend processes through other programs/means.  Eventually, this will collect enough information to fulfill GRAMPS requirements.
Project Goal
Create Off-line application to collect data from friends and family.  To be used on tablet with no consistent Internet connection.  Files generated will be synced to backend processes through other programs/means.  Eventually, this will collect enough information to fulfill GRAMPS requirements.

Requirements:
Application that will read/write from a file (CSV?) or files (XML, JSON?)

First Page will let you choose a person from list prepopulated from the files or create a new person if they are not in the file already.  

Application can take a picture using the front camera (by default) and save the photo to the device alongside the file using the the 5 name fields and time stamp for the filename.  Such
first.middle.last.suffix.preferred.jpg

The file will be hardcoded into program.  It will have a record ID for existing people.  The fields are as follows (although more may be added):

Contact Fields:
First name
Middle name
Last name
Suffix
Preferred name
Email
Address 1
Address 2
City
State
Zip Code

Genealogy Fields:
Birth Date
Death Date
Spouse (choices come from file) Stored using 5 names: first.middle.last.suffix.preferred
Anniversary date
Mother (choices come from file) Stored using 5 names: first.middle.last.suffix.preferred
Father (choices come from file) Stored using 5 names: first.middle.last.suffix.preferred
