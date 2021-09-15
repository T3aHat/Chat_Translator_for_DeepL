console.log("Chat Translator for DeepL: loaded");
let observer;
var deeplpro_apikey;
var target;
var translang;
var minlength;
var maxlength;
let freeflag;
let rmLoadingFlag = false;
let translatingflag = false;
let anywayFlag = false;
const imgurl = chrome.runtime.getURL("loading.gif");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "saved") {
    change_settings(request);
    chrome.runtime.sendMessage(
      { message: "translatingTabId", translatingflag: translatingflag },
      function (res) {
        if (chrome.runtime.lastError) {
        }
      }
    );
    sendResponse(true);
  } else if (request.message == "translatingflag") {
    sendResponse(translatingflag);
  } else if (request.message == "stopTranslation") {
    disconnectObserver();
    sendResponse();
  } else if (request.message == "resumeTranslation") {
    addObserver();
    sendResponse();
  }
});

function change_settings(request) {
  deeplpro_apikey = request.deeplpro_apikey;
  target = request.target;
  translang = request.translang;
  anywayFlag = request.anywayFlag;
  rmLoadingFlag = request.rmLoadingFlag;
  addedCSS = request.addedCSS;
  minlength = request.minlength;
  maxlength = request.maxlength;
  freeflag = request.freeflag;
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
  if (request.addedCSSFlag) {
    a = document.createElement("style");
    a.type = "text/css";
    a.id = "chatransAddedCSS";
    a.textContent = addedCSS;
    document.head.appendChild(a);
  } else {
    try {
      document.querySelector("#chatransAddedCSS").remove;
    } catch {}
  }
  if (!request.input) {
    if (translatingflag) {
      disconnectObserver();
    } else {
      addObserver();
    }
  }
}

function disconnectObserver() {
  try {
    observer.disconnect();
    translatingflag = false;
  } catch {}
}

function addObserver() {
  disconnectObserver();
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.target.id == "message" &&
        !mutation.target.classList.contains("chatTranslator")
      ) {
        if (translatingflag) {
          detectLanguage(mutation.target);
        }
      }
    });
  });
  let chatsClass = document.querySelector(
    "#items.yt-live-chat-item-list-renderer"
  );
  observer.observe(chatsClass, {
    childList: true,
    subtree: true,
  });
  translatingflag = true;
}

function detectLanguage(targetelm) {
  if (!anywayFlag) {
    let chat = targetelm.textContent;
    if (
      (chat.length >= minlength || minlength == "") &&
      (chat.length <= maxlength || maxlength == "")
    ) {
      chrome.i18n.detectLanguage(chat, function (result) {
        var outputLang = result.languages[0].language;
        api_translation(targetelm, outputLang);
      });
    }
  } else {
    api_translation(targetelm, "");
  }
}

function updateBadgeText(freeflag) {
  let url;
  if (freeflag == "Free") {
    url = "https://api-free.deepl.com/v2/usage";
  } else {
    url = "https://api.deepl.com/v2/usage";
  }
  let params = {
    auth_key: deeplpro_apikey,
  };
  let data = new URLSearchParams();
  Object.keys(params).forEach((key) => data.append(key, params[key]));
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; utf-8",
    },
    body: data,
  }).then((res) => {
    res.json().then((resData) => {
      let percent = Math.trunc(
        (resData.character_count / resData.character_limit) * 100
      );
      console.log(
        "Chat Translator for DeepL: " +
          resData.character_count +
          "/" +
          resData.character_limit +
          " characters translated.\n"
      );
      chrome.runtime.sendMessage(
        { message: "updateBadgeText", text: percent },
        function (res) {
          if (chrome.runtime.lastError) {
          }
        }
      );
    });
  });
}

function api_translation(elm, outputLang) {
  chrome.storage.sync.get(null, function (items) {
    if (items.anywayFlag || items.translang.includes(outputLang)) {
      let loadingicon;
      if (!rmLoadingFlag) {
        loadingicon = document.createElement("img");
        loadingicon.setAttribute("class", "loadingicon");
        loadingicon.setAttribute("src", imgurl);
        elm.before(loadingicon);
        elm.classList.add("chatTranslator");
      }
      //var target_chat = elm.textContent;
      let target_chat = elm.innerHTML;
      var target = items.target;
      let freeflag = items.freeflag;
      if (typeof target === "undefined") {
        target = "JA";
      }
      let api_url = "";
      if (freeflag == "Free") {
        api_url = "https://api-free.deepl.com/v2/translate";
      } else {
        api_url = "https://api.deepl.com/v2/translate";
      }
      var params = {
        auth_key: deeplpro_apikey,
        text: target_chat,
        target_lang: target,
        tag_handling: "xml",
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
        if (!rmLoadingFlag) {
          try {
            loadingicon.remove();
          } catch {}
        }
        if (res.status == "200") {
          res.json().then((resData) => {
            //elm.textContent = resData.translations[0].text;
            elm.innerHTML = resData.translations[0].text;
            console.log(
              "Original : " +
                "(" +
                outputLang +
                ") " +
                target_chat +
                "\nTranslation result from DeepL API : " +
                resData.translations[0].text
            );
          });
          updateBadgeText(freeflag);
        } else {
          elm.textContent =
            "Translation failed. Check the Developer Tools for more information. ";

          switch (res.status) {
            case 400:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nBad request. Please check error message and your parameters."
              );
              break;
            case 403:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nAuthorization failed. Please supply a valid auth_key parameter."
              );
              break;
            case 404:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nThe requested resource could not be found."
              );
              break;
            case 413:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nThe request size exceeds the limit."
              );
              break;
            case 429:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nToo many requests. Please wait and resend your request."
              );
              break;
            case 456:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nQuota exceeded. The character limit has been reached."
              );
              break;
            case 503:
              console.log(
                "Chat Translator for DeepL Error : " +
                  res.status +
                  "\nResource currently unavailable. Try again later."
              );
              break;
            default:
              console.log("Chat Translator for DeepL Error : " + res.status);
          }
        }
      });
    }
  });
}
