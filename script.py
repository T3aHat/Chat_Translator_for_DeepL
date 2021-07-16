import os
import zipfile
with zipfile.ZipFile('Chat_Translator_for_DeepL.zip', 'w')as zf:
    zf.write('manifest.json')
    zf.write('background.js')
    zf.write('chat-translator.js')
    # zf.write('comment-translator.js')
    # zf.write('comment-translator.css')
    zf.write('options.js')
    zf.write('options.html')
    zf.write('popup.js')
    zf.write('popup.html')
    zf.write('style.css')
    zf.write('jquery-3.5.1.min.js')
    zf.write('multiple-select.min.js')
    zf.write('multiple-select.min.css')
    zf.write('icon24.png')
    zf.write('icon128.png')
    zf.write('icon128_grey.png')
    zf.write('loading.gif')
    for folder, subfolders, files in os.walk('_locales'):
        zf.write(folder)
        for file in files:
            zf.write(os.path.join(folder, file))
