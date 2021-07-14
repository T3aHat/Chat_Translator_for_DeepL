function save_options(input) {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.identity.getProfileUserInfo(null, function (info) {
    if (info.id == "" || info.email == "") {
      document.querySelector("#apitestm").style.color = "red";
      document.querySelector("#apitestm").innerText =
        "To use this extension, please sign in to chrome and sync turns on.";
    } else {
      var tmp = 0;
      var tmp2 = 1;
      if (info.id.length < info.email.length) {
        var len = info.id.length;
      } else {
        var len = info.email.length;
      }
      for (let i = 0; i < len; i++) {
        tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
        tmp2 *= info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
      }
      var foo = [];
      for (
        let i = Math.round(String(tmp2).length / 2);
        i < String(tmp2).length;
        i++
      ) {
        foo.push(
          String(tmp2).charCodeAt(i) *
            String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
        );
      }
      var tmplist = [];
      var gtlen = 0;
      if (
        document.querySelector("#deeplpro_apikey").value.length < foo.length
      ) {
        gtlen = document.querySelector("#deeplpro_apikey").value.length;
      } else {
        gtlen = foo.length;
      }
      for (
        let i = 0;
        i < document.querySelector("#deeplpro_apikey").value.length;
        i++
      ) {
        tmplist.push(
          document.querySelector("#deeplpro_apikey").value.charCodeAt(i) * tmp +
            foo[i % gtlen]
        );
      }
      if (document.querySelector("#anywayFlag").checked) {
        document
          .querySelector(".ms-choice")
          .querySelector("span").style.display = "none";
        const resultarea = document.createElement("span");
        resultarea.id = "Alllanguages";
        resultarea.innerHTML = "All languages";
        document.querySelectorAll("#Alllanguages").forEach((qs) => {
          qs.remove();
        });
        document.querySelector(".ms-choice").append(resultarea);
      } else {
        try {
          document.querySelectorAll("#Alllanguages").forEach((qs) => {
            qs.remove();
          });
        } catch {}
        document
          .querySelector(".ms-choice")
          .querySelector("span").style.display = "";
      }
      let minlen, maxlen;
      if (document.querySelector("#minlength").value < 1) {
        minlen = "";
      } else {
        minlen = document.querySelector("#minlength").value;
      }
      if (document.querySelector("#maxlength").value < 1) {
        maxlen = "";
      } else {
        maxlen = document.querySelector("#maxlength").value;
      }
      chrome.storage.sync.set(
        {
          target: document.querySelector("#target").value,
          deeplpro_apikey: tmplist,
          translang: $("#translang").multipleSelect("getSelects"),
          anywayFlag: document.querySelector("#anywayFlag").checked,
          strictFlag: document.querySelector("#strictFlag").checked,
          rmLoadingFlag: document.querySelector("#rmLoadingFlag").checked,
          rmAuthorPhotoFlag:
            document.querySelector("#rmAuthorPhotoFlag").checked,
          rmAuthorNameFlag: document.querySelector("#rmAuthorNameFlag").checked,
          addedCSS: document.querySelector("#addedCSS").value,
          minlength: minlen,
          maxlength: maxlen,
          freeflag: document.querySelector("#freeflag").value,
        },
        function () {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  message: "saved",
                  input: input,
                  target: document.querySelector("#target").value,
                  deeplpro_apikey:
                    document.querySelector("#deeplpro_apikey").value,
                  translang: $("#translang").multipleSelect("getSelects"),
                  anywayFlag: document.querySelector("#anywayFlag").checked,
                  strictFlag: document.querySelector("#strictFlag").checked,
                  rmLoadingFlag:
                    document.querySelector("#rmLoadingFlag").checked,
                  rmAuthorPhotoFlag:
                    document.querySelector("#rmAuthorPhotoFlag").checked,
                  rmAuthorNameFlag:
                    document.querySelector("#rmAuthorNameFlag").checked,
                  addedCSS: document.querySelector("#addedCSS").value,
                  minlength: minlen,
                  maxlength: maxlen,
                  freeflag: document.querySelector("#freeflag").value,
                },
                function (res) {
                  if (chrome.runtime.lastError) {
                  }
                  if (!input) {
                    if (translating) {
                      //stop translation
                      chrome.browserAction.setIcon({
                        path: "icon128_grey.png",
                      });
                    } else {
                      //start translation
                      chrome.browserAction.setIcon({
                        path: "icon128.png",
                      });
                    }
                    document.querySelector("#message").textContent = "Saved!";
                    setTimeout(function () {
                      window.close();
                    }, 500);
                  }
                }
              );
            }
          );
        }
      );
    }
  });
}

let translating = false;
function restore_options() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        message: "translatingflag",
      },
      function (res_translatingflag) {
        if (chrome.runtime.lastError) {
        }
        translating = res_translatingflag;
        if (res_translatingflag) {
          document.querySelector("#save").textContent = "Stop";
        }
        chrome.storage.sync.get(
          {
            target: "JA",
            deeplpro_apikey: "",
            translang: ["en"],
            anywayFlag: false,
            strictFlag: true,
            rmLoadingFlag: false,
            rmAuthorPhotoFlag: false,
            rmAuthorNameFlag: false,
            addedCSS: "",
            minlength: 1,
            maxlength: "",
            freeflag: "Free",
          },
          function (items) {
            chrome.identity.getProfileUserInfo(null, function (info) {
              if (info.id == "" || info.email == "") {
                document.querySelector("#apitestm").style.color = "red";
                document.querySelector("#apitestm").innerText =
                  "To use this extension, please sign in to chrome and sync turns on.";
              } else {
                var tmp = 0;
                var tmp2 = 1;
                if (info.id.length < info.email.length) {
                  var len = info.id.length;
                } else {
                  var len = info.email.length;
                }
                for (let i = 0; i < len; i++) {
                  tmp +=
                    info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
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
                if (items.deeplpro_apikey.length < foo.length) {
                  gtlen = items.deeplpro_apikey.length;
                } else {
                  gtlen = foo.length;
                }
                var tmp3 = "";
                for (let i = 0; i < items.deeplpro_apikey.length; i++) {
                  tmp3 += String.fromCharCode(
                    (items.deeplpro_apikey[i] - foo[i % gtlen]) / tmp
                  );
                }
                $("#translang").multipleSelect("setSelects", items.translang);
                document.querySelector("#target").value = items.target;
                document.querySelector("#deeplpro_apikey").value = tmp3;
                document.querySelector("#anywayFlag").checked =
                  items.anywayFlag;
                document.querySelector("#strictFlag").checked =
                  items.strictFlag;
                document.querySelector("#rmLoadingFlag").checked =
                  items.rmLoadingFlag;
                document.querySelector("#rmAuthorPhotoFlag").checked =
                  items.rmAuthorPhotoFlag;
                document.querySelector("#rmAuthorNameFlag").checked =
                  items.rmAuthorNameFlag;
                document.querySelector("#addedCSS").value = items.addedCSS;
                document.querySelector("#minlength").value = items.minlength;
                document.querySelector("#maxlength").value = items.maxlength;
                document.querySelector("#freeflag").value = items.freeflag;
                save_options(true);
              }
            });
          }
        );
      }
    );
  });
  document.querySelector("#settings").addEventListener("input", function () {
    save_options(true);
  });
}

function api_test() {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.identity.getProfileUserInfo(null, function (info) {
    if (info.id == "" || info.email == "") {
      document.querySelector("#apitestm").style.color = "red";
      document.querySelector("#apitestm").innerText =
        "To use this extension, please sign in to chrome and sync turns on.";
    } else {
      var tmp = 0;
      var tmp2 = 1;
      if (info.id.length < info.email.length) {
        var len = info.id.length;
      } else {
        var len = info.email.length;
      }
      for (let i = 0; i < len; i++) {
        tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
        tmp2 *= info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
      }
      var foo = [];
      for (
        let i = Math.round(String(tmp2).length / 2);
        i < String(tmp2).length;
        i++
      ) {
        foo.push(
          String(tmp2).charCodeAt(i) *
            String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
        );
      }
      var tmplist = [];
      var gtlen = 0;
      if (
        document.querySelector("#deeplpro_apikey").value.length < foo.length
      ) {
        gtlen = document.querySelector("#deeplpro_apikey").value.length;
      } else {
        gtlen = foo.length;
      }
      for (
        let i = 0;
        i < document.querySelector("#deeplpro_apikey").value.length;
        i++
      ) {
        tmplist.push(
          document.querySelector("#deeplpro_apikey").value.charCodeAt(i) * tmp +
            foo[i % gtlen]
        );
      }
      chrome.storage.sync.set(
        {
          target: document.querySelector("#target").value,
          deeplpro_apikey: tmplist,
          freeflag: document.querySelector("#freeflag").value,
        },
        function () {
          var save = document.querySelector("#message");
          save.textContent = "Saved!";
          setTimeout(function () {
            save.textContent = "";
          }, 1500);
          chrome.storage.sync.get(null, function (items) {
            var target = items.target;
            var ct = items.deeplpro_apikey;
            if (typeof target === "undefined") {
              target = "JA";
            }
            let freeflag = items.freeflag;
            let api_url = "";
            if (freeflag == "Free") {
              api_url = "https://api-free.deepl.com/v2/translate";
            } else {
              api_url = "https://api.deepl.com/v2/translate";
            }
            var tmp3 = "";
            for (let i = 0; i < ct.length; i++) {
              tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
            }
            var deeplpro_apikey = tmp3;
            var params = {
              auth_key: deeplpro_apikey,
              text: "Authentication success",
              target_lang: target,
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
                  document.querySelector("#apitestm").style.color = "";
                  document.querySelector("#apitestm").innerText =
                    resData.translations[0].text + "!";
                });
              } else {
                document.querySelector("#apitestm").style.color = "red";
                switch (res.status) {
                  case 400:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nBad request. Please check error message and your parameters.";
                    break;
                  case 403:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nAuthorization failed. Please supply a valid auth_key parameter.";
                    break;
                  case 404:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nThe requested resource could not be found.";
                    break;
                  case 413:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nThe request size exceeds the limit.";
                    break;
                  case 429:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nToo many requests. Please wait and resend your request.";
                    break;
                  case 456:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nQuota exceeded. The character limit has been reached.";
                    break;
                  case 503:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nResource currently unavailable. Try again later.";
                    break;
                  default:
                    document.querySelector("#apitestm").innerText =
                      "Error : " + res.status;
                }
              }
            });
          });
        }
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", function () {
  save_options(false);
});
document.querySelector("#apitest").addEventListener("click", api_test);
$(function () {
  $("#translang").multipleSelect();
});
document.querySelector("#close").addEventListener("click", function () {
  window.close();
});
