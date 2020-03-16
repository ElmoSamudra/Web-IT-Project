function getFormValue() {

    var x = document.getElementById("formname");
    var text = "";
    var i;
    for (i = 0; i < x.length-1 ;i++) {
        text += x.elements[i].value + " ";
    }
    alert(text)


}