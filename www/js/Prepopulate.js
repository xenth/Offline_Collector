function selectDropDown(fieldName, string, formName)  //Look through the Dropdown list, find a value, and set the DropDown on the form specified
/*Example: selectDropDown('CTRY', 'US', 'demographics');*/
{
  if (formName == null) {
    formName = "forms[0]";
  }
  fieldName = eval("document."+formName+"."+fieldName);

  var i;
  var len = fieldName.length;
  for(i=0; i < len; i++)
  {
    if(fieldName.options[i].value.toLowerCase() == string.toLowerCase())
    {
      fieldName.options[i].selected = true;
      break;
    }
  }
}

function selectDropDownLabel(fieldName, string, formName)  //Look through the Dropdown list, find a Label, and set the DropDown on the form specified
/*Example: selectDropDownLabel('CTRY', 'United States', 'demographics');*/
{
  if (formName == null) {
    formName = "forms[0]";
  }
  fieldName = eval("document."+formName+"."+fieldName);

  var len = fieldName.length;
  for (var i=0; i < len; i++) {
    if (fieldName.options[i].text == string) {
      fieldName.options[i].selected = true;
      break;
    }
  }
}

function CheckCheckBox(fieldName, string, formName){  //Checks specific Check Box based on value 1 or not
	
  if (formName == null) {
    formName = "forms[0]";
  }
  fieldName = eval("document."+formName+"."+fieldName);

  if (string=="1") {
    fieldName.checked=true;
  } else {
    fieldName.checked=false;
  }
}

function CheckRadioGroup(fieldName, string, formName) 
//Checks specific Radio Group based on string and checks matching radio button
/*Example: CheckRadioGroup('PTYP', 'Purchase', 'Registration');*/
{  	
  if (formName == null) {
    formName = "forms[0]";
  }
  fieldName = eval("document."+formName+"."+fieldName);
  for (var i=0; i<fieldName.length; i++) {
    if (fieldName[i].value == string) {
      fieldName[i].checked=true;
    }
  }
}

function PopulateText(fieldName, string, formName)
/*Example: PopulateText('ADD1', '127 somewhere', 'demographics');*/
{
  if (formName == null) {
    formName = "forms[0]";
  }
  fieldName = eval("document."+formName+"."+fieldName);
  fieldName.value = string;
}