chrome.runtime.onInstalled.addListener(function (details) {
  chrome.browserAction.setIcon({ path: "icon128_grey.png" });
  if (details.reason == "install") {
    chrome.storage.sync.set({
      target: "JA",
      deeplpro_apikey: [],
      translang: ["en"],
      anywayFlag: false,
      rmLoadingFlag: false,
      rmAuthorPhotoFlag: false,
      rmAuthorNameFlag: false,
      addedCSS: "",
      minlength: 1,
      maxlength: "",
      freeflag: "Free",
    });
    alert(
      'Thank you for installing Chat Translator for DeepL!\nBefore using this extension, input "DeepL API_KEY" on options page.'
    );
    chrome.runtime.openOptionsPage();
  }
});
let translatingTabId = -1;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "updateBadgeText") {
    chrome.browserAction.setBadgeText({ text: request.text + "%" });
  } else if (request.message == "translatingTabId") {
    if (request.translatingflag) {
      translatingTabId = sender.tab.id;
    } else {
      //not translatingならtranslatingTabIdは初期化
      translatingTabId = -1; //reset
    }
  }
});
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (translatingTabId != -1) {
    if (activeInfo.tabId != translatingTabId) {
      chrome.tabs.sendMessage(
        translatingTabId,
        {
          message: "stopTranslation",
        },
        function (res) {
          if (chrome.runtime.lastError) {
          }
          chrome.browserAction.setIcon({
            path: "icon128_grey.png",
          });
        }
      );
    } else {
      //resume translation
      chrome.tabs.sendMessage(
        activeInfo.tabId,
        {
          message: "resumeTranslation",
        },
        function (res) {
          if (chrome.runtime.lastError) {
          }
          chrome.browserAction.setIcon({
            path: "icon128.png",
          });
        }
      );
    }
  }
});
