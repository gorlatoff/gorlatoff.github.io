const transTables = {
  'isv_to_standard': 'ć-č ć-č ć-č ś-s ź-z ŕ-r ĺ-l ľ-l ń-n t́-t ť-t d́-d ď-d đ-dž ò-o ȯ-o ė-e è-e č-č š-š ž-ž ě-ě е̌-ě å-a ę-e ų-u',
  'isv_to_standard_cyrillic': 'ń-н ľ-л nj-њ lj-љ ć-ч ć-ч ć-ч ś-с ź-з ŕ-р t́-т ť-т d́-д ď-д đ-дж ò-о ȯ-о ė-е è-е č-ч š-ш ž-ж ě-є е̌-є ě-є å-а ę-е ų-у a-а b-б c-ц č-ч d-д e-е f-ф g-г h-х i-и j-ј k-к l-л m-м n-н o-о p-п r-р s-с š-ш t-т u-у v-в y-ы z-з ž-ж',
  'kir_to_lat': 'ньј-ńj ь- а-a ӑ-å б-b в-v ў-v г-g ґ-g д-d дж-dž ђ-dž е-e є-ě ѣ-ě ж-ž з-z и-i ј-j ї-ji й-j к-k л-l љ-lj м-m н-n њ-nj о-o п-p р-r с-s т-t у-u ф-f х-h ц-c ч-č ш-š щ-šč ъ-ȯ ы-y ю-ju я-ja ё-e ѫ-ų ѧ-ę ћ-ć ѥ-je ꙑ-y',
  'isv_to_cyrillic': 'ń-нь nj-њ lj-љ ĺ-ль ľ-ль ć-ч ć-ч ć-ч ś-с ź-з ŕ-р t́-т ť-т d́-д ď-д đ-дж ò-о ȯ-о ė-е è-е č-ч š-ш ž-ж ě-є е̌-є ě-є å-а ę-е ų-у a-а b-б c-ц č-ч d-д e-е f-ф g-г h-х i-и j-ј k-к l-л m-м n-н o-о p-п r-р s-с š-ш t-т u-у v-в y-ы z-з ž-ж',
  'isv_to_slovianto': 'ć-č ś-s ź-z ŕ-r ĺ-l ľ-l ń-n t́-t ť-t d́-d ď-d đ-dž ȯ-o ò-o ė-e č-č š-š ž-ž ě-ě е̌-ě ě-e å-a ę-e ų-u y-i',
};

const nje_replacements = {
  'nje': 'нје',
  'nja': 'нја',
  'nij': 'ниј',
  'nju': 'нју',
  'njah': 'нјах',
  'njam': 'нјам',
  'njem': 'нјем',
  'njami': 'нјами'
};

function njeProblem(text) {
    const fragments = text.match(/\b\w+\b|\W+/g);
    const result = [];
      if (fragments) {
        fragments.forEach(s => {
            const regex = new RegExp(`(${Object.keys(nje_replacements).join('|')})$`, 'gi'); 
            s = s.replace(regex, match => nje_replacements[match]);                
            result.push(s);
        });
    }
    return result.join('');
}
function transliteracija(text, lang) {
  if (!(lang in transTables)) {
    return text;
  }
  text = njeProblem(text)
  const replaces = (transTables[lang] + " " + transTables[lang].toUpperCase()).split(' ');      
  for (const replace of replaces) {
    const [from, to] = replace.split('-');
    const regex = new RegExp(from, 'g');
    text = text.replace(regex, to);
  }
  return text;
}




document.addEventListener("DOMContentLoaded", function() {

  const inputText = document.getElementById('input-text');
  const pasteButton = document.getElementById('paste-button');
  const copyButton = document.getElementById('copy-button');
  const outputText = document.getElementById('output-text');

  pasteButton.addEventListener("click", function() {
    if (inputText.value != ""){
      inputText.value = ""; 
      outputText.value = ""; 
      pasteButton.textContent = "paste";
    }
    else {
      navigator.clipboard.readText().then(function(text) {
        if (text != ""){
          inputText.value = text; 
          outputText.value = transliteracija(text, languageSelect.value);
          pasteButton.textContent = "clear";
        }
        });
    }
  });

  copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(outputText.value);
  });

  inputText.addEventListener("input", function() {
    if (inputText.value != "") {
      pasteButton.textContent = "clear";
    } else {
      pasteButton.textContent = "paste";
    }
  });






  // function synchronizeScroll(scrollingElement) {
  //   var scrollTop = scrollingElement.scrollTop;
  //   var scrollHeight = scrollingElement.scrollHeight;
  //   var clientHeight = scrollingElement.clientHeight;
  //   var scrollPosition = (scrollTop / (scrollHeight - clientHeight)) * (scrollingElement === inputText ? outputText.scrollHeight - outputText.clientHeight : inputText.scrollHeight - inputText.clientHeight);


  //   if (scrollingElement === inputText) {
  //     outputText.scrollTop = scrollPosition;
  //   } 
  //   else {
  //     inputText.scrollTop = scrollPosition;
  //   }
  // }

  // inputText.addEventListener("scroll", function() {
  //   synchronizeScroll(inputText);
  // });

  // outputText.addEventListener("scroll", function() {
  //   synchronizeScroll(outputText);
  // });



  var isScrolling = false;

  function synchronizeScroll(scrollingElement) {
    if (!isScrolling) {
      isScrolling = true;
      
      var scrollTop = scrollingElement.scrollTop;
      var scrollHeight = scrollingElement.scrollHeight;
      var clientHeight = scrollingElement.clientHeight;
      var scrollPosition = (scrollTop / (scrollHeight - clientHeight)) * (scrollingElement === inputText ? outputText.scrollHeight - outputText.clientHeight : inputText.scrollHeight - inputText.clientHeight);

      if (scrollingElement === inputText) {
        outputText.scrollTop = scrollPosition;
      } else {
        inputText.scrollTop = scrollPosition;
      }
      
      isScrolling = false;
    }
  }

  inputText.addEventListener("scroll", function() {
    synchronizeScroll(inputText);
  });

  outputText.addEventListener("scroll", function() {
    synchronizeScroll(outputText);
  });




  const languageSelect = document.getElementById('language-select');

  let currentLanguage = languageSelect.value;
  let currentText = '';

  inputText.addEventListener('input', function() {
    currentText = inputText.value;
    outputText.value = transliteracija(currentText, languageSelect.value);
  });

  languageSelect.addEventListener('change', function() {
    currentText = inputText.value;
    outputText.value = transliteracija(currentText, languageSelect.value);
  });


});