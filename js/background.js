'use strict';
chrome.runtime.onInstalled.addListener(async function() {
  let data = await getData("https://gist.githubusercontent.com/DerexScript/727bbb24246b1b73ffeba38836e5303e/raw/8e3d5da794ec0a84a488a231c2f025e6812c707c/clearGroup.js");
 /*
 chrome.storage.sync.set({code: data}, function() {
    console.log('code updated successfully!');
  });
  */
  chrome.storage.local.set({code: data}, function() {
    console.log('storage local updated successfully {code}');
  });
  chrome.storage.sync.set({status: 'stopped'}, function() {
    console.log('status updated successfully!');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: "web.whatsapp.com"},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  
});

let getData = url => new Promise((resolve, reject) => {
  let xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      resolve(this.responseText);
    } else if (this.readyState == 4 && this.status !== 200 && this.status !== 0) {
      console.log("Error: Verifique a permissão de acesso!");
      reject("error: " + this.status);
    } else if (this.readyState == 4 && this.status == 0) {
      console.log("Error: desconhecido, Resposta do servidor: " + url + ", não recebida.");
      reject("Error: desconhecido, Resposta do servidor não recebida.");
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
});