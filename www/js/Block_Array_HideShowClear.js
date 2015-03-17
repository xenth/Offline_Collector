function Block_Array_HideShowClear (NameIDArray, FieldNameArray, act, FormShortName) {
	//Hides all of the items passed to "NameIDArray" and
	//clears all of the values in the fields passed in FieldNameArray
	//If either NameIDArray or FieldNameArray is empty it will not do that section
	//act is either "hide" or "show"
	//Include /js/Prepopulate.js for dropdown clearing
	//Does not support Netscape 4
	//Example calls:
	/*
	Block_Array_HideShowClear(new Array("HideMeid"), new Array("OTPR"), "show");  //Shows HideMeid and does nothing to value in OTPR
	Block_Array_HideShowClear(new Array("HideMeid"), new Array("OTPR"), "hide");  // Hides HideMeid and deletes the value in OTPR
	Block_Array_HideShowClear(new Array("HideMeid"), new Array(""), "hide");  // Hides HideMeid but does not delete any values
	Block_Array_HideShowClear(new Array(""), new Array("OTPR"), "hide");  // deletes the value in OTPR

	// The following hides Contactid 1 - 5 and clears the values for CFNM, CLNM, CMAL and CPHN
	Block_Array_HideShowClear(new Array("Contact1id","Contact2id","Contact3id","Contact4id","Contact5id","Contact6id"), new Array("CFNM","CLNM","CMAL","CPHN"), "hide");
	*/
	if (FormShortName == null) {
		FormShortName = "forms[0]"
	}
	FormName = eval("document."+FormShortName)
	for (var j=0; j<FieldNameArray.length; j++) {
		if (act=='hide' && FormName.elements[FieldNameArray[j]] ) {
			if (typeof(eval("FormName.elements['" + FieldNameArray[j] + "']") ) == "undefined") {
				continue;
			}
			else if (eval("FormName.elements['" + FieldNameArray[j] + "'].type") == "text") {
				eval("FormName.elements['" + FieldNameArray[j] + "'].value=''");
			}
			else if (eval("FormName.elements['" + FieldNameArray[j] + "'].type") == "textarea") {
				eval("FormName.elements['" + FieldNameArray[j] + "'].value=''");
			}
			else if (eval("FormName.elements['" + FieldNameArray[j] + "'].type") == "select-one") {
				selectDropDown(FieldNameArray[j], "", FormShortName);
			}
			else if (eval("FormName.elements['" + FieldNameArray[j] + "'].type") == "checkbox") {
				eval("FormName.elements['" + FieldNameArray[j] + "'].checked=false");
			}else if (eval("rlen=FormName.elements['" + FieldNameArray[j] + "'].length") > 0 && eval("FormName.elements['" + FieldNameArray[j] + "'][0].type")=="radio"){  //radio objects have a length even though otherwise undefined
				for (var r=0; r<rlen; r++) {
					eval("FormName.elements['" + FieldNameArray[j] + "']["+r+"].checked=false");
				}
			}else{
				//alert(eval("FormName.elements['" + FieldNameArray[j] + "'].type"));  //for debug
				//alert(eval("FormName.elements['" + FieldNameArray[j] + "'].length"));  //for debug
			}
		}
	}
	for (var i=0; i<NameIDArray.length; i++) {
		if (document.getElementById && document.getElementById(NameIDArray[i])) { // is W3C-DOM
			if (act=='show') {document.getElementById(NameIDArray[i]).style.display=''; document.getElementById(NameIDArray[i]).style.visibility='';}
			if (act=='hide') {
				document.getElementById(NameIDArray[i]).style.display='none';
				document.getElementById(NameIDArray[i]).style.visibility='hidden';
			}
		}
		else if (document.all) { // is IE
			if (act=='show') eval("document.all."+NameIDArray[i].value+".style.display='block'; document.all."+NameIDArray[i].value+".style.visibility='';");
			if (act=='hide'){
				eval("document.all."+NameIDArray[i].value+".style.display='none'; document.all."+NameIDArray[i].value+".style.visibility='hidden'; document.all."+NameIDArray[i].value+".value='';");
			}
		}
	}
}