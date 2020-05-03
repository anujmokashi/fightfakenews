function doGet(request) {
  return HtmlService.createTemplateFromFile("contact").evaluate();
}

/* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* @Process Form */
function processForm(formObject) {
  var url =
    "https://docs.google.com/spreadsheets/d/1FCXu1hs4TZPoXaB-39-B8JfLqey5FaGgfCx2TKmk5Y4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Data");

  ws.appendRow([formObject.fullname, formObject.email, formObject.comment]);
}
