chrome.runtime.onInstalled.addListener(function (details) {
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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "updateBadgeText") {
    chrome.browserAction.setBadgeText({ text: request.text + "%" });
  }
});
