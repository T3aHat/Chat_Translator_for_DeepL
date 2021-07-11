# Chat Translator for DeepL

[How to use (YouTube) ](https://www.youtube.com/watch?v=8nhYxoAYdio)

# Install from Chrome Web Store

https://chrome.google.com/webstore/detail/chat-translator-for-deepl/fbmkdedikbcbkkeaofpenfncppepfnlo

# Install from GitHub

- Move `chrome://extensions`.
- Ensure that the "Developer mode" checkbox in the top right-hand corner is checked.
- Download `Chat_Translator_for_DeepL.zip` from

https://github.com/T3aHat/Chat_Translator_for_DeepL/raw/main/Chat_Translator_for_DeepL.zip

- Drag-and-drop `Chat_Translator_for_DeepL.zip` to `chrome://extensions`.

# Cautions

To use this extension, please sign in to Chrome and sync turns on. If you do not sign in or sync turns off, you will get an error like  
`Error in response to storage.get: Error: Invocation of form identity.getProfileUserInfo(null, function) doesn't match definition identity.getProfileUserInfo(function callback)`.  
![syncon.png](https://github.com/T3aHat/Chat_Translator_for_DeepL/raw/main/images/syncon.png)

# How to translate

Since there is no need to translate native language comments into the native language,
[`chrome.i18n.detectLanguage()`](https://developer.chrome.com/docs/extensions/reference/i18n/#method-detectLanguage) will first determine the language, and if the language is selected in `Translate into`, it will be translated using the DeepL API.
However, this language detection system is not as accurate as DeepL and some text languages, such as Arabic, which are not supported by DeepL, are detected, but in this case, the text is not translated.

# Usage

- Click on the icon in the upper right corner of YoutubeLive or its archive to open a pop-up window and press the `start` button to start translation.
- Open the pop-up window again and press the `stop` button to finish translation.

# Options

![options.png](https://github.com/T3aHat/Chat_Translator_for_DeepL/raw/main/images/options.png)

## Translate from

Chats in the language you select here will be translated.

## Translate into

- The comments or chat will be translated into this language.

## Translation text length

- Only text of the length specified here will be translated.
- This setting prevents excessive use of the API by spam with long texts.

## Translate anyway

- Default: `false`
- When selected, all text within the chat field will be translated even if the language of the text is mother tongue.
- When not selected, only text in the selected language on `Translate from` will be translated.

## Strict mode

- Default: `true`
- When the active tab is changed, the translation will be paused.
- When you come back to the tab, the translation will be resumed.

## Remove loading icon

- Default: `false`
- When selected, the loading icon ![loading.gif](https://github.com/T3aHat/Chat_Translator_for_DeepL/raw/main/loading.gif) won't be appeared.

## Remove author-photo, author-name

![chatAuthorSettings.png](https://github.com/T3aHat/Chat_Translator_for_DeepL/raw/main/images/chatAuthorSettings.png)

- Default: `false`
- When selected, hide the user icon or user name in the chat field.
- i.e. `#author-photo.yt-live-chat-text-message-renderer{display:none;}` and `#author-name.yt-live-chat-author-chip{display:none;}`

## Custom CSS

- By writing CSS here, you can freely customize the display of the chat or comments field.
- If the CSS code is very long, the chrome extension will not be able to save the CSS correctly due to `chrome.storage.sync`'s capacity issue. So, you need to solve this problem by applying CSS every time.

## DeepL API KEY

- Default: `Free`
- Select your API_KEY's version `Free` or `Pro`
- Input your [DeepL](https://www.deepl.com/pro#developer) API_KEY here.

# 免責事項(Disclaimer)

- 本拡張機能は非公式です．問題がある場合は即公開停止するので，連絡してください．また，いかなる場合も，本拡張機能の利用に起因した損害に対して一切の責任と義務を負いません．
- 意図しない挙動を起こしても一切責任を負いません．  
  DeepL Pro を契約する際に**API 使用額上限を低めに設定**することを強く推奨します．
- 脆弱性により API の秘密鍵等が流出する可能性があります． **使用する場合はリスクを考慮したうえで自己責任で使用してください．ソースコードの挙動を理解できない場合は使用しないでください．** 開発者は一切責任を負いません．
- 定期的に身に覚えのない API 使用履歴がないか[ご利用状況](https://www.deepl.com/pro-account.html?page=category_usage)を確認してください．
- 開発者はド素人なので，特に API 鍵の保存方法に関するアドバイスを頂けると幸いです．

# 記事

[Qiita](https://qiita.com/teahat/items/052a91d69b63b6d7de0c)に書きました．
