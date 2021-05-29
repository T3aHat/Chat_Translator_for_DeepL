console.log("YouTube™ Chat Translator for DeepL (chat) loaded");
chrome.runtime.sendMessage({ message: "please_restore" }, function (res) {
  if (chrome.runtime.lastError) {
  }
});

let observer;
let chatsClass;
var deeplpro_apikey;
var target;
var translang;
var autoTranslationFlag;
var minlength;
var maxlength;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "restore_storage") {
    sendResponse();
    chatsClass = document.querySelector(
      "#items.yt-live-chat-item-list-renderer"
    );
    change_settings(request);
    add_observer();
  } else if (request.message == "saved") {
    sendResponse();
    change_settings(request);
    add_observer();
  }
});

function change_settings(request) {
  deeplpro_apikey = request.deeplpro_apikey;
  target = request.target;
  translang = request.translang;
  autoTranslationFlag = request.autoTranslationFlag;
  addedCSS = request.addedCSS;
  minlength = request.minlength;
  maxlength = request.maxlength;
  try {
    document.querySelector("#chatransAddedCSS").remove();
  } catch {}
  if (request.rmAuthorPhotoFlag) {
    addedCSS +=
      "\n#author-photo.yt-live-chat-text-message-renderer{display:none;}";
  }
  if (request.rmAuthorNameFlag) {
    addedCSS += "\n#author-name.yt-live-chat-author-chip{display:none;}";
  }
  a = document.createElement("style");
  a.type = "text/css";
  a.id = "chatransAddedCSS";
  a.textContent = addedCSS;
  document.head.appendChild(a);
}

function add_observer() {
  try {
    observer.disconnect();
  } catch {}
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id == "message") {
        if (autoTranslationFlag) {
          detectLanguage(mutation.target); //消さないとAPI使用量が
        }
        mutation.target.addEventListener("contextmenu", function (e) {
          e.preventDefault();
          detectLanguage(mutation.target);
        });
      }
    });
  });
  observer.observe(chatsClass, {
    childList: true,
    subtree: true,
  });
}

function detectLanguage(targetelm) {
  let chat = targetelm.textContent;
  if (
    (chat.length >= minlength || minlength == "") &&
    (chat.length <= maxlength || maxlength == "")
  ) {
    chrome.i18n.detectLanguage(chat, function (result) {
      var outputLang = result.languages[0].language;
      console.log(result.languages);
      api_translation(targetelm, outputLang);
    });
  } else {
  }
}

function api_translation(elm, outputLang) {
  chrome.storage.sync.get(null, function (items) {
    if (items.translang.includes(outputLang)) {
      var target_chat = elm.textContent;
      var target = items.target;
      if (typeof target === "undefined") {
        target = "JA";
      }
      var api_url = "https://api.deepl.com/v2/translate";
      var params = {
        auth_key: deeplpro_apikey,
        text: target_chat,
        target: target,
      };
      var data = new URLSearchParams();
      Object.keys(params).forEach((key) => data.append(key, params[key]));

      fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; utf-8",
        },
        body: data,
      }).then((res) => {
        if (res.status == "200") {
          res.json().then((resData) => {
            elm.textContent = resData.translations[0].text;
          });
          console.log(
            "Original : " +
              comment +
              "\nTranslation from DeepL Pro API : " +
              resData.translations[0].text
          );
        } else {
          elm.textContent =
            "This is a sample translation of YouTube™ Chat Translator for DeepL";

          switch (res.status) {
            case 400:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nBad request. Please check error message and your parameters."
              );
              break;
            case 403:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nAuthorization failed. Please supply a valid auth_key parameter."
              );
              break;
            case 404:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nThe requested resource could not be found."
              );
              break;
            case 413:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nThe request size exceeds the limit."
              );
              break;
            case 429:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nToo many requests. Please wait and resend your request."
              );
              break;
            case 456:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nQuota exceeded. The character limit has been reached."
              );
              break;
            case 503:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " +
                  res.status +
                  "\nResource currently unavailable. Try again later."
              );
              break;
            default:
              console.log(
                "YouTube™ Chat Translator for DeepL Error : " + res.status
              );
          }
        }
        window.getSelection().removeAllRanges();
      });
    }
  });
}
