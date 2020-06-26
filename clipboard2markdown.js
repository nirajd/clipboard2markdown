(function () {
  'use strict';

  // http://pandoc.org/README.html#smart-punctuation
  var escape = function (str) {
    return str.replace(/[\u2018\u2019\u00b4]/g, "'")
      .replace(/[\u201c\u201d\u2033]/g, '"')
      .replace(/[\u2212\u2022\u00b7\u25aa]/g, '-')
      .replace(/[\u2013\u2015]/g, '--')
      .replace(/\u2014/g, '---')
      .replace(/\u2026/g, '...')
      .replace(/[ ]+\n/g, '\n')
      .replace(/\s*\\\n/g, '\\\n')
      .replace(/\s*\\\n\s*\\\n/g, '\n\n')
      .replace(/\s*\\\n\n/g, '\n\n')
      .replace(/\n-\n/g, '\n')
      .replace(/\n\n\s*\\\n/g, '\n\n')
      .replace(/\n\n\n*/g, '\n\n')
      .replace(/[ ]+$/gm, '')
      .replace(/^\s+|[\s\\]+$/g, '');
  };

  var opts = {
    "bulletListMarker": "-",
    "codeBlockStyle": "indented",
    "emDelimiter": "_",
    "fence": "```",
    "headingStyle": "atx",
    "hr": "---",
    "linkReferenceStyle": "full",
    "linkStyle": "inlined",
    "strongDelimiter": "**"
  }
  var turndownService = new TurndownService(opts);
  var convert = function (str) {
    return turndownService.turndown(str);
  }

  var insert = function (myField, myValue) {
    if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
      sel.select()
    } else {
      if (myField.selectionStart || myField.selectionStart == "0") {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        var beforeValue = myField.value.substring(0, startPos);
        var afterValue = myField.value.substring(endPos, myField.value.length);
        myField.value = beforeValue + myValue + afterValue;
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
        myField.focus()
      } else {
        myField.value += myValue;
        myField.focus()
      }
    }
  };

  // http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
  document.addEventListener('DOMContentLoaded', function () {
    var info = document.querySelector('#info');
    var pastebin = document.querySelector('#pastebin');
    var output = document.querySelector('#output');
    var wrapper = document.querySelector('#wrapper');

    document.addEventListener('keydown', function (event) {
      if (event.ctrlKey || event.metaKey) {
        if (String.fromCharCode(event.which).toLowerCase() === 'v') {
          pastebin.innerHTML = '';
          pastebin.focus();
          info.classList.add('hidden');
          wrapper.classList.add('hidden');
        }
      }
    });

    pastebin.addEventListener('paste', function () {
      setTimeout(function () {
        var html = pastebin.innerHTML;
        var markdown = convert(html);
        // output.value = markdown;
        insert(output, markdown);
        wrapper.classList.remove('hidden');
        output.focus();
        output.select();
      }, 200);
    });
  });
})();
