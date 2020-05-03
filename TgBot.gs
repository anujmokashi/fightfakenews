var token = "<bot token>";  
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "<WebAPPURL>";  
var ssId = "<googleSheetID>";
var fileTelegramUrl = "http://api.telegram.org/file/bot"+ token;

function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hi there");
}
  
function getFilePathPhoto(file_id_ph) {
  var url = telegramUrl + "/getFile?file_id=" + file_id_ph;
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response);
  return data.result.file_path;
}

function getImageUrl(file_path_ph){
  var url = fileTelegramUrl + "/" + file_path_ph;
  return url;
}

function getFilePathVideo(file_id_vd) {
  var url = telegramUrl + "/getFile?file_id=" + file_id_vd;
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response);
  //sh.appendRow([data.result.file_path])
  return data.result.file_path;
}

function getVideoUrl(file_path_vd){
  var url = fileTelegramUrl + "/" + file_path_vd;
  return url;
}

function doPost(e) {
  // this is where telegram works
  var logString = "";
  var data = JSON.parse(e.postData.contents);
  var chat_id = data.message.chat.id;
  var name = data.message.chat.first_name;
  
  if(chat_id == 445643999) {
    return 0;
  }
  
  if(data.message.chat.last_name != undefined){
    name = name + " " + data.message.chat.last_name;
  }
  var answer = "Hi " + name + ",";
  var answer1 = ""; // TO BE USED WHEN USER SELECTS /CHECK OR /INFO
  var photo = data.message.photo;
  var video = data.message.video;
  //sh.appendRow([photo, "photo"]);
  if(photo != undefined){ //IMAGE ->
    //var shT = SpreadsheetApp.openById(ssId).getSheets()[0];
    //sh.appendRow([data, "in pic"]);
    var file_id_ph = data.message.photo[0].file_id;
    //sh.appendRow([file_id, "file_id"]);
    var file_path_ph = getFilePathPhoto(file_id_ph)
    var file_url_ph = getImageUrl(file_path_ph);
    var file_unique_id_ph = data.message.photo[0].file_unique_id;
    var caption_ph = data.message.caption;
    
    var searchImageResult = doImageSearch(file_path_ph);
    //shT.appendRow([file_id, file_path, file_url, file_unique_id, searchImageResult]);
    if(searchImageResult != -1) {
      Logger.log("Found");
      var sh0 = SpreadsheetApp.openById(ssId).getSheets()[0];
      var conclusion = sh.getRange(searchResult, 3).getValue();
      var reference = sh.getRange(searchResult, 4).getValue();
      var checkCount = sh.getRange(searchResult, 5).getValue();
      var item = sh.getRange(searchResult, 2).getValue();
      var replyItem = item.substring(0, 25);
      answer = answer + "\n\nThe photo shared by you is "+ conclusion +"!!!";    
      if(reference != "" && reference != undefined) {
        answer = answer + "\n\nInformation resource: "+reference;
      }
      sh0.getRange(searchResult, 5).setValue(checkCount+1);
    } else {
      Logger.log("Entry for image");
      var sh1 = SpreadsheetApp.openById(ssId).getSheets()[1];
      //sh1.appendRow(["Image not found - inside else"]);
      answer = answer + "\n\nThank you for reaching out!";
      answer = answer + "\n\nFight Fake News team is on it. Once we verify your content, we'll get back to you with details.";
      answer = answer + "\n\nIn case, we are not able to verify the message shared by you, we will update you accordingly.";
      answer = answer + "\n\n#StayHomeStaySafe \n#StayAwayFromRumours";
      answer = answer + "\n\nP.S. This is an automated message please do not reply.";
      var activeRowCount = sh1.getLastRow();
      //Id	Chat_Id	Name	Item	Conclusion	isResponseSent	Source/Comments	Item_Id_From_Items_Sheet	Request Date	Response Date
      sh1.appendRow([activeRowCount, chat_id, name, file_path_ph,,0,,,new Date(),,,file_url_ph, caption_ph]);
    }
  }else if(video != undefined){ //VIDEO ->
    //var shT = SpreadsheetApp.openById(ssId).getSheets()[0];
    //sh.appendRow([data, "in pic"]);
    var file_id_vd = data.message.video.file_id;
    //sh.appendRow([file_id, "file_id"]);
    var file_path_vd = getFilePathVideo(file_id_vd)
    var file_url_vd = getVideoUrl(file_path_vd);
    var file_unique_id_vd = data.message.video.file_unique_id;
    var caption_vd = data.message.caption;
    
    var searchVideoResult = doVideoSearch(file_path_vd);
    //shT.appendRow([file_id, file_path, file_url, file_unique_id, searchImageResult]);
    if(searchVideoResult != -1) {
      Logger.log("Found");
      var sh0 = SpreadsheetApp.openById(ssId).getSheets()[0];
      var conclusion = sh.getRange(searchResult, 3).getValue();
      var reference = sh.getRange(searchResult, 4).getValue();
      var checkCount = sh.getRange(searchResult, 5).getValue();
      var item = sh.getRange(searchResult, 2).getValue();
      var replyItem = item.substring(0, 25);
      answer = answer + "\n\nThe video shared by you is "+ conclusion + "!!!";    
      if(reference != "" && reference != undefined) {
        answer = answer + "\n\nInformation resource: "+reference;
      }
      sh0.getRange(searchResult, 5).setValue(checkCount+1);
    } else {
      Logger.log("Entry for Video");
      var sh1 = SpreadsheetApp.openById(ssId).getSheets()[1];
      //sh1.appendRow(["Image not found - inside else"]);
      answer = answer + "\n\nThank you for reaching out!";
      answer = answer + "\n\nFight Fake News team is on it. Once we verify your content, we'll get back to you with details.";
      answer = answer + "\n\nIn case, we are not able to verify the message shared by you, we will update you accordingly.";
      answer = answer + "\n\n#StayHomeStaySafe \n#StayAwayFromRumours";
      answer = answer + "\n\nP.S. This is an automated message please do not reply.";
      var activeRowCount = sh1.getLastRow();
      //Id	Chat_Id	Name	Item	Conclusion	isResponseSent	Source/Comments	Item_Id_From_Items_Sheet	Request Date	Response Date
      sh1.appendRow([activeRowCount, chat_id, name, file_path_vd,,0,,,new Date(),,,file_url_vd, caption_vd]);
    }
  } else {
    
    var text = data.message.text;
    
    logString += " Inside doPost for chatId: "+chat_id+", user_name: "+name;
    //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Log b4 textLength Check ", JSON.stringify(text));
    if(text.length < 10) {
      if(text == "/start") {
        answer = answer + "\n\nWelcome to Covid19: Fight Fake News Telegram Bot!!!";
        answer = answer + "\n\nYou can send messages related to COVID-19 that you want to be fact-checked. Irrelevant stuff (emojis, gifs, etc.) is strictly not allowed. \n\nOur working hours are 9:00 AM - 10:00 PM, however, you are free to message us outside these hours and we will revert to you as soon as we are online.";
        answer = answer + "\n\nPlease use the below options to get started: ";
        answer = answer + "\n\n/check - To fact-check any message/image/video \n\n/info - To know more about this bot \n\n/twitter - Follow Us on Twitter (The_FFN_Network) for the latest updates.";
      } else if(text == "/check"){
        answer = answer1 + "\n\nPost a claim/news item/image/video/URL to have it fact-checked.";        
      }else if(text == "/info") {
        answer = answer1 + "\n\nFake news and misinformation are bigger pandemics than COVID-19 itself. To fight this menace, we created this COVID19: Fight Fake News bot to help you fact-check information and false claims related to COVID-19.";
        answer = answer + "\n\nThe resources that we refer are official ones with some of them being a part of IFCN - International Fact-Checking Network.";
        answer = answer + "\n\nThis bot has been made with love and care by the FFN Team that came together as part of Coronathon India.";
        answer = answer + "\n\nTake care & stay safe!!!";
        answer = answer + "\n\nTo verify a claim, use the /check command";
      }else if(text == "/twitter") {
        answer = answer1 + "\n\nFollow our Twitter handle: https://twitter.com/The_FFN_Network for latest updates";
      }else if(text == "Hi" || "Hello" || "thanks" || "Thanks" || "Thank you" || "Ty" || "TY" || "ty" || "Great" || "Ohh" || "Oh" || "ohh"|| "oh" || "Thnx" || "thnx" || "Thx" || "thx" || "hi" || "hello" || "hai"|| "please"|| "k"|| "ok"|| "okay"|| "oki"|| "okie" || "bye" || "Bye" || "goodbye" || "help" || "helping" ) {
        answer = answer + "\n\nPlease use the following commands to navigate your way.\n\n/check - To fact-check any news item/image/video/link \n\n/info - To know more about this bot \n\n/twitter - Follow us on Twitter (The_FFN_Network) for the latest updates";
      }else {
        answer = answer + "\n\nPlease send a detailed message to verify properly. It should be long enough to conclude.";
      }
    } else {
      var searchResult = doSearch(text);
      //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "after doSearch "+searchResult, JSON.stringify(text));
      logString = logString + ". result of doSearch Method: "+searchResult;
      if(searchResult != -1) {
        Logger.log("Found");
        var sh = SpreadsheetApp.openById(ssId).getSheets()[0];
        var conclusion = sh.getRange(searchResult, 3).getValue();
        var reference = sh.getRange(searchResult, 4).getValue();
        var checkCount = sh.getRange(searchResult, 5).getValue();
        
        var item = sh.getRange(searchResult, 2).getValue();
        var replyItem = item.substring(0, 25);
        answer = answer + "\n\nThe message shared by you: " + replyItem + " ... " + "is "+conclusion +"!!!";        
        if(reference != "" && reference != undefined) {
          answer = answer + "\n\nInformation resource: "+reference;
        }
        sh.getRange(searchResult, 5).setValue(checkCount+1);
        var mailRes = answer + "\n\nLogs for Developer: " +logString;
        //GmailApp.sendEmail(emailId, "Responded to user with chatId -> " + chat_id, JSON.stringify(mailRes));
      }
      else {
          Logger.log("Not Found");
        var sh = SpreadsheetApp.openById(ssId).getSheets()[1];
        answer = answer + "\n\nThank you for reaching out!";
        answer = answer + "\n\nFight Fake News team is on it. Once we verify your content, we'll get back to you with details.";
        answer = answer + "\n\nIn case, we are not able to verify the message shared by you, we will update you accordingly.";
        answer = answer + "\n\n#StayHomeStaySafe \n#StayAwayFromRumours";
        answer = answer + "\n\nP.S. This is an automated message please do not reply.";
        activeRowCount = sh.getLastRow();
        //Id	Chat_Id	Name	Item	Conclusion	isResponseSent	Source/Comments	Item_Id_From_Items_Sheet	Request Date	Response Date
        sh.appendRow([activeRowCount, chat_id, name, text,,0,,,new Date()]);
        //var mailRes = answer + text + "\n\n Logs for Developer: " +logString;
        //GmailApp.sendEmail(emailId, "New Item added for verification for user_chat_id -> " + chat_id, JSON.stringify(mailRes));
      }
    }
  }
  sendText(chat_id,answer);
  
}

function processExistingItem() {
  
}
function processNewItem() {
  
}

function doImageSearch(file_path_ph) {
  var sh = SpreadsheetApp.openById(ssId).getSheets()[0];
  var activeRowCount = sh.getLastRow();
  for(var i=1;i<=activeRowCount;i++){
    var item = sh.getRange(i, 2).getValue();
    //sh.appendRow([i, file_path, item])
    if(item.indexOf(file_path_ph)>-1) {
      return i;
    }
  }
  //sh.appendRow(["image item not found"]);
  return -1;
}

function doVideoSearch(file_path_vd) {
  var sh = SpreadsheetApp.openById(ssId).getSheets()[0];
  var activeRowCount = sh.getLastRow();
  for(var i=1;i<=activeRowCount;i++){
    var item = sh.getRange(i, 2).getValue();
    //sh.appendRow([i, file_path, item])
    if(item.indexOf(file_path_vd)>-1) {
      return i;
    }
  }
  //sh.appendRow(["image item not found"]);
  return -1;
}

function doSearch(searchKey) {
  Logger.log("Inside doSearch");
  var PATTERN_SIZE = 5;
  if(searchKey == "" || searchKey == undefined) {
    return -1;
  }
  
  var sh = SpreadsheetApp.openById(ssId).getSheets()[0];
  var activeRowCount = sh.getLastRow();
  var arr = [{}];
  var listPatterns = [];
  var isUrl = searchKey.indexOf("https://") > -1 || searchKey.indexOf("http://") > -1;
  if(isUrl == true) {
    arr = searchKey.split("-");
  } else {
    arr = searchKey.split(" ");
  }
  //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Log isUrl -> "+isUrl, JSON.stringify(arr));
  // Verify URLs
  if(isUrl == true) {
    for(var i=1;i<=activeRowCount;i++){
      var item = sh.getRange(i, 2).getValue();
      if(item.indexOf(searchKey)>-1) {
        return i;
      }
    }
  }
  for(var ii=0; ii<=arr.length - PATTERN_SIZE; ii++) {
    var pattern = "";
    for(var j=0; j<PATTERN_SIZE; j++) {
      pattern = pattern + " " + arr[ii+j];
    }
    listPatterns[ii] = pattern;
  }
  
  for(var i=1;i<=activeRowCount;i++) {
    for(var j=0;j<listPatterns.length;j++) {
      var item = sh.getRange(i, 2).getValue();
      if(item.indexOf(listPatterns[j])>-1) {
        return i;
      }
    }
  }
  return -1;
}

function doReplyPostManualVerification() {
  var sh = SpreadsheetApp.openById(ssId).getSheets()[1];
  var activeRowCount = sh.getLastRow();
  for(var i=2;i<=activeRowCount;i++) {
    var conclusion = sh.getRange(i, 5).getValue();
    var isResponseSent = sh.getRange(i, 6).getValue();
    var reference = sh.getRange(i, 7).getValue();
    Logger.log("Row read #"+ i + " total rows #"+activeRowCount + " isResponseSent: "+isResponseSent + " conclusion: "+conclusion);
    if(isResponseSent == 0 && conclusion != "" && conclusion != undefined && reference != "" && reference != undefined) {
      var chatId = sh.getRange(i, 2).getValue();
      var name = sh.getRange(i, 3).getValue();
      var item = sh.getRange(i, 4).getValue();
      var replyItem = item.substring(0, 25);
      var answer = "Hi "+name+ ",";
      if(item.startsWith("photos")){
        answer = answer + "\n\nThe photo shared by you is "+conclusion +"!!!";
      }else if(item.startsWith("video")){
        answer = answer + "\n\nThe video shared by you is "+conclusion +"!!!";
      }else{
        answer = answer + "\n\nThe message shared by you: " + replyItem + " ... " + "is "+conclusion +"!!!";
      }
      
      if(reference != "" && reference != undefined) {
        answer = answer + "\n\nInformation resource: "+reference;
      }
      answer = answer + "\n\n#StayHomeStaySafe \n#StayAwayFromRumours";
      answer = answer + "\n\nTo verify another claim/news/message, kindly use the /check command. \n\nTo know more about the bot, use /info command. \n\nTo follow us on Twitter (The_FFN_Network) for the latest updates, use /twitter command.";
      //GmailApp.sendEmail(emailId, "Responded to user with chatId -> " + chatId, JSON.stringify(answer));
      sendText(chatId,answer);
      var itemId = updateValidatedItems(item, conclusion, reference);
      sh.getRange(i, 6).setValue(1);
      sh.getRange(i, 8).setValue(itemId);
      sh.getRange(i, 10).setValue(new Date());
    }
  }
}

function updateValidatedItems(item, conclusion, reference) {
  var sh = SpreadsheetApp.openById(ssId).getSheets()[0];
  var activeRowCount = sh.getLastRow();
  //Id	Items	Conclusion	Source/Comments	Check Count
  sh.appendRow([activeRowCount, item, conclusion, reference, 1]);
  return activeRowCount;
}



