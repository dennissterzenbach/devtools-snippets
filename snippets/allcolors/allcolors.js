// allcolors.js
// https://github.com/bgrins/devtools-snippets
// Print out CSS colors used in elements on the page.

(function () {
  // Should include colors from elements that have a border color but have a zero width?
  var includeBorderColorsWithZeroWidth = false;

  var allColors = {};
  var props = ["background-color", "color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"];
  var skipColors = {
    "rgb(0, 0, 0)": 1,
    "rgba(0, 0, 0, 0)": 1,
    "rgb(255, 255, 255)": 1
  };

  [].forEach.call(document.querySelectorAll("*"), function (node) {
    var nodeColors = {};
    props.forEach(function (prop) {
      var color = window.getComputedStyle(node, null).getPropertyValue(prop),
        thisIsABorderProperty = (prop.indexOf("border") != -1),
        notBorderZero = thisIsABorderProperty ? window.getComputedStyle(node, null).getPropertyValue(prop.replace("color", "width")) !== "0px" : true,
        colorConditionsMet;

      if (includeBorderColorsWithZeroWidth) {
        colorConditionsMet = color && !skipColors[color];
      } else {
        colorConditionsMet = color && !skipColors[color] && notBorderZero;
      }

      if (colorConditionsMet) {
        if (!allColors[color]) {
          allColors[color] = {
            count: 0,
            nodes: []
          };
        }

        if (!nodeColors[color]) {
          allColors[color].count++;
          allColors[color].nodes.push(node);
        }

        nodeColors[color] = true;
      }
    });
  });

  function rgbTextToRgbArray(rgbText) {
    return rgbText.replace(/\s/g, "").match(/\d+,\d+,\d+/)[0].split(",").map(function(num) {
      return parseInt(num, 10);
    });
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(rgbArray) {
    var r = rgbArray[0],
      g = rgbArray[1],
      b = rgbArray[2];
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  var allColorsSorted = [];
  for (var i in allColors) {
    var rgbArray = rgbTextToRgbArray(i);
    var hexValue = rgbToHex(rgbArray);

    allColorsSorted.push({
      key: i,
      value: allColors[i],
      hexValue: hexValue
    });
  }

  allColorsSorted = allColorsSorted.sort(function (a, b) {
    return b.value.count - a.value.count;
  });

  var nameStyle = "font-weight:normal;";
  var countStyle = "font-weight:bold;";
  function colorStyle(color) {
    return "background:" + color + ";color:" + color + ";border:1px solid #333;";
  };

  console.group("Total colors used in elements on the page: " + window.location.href + " are " + allColorsSorted.length);
  allColorsSorted.forEach(function (c) {
    console.groupCollapsed("%c    %c " + c.key + " " + c.hexValue + " %c(" + c.value.count + " times)",
      colorStyle(c.key), nameStyle, countStyle);
    c.value.nodes.forEach(function (node) {
      console.log(node);
    });
    console.groupEnd();
  });
  console.groupEnd("All colors used in elements on the page");

  function createColorOverview(colors) {
    let overviewElem = document.createDocumentFragment();
    let listElem = document.createElement('ul');
    listElem.classList.add('colorsUsed');

    let styleElem = document.createElement('style');
    styleElem.textContent = `.colorsUsed {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        display: flex;
        flex-flow: row wrap;
        padding: 1rem;
        opacity: 0.99;
        background: #777;
    } 
    .colorsUsed .colorItem {
        display: block;
        flex: 0 0 80px;
        height: 80px;
        width: 80px;
        margin: 5px;
        outline: 1px solid #000;
        border: 1px solid #dadada;
        font: console;
    }
    .colorsUsed .colorItem span {
        mix-blend-mode: color-burn;
        color: #000;
        font-size: 16px;
        padding: 4px;
        display: inline-block;
        font-family: monospace;
    }`;

    colors.forEach(color => {
        let singleColor = document.createElement('li');
        let span = document.createElement('span');
        singleColor.classList.add('colorItem');
        singleColor.style.background = span.textContent = color.key;
        singleColor.appendChild(span);
        listElem.appendChild(singleColor);
    });

    overviewElem.appendChild(listElem);
    overviewElem.appendChild(styleElem);

    document.body.appendChild(overviewElem);
  }
})();
