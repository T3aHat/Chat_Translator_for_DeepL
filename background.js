var now = new Date();
var month = now.getMonth();
chrome.storage.sync.get(null, function (items) {
  var oldmonth = items.month;
  if (typeof oldmonth !== "undefined" && oldmonth == month) {
    alert(
      "Please check the usage status to see if there is any suspicious usage history."
    );
    chrome.tabs.create({
      url: "https://www.deepl.com/pro-account.html?page=category_usage",
    });
  }
  chrome.storage.sync.set({
    month: (month + 1) % 12,
  });
});
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.sync.set({
      target: "JA",
      deeplpro_apikey: [1],
      translang: ["en"],
      autoTranslationFlag: true,
      iconTranslationFlag: false,
      rmAuthorPhotoFlag: false,
      rmAuthorNameFlag: false,
      addedCSS: "",
      minlength: 1,
      maxlength: "",
    });
    alert(
      'Thank you for installing YouTube™ Chat Translator for DeepL!\nBefore using this extension, input "DeepL PRO API_KEY" on options page.'
    );
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (request.message == "please_restore") {
      sendResponse();
      chrome.storage.sync.get(null, function (items) {
        var ct = items.deeplpro_apikey;
        chrome.identity.getProfileUserInfo(null, function (info) {
          if (info.id == "" || info.email == "") {
          } else {
            tmp = 0;
            tmp2 = 1;
            if (info.id.length < info.email.length) {
              var len = info.id.length;
            } else {
              var len = info.email.length;
            }
            for (let i = 0; i < len; i++) {
              tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
              tmp2 *=
                info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
            }
            var foo = [];
            for (
              let i = Math.round(String(tmp2).length / 2);
              i < String(tmp2).length;
              i++
            ) {
              foo.push(
                String(tmp2).charCodeAt(i) *
                  String(tmp2).charCodeAt(
                    i - Math.round(String(tmp2).length / 2)
                  )
              );
            }
            var gtlen = 0;
            if (ct.length < foo.length) {
              gtlen = ct.length;
            } else {
              gtlen = foo.length;
            }
            var tmp3 = "";
            for (let i = 0; i < ct.length; i++) {
              tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
            }
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                message: "restore_storage",
                deeplpro_apikey: tmp3,
                target: items.target,
                translang: items.translang,
                autoTranslationFlag: items.autoTranslationFlag,
                iconTranslationFlag: items.iconTranslationFlag,
                rmAuthorPhotoFlag: items.rmAuthorPhotoFlag,
                rmAuthorNameFlag: items.rmAuthorNameFlag,
                addedCSS: items.addedCSS,
                minlength: items.minlength,
                maxlength: items.maxlength,
              },
              function (res) {
                if (chrome.runtime.lastError) {
                }
              }
            );
          }
        });
      });
    }
  });
});
