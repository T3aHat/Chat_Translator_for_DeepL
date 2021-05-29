chrome.runtime.sendMessage({ message: "please_restore" }, function (res) {
  if (chrome.runtime.lastError) {
  }
});
var deeplpro_apikey;
var target;
var translang;
var iconTranslationFlag;
var minlength;
var maxlength;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "restore_storage") {
    sendResponse();
    change_settings(request);
    if (request.iconTranslationFlag) {
      document.querySelectorAll("#main.ytd-comment-renderer").forEach((el) => {
        add_iconNode(el);
      });
    }
    setObserver();
  } else if (request.message == "saved") {
    sendResponse();
    change_settings(request);
    if (request.iconTranslationFlag) {
      document.querySelectorAll("#main.ytd-comment-renderer").forEach((el) => {
        add_iconNode(el);
      });
    }
  }
});

function change_settings(request) {
  deeplpro_apikey = request.deeplpro_apikey;
  target = request.target;
  translang = request.translang;
  iconTranslationFlag = request.iconTranslationFlag;
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
  if (iconTranslationFlag) {
    //setObserver();
  } else {
    document.querySelectorAll(".par_deepl_icon").forEach((el) => {
      el.remove();
    });
  }
}

let timer = 500;
let observer;
let repobserver;
function setObserver() {
  if (document.querySelector("#contents.ytd-item-section-renderer")) {
    console.log("YouTube™ Chat Translator for DeepL (comment) loaded");
    let chatClass = document.querySelector(
      "#contents.ytd-item-section-renderer"
    );
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((el) => {
          if (
            el.querySelector("#loaded-replies.ytd-comment-replies-renderer")
          ) {
            let reply = el.querySelector(
              "#loaded-replies.ytd-comment-replies-renderer"
            );
            repobserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((repel) => {
                  add_iconNode(repel);
                });
              });
            });
            repobserver.observe(reply, {
              childList: true,
            });
          }
          add_iconNode(el);
        });
      });
    });
    observer.observe(chatClass, {
      childList: true,
    });
  } else {
    if (timer < 10000) {
      setTimeout(setObserver, timer);
      timer += 500;
    }
  }
}

function add_iconNode(el) {
  if (iconTranslationFlag) {
    try {
      let chatelm = el.querySelector("#content-text.ytd-comment-renderer");
      let parent = el.querySelector("#header-author.ytd-comment-renderer");
      var newNode = document.createElement("p");
      newNode.className = "par_deepl_icon";
      newNode.innerHTML =
        "<div class='deepl_icon'><img src='" +
        chrome.runtime.getURL("icon24.png") +
        "'></div>";
      newNode.addEventListener(
        "click",
        function () {
          icon_translate(chatelm);
        },
        false
      );
      try {
        parent.querySelector(".par_deepl_icon").remove();
      } catch {}
      parent.appendChild(newNode);
    } catch {}
  }
}

function icon_translate(chatelm) {
  translate(chatelm);
}

function translate(targetelm) {
  let inputText = targetelm.textContent;
  if (
    (inputText.length >= minlength || minlength == "") &&
    (inputText.length <= maxlength || maxlength == "")
  )
    chrome.i18n.detectLanguage(inputText, function (result) {
      var outputLang = result.languages[0].language;
      api_translation(targetelm, outputLang);
    });
}

function api_translation(elm, outputLang) {
  if (translang.includes(outputLang)) {
    if (typeof target === "undefined") {
      target = "JA";
    }
    var target_comment = elm.textContent;
    var api_url = "https://api.deepl.com/v2/translate";
    var params = {
      auth_key: deeplpro_apikey,
      text: target_comment,
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
            target_comment +
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
}
