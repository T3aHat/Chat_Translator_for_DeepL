function save_options() {
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
          translang: $("#translang").multipleSelect("getSelects"),
          autoTranslationFlag: document.querySelector("#autoTranslationFlag")
            .checked,
          iconTranslationFlag: document.querySelector("#iconTranslationFlag")
            .checked,
          rmAuthorPhotoFlag: document.querySelector("#rmAuthorPhotoFlag")
            .checked,
          rmAuthorNameFlag: document.querySelector("#rmAuthorNameFlag").checked,
          addedCSS: document.querySelector("#addedCSS").value,
          minlength: document.querySelector("#minlength").value,
          maxlength: document.querySelector("#maxlength").value,
        },
        function () {
          var save = document.querySelector("#message");
          save.textContent = "Saved!";
          chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
              chrome.tabs.sendMessage(
                tabs[i].id,
                {
                  message: "saved",
                  target: document.querySelector("#target").value,
                  deeplpro_apikey: document.querySelector("#deeplpro_apikey")
                    .value,
                  translang: $("#translang").multipleSelect("getSelects"),
                  autoTranslationFlag: document.querySelector(
                    "#autoTranslationFlag"
                  ).checked,
                  iconTranslationFlag: document.querySelector(
                    "#iconTranslationFlag"
                  ).checked,
                  rmAuthorPhotoFlag: document.querySelector(
                    "#rmAuthorPhotoFlag"
                  ).checked,
                  rmAuthorNameFlag: document.querySelector("#rmAuthorNameFlag")
                    .checked,
                  addedCSS: document.querySelector("#addedCSS").value,
                  minlength: document.querySelector("#minlength").value,
                  maxlength: document.querySelector("#maxlength").value,
                },
                function (res) {
                  if (chrome.runtime.lastError) {
                  }
                  setTimeout(function () {
                    window.close();
                  }, 500);
                }
              );
            }
          });
        }
      );
    }
  });
}

function restore_options() {
  chrome.storage.sync.get(
    {
      target: "JA",
      deeplpro_apikey: "",
      translang: ["en"],
      autoTranslationFlag: true,
      iconTranslationFlag: false,
      rmAuthorPhotoFlag: false,
      rmAuthorNameFlag: false,
      addedCSS: "",
      minlength: 1,
      maxlength: -1,
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
          document.querySelector("#autoTranslationFlag").checked =
            items.autoTranslationFlag;
          document.querySelector("#iconTranslationFlag").checked =
            items.iconTranslationFlag;
          document.querySelector("#rmAuthorPhotoFlag").checked =
            items.rmAuthorPhotoFlag;
          document.querySelector("#rmAuthorNameFlag").checked =
            items.rmAuthorNameFlag;
          document.querySelector("#addedCSS").value = items.addedCSS;
          document.querySelector("#minlength").value = items.minlength;
          document.querySelector("#maxlength").value = items.maxlength;
          //save_options();
        }
      });
    }
  );
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
            var api_url = "https://api.deepl.com/v2/translate";
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
document.querySelector("#save").addEventListener("click", save_options);
document.querySelector("#apitest").addEventListener("click", api_test);
$(function () {
  $("#translang").multipleSelect();
});
