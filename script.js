//+ variables for storing numbers
let oldNumber = 'not clear'; //a
let usedEqual = ''; //variable for storing operator info if equal gets used
let resetAfterEqual = 'false';
let lastOperator = ''; //stores last operator
let maxLength = 20; //max length of number that can be entered

//+ html calc elements
const decimal = document.getElementById('decimal');
const clear = document.getElementById('clear');
const equals = document.getElementById('equals');

//+ html icon elements
const root = document.documentElement;
const mode = document.getElementById('mode');

//+ dark mode
let modeToggle = 'dark';
mode.onclick = () => {
  if (modeToggle === 'dark') {
    root.style.setProperty('--theme-display-text', 'black');
    root.style.setProperty('--theme-history-text', 'rgba(0, 0, 0, 0.493)');
    root.style.setProperty('--theme-btn-color', 'black');
    root.style.setProperty('--theme-calculator', 'rgba(133, 115, 115, 0.164)');
    root.style.setProperty('--theme-display', 'rgba(255, 255, 255, 0.445)');
    root.style.setProperty('--theme-grid', 'rgba(255, 255, 255, 0.589)');
    root.style.setProperty(
      '--theme-operation-buttons',
      'rgba(255, 255, 255, 0.12)'
    );
    root.style.setProperty('--theme-equals', 'rgba(255, 255, 255, 0.3)');
    root.style.setProperty('--theme-equals-hover', 'rgba(255, 255, 255, 0.45)');
    modeToggle = 'light';
  } else {
    root.style.setProperty('--theme-display-text', 'white');
    root.style.setProperty(
      '--theme-history-text',
      'rgba(255, 255, 255, 0.493)'
    );
    root.style.setProperty('--theme-btn-color', 'white');
    root.style.setProperty('--theme-calculator', 'rgba(133, 115, 115, 0.164)');
    root.style.setProperty('--theme-display', 'rgba(0, 0, 0, 0.445)');
    root.style.setProperty('--theme-grid', 'rgba(0, 0, 0, 0.589)');
    root.style.setProperty('--theme-operation-buttons', 'rgba(0, 0, 0, 0.12)');
    root.style.setProperty('--theme-equals', 'rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--theme-equals-hover', 'rgba(0, 0, 0, 0.45)');
    modeToggle = 'dark';
  }
};

//+ wallpaper
const wallpaper = document.getElementById('wallpaper');
let wallpaperToggle = 'gradient';
wallpaper.onclick = () => {
  if (wallpaperToggle === 'gradient') {
    document.body.style.backgroundImage = 'url(photos/bg.jpeg)';
    wallpaperToggle = 'image';
  } else {
    document.body.style.backgroundImage = '';
    wallpaperToggle = 'gradient';
  }
};

//+ html display elements
const history = document.getElementById('history-text');
const current = document.getElementById('current-text');

//@ update the display
//! Number buttons
document.addEventListener('click', (e) => {
  if (e.target.matches('.numButton')) {
    if (resetAfterEqual === 'true') {
      clear.onclick();
      resetAfterEqual = 'false';
      current.innerHTML += e.target.innerHTML;
    } else if (current.innerHTML.length < maxLength) {
      current.innerHTML += e.target.innerHTML;
    }
  }
});

//@ decimal
decimal.onclick = () => {
  if (resetAfterEqual === 'true') {
    clear.onclick();
    resetAfterEqual = 'false';
    current.innerHTML += '.';
  } else if (
    !current.innerHTML.includes('.') &&
    current.innerHTML.length < maxLength - 1
  ) {
    current.innerHTML += '.';
  }
};

//@ clear button
clear.onclick = () => {
  current.innerHTML = '';
  history.innerHTML = '';
  oldNumber = 'not clear';
  usedEqual = '';
  lastOperator = '';
  resetAfterEqual = 'false';
};

//+ check for operators already used
let checkOperators = () => {
  if (
    !(whichOperator() === '+') &&
    !(whichOperator() === '-') &&
    !(whichOperator() === '*') &&
    !(whichOperator() === '/')
  ) {
    return true;
  }
};

//+ find which operator is being used
let whichOperator = () => {
  if (history.innerHTML.includes('+')) {
    lastOperator = '+';
  } else if (history.innerHTML.includes('-')) {
    lastOperator = '-';
  } else if (history.innerHTML.includes('*')) {
    lastOperator = '*';
  } else if (history.innerHTML.includes('/')) {
    lastOperator = '/';
  }
};

//+ function to auto run right operation on any operation click
let rightOperation = () => {
  if (lastOperator === '-') {
    operate('-', subtract);
  } else if (lastOperator === '+') {
    operate('+', add);
  } else if (lastOperator === '*') {
    operate('*', multiply);
  } else if (lastOperator === '/') {
    operate('/', divide);
  }
};

//!operation buttons
document.addEventListener('click', (e) => {
  if (e.target.matches('.opButton')) {
    if (
      e.target.id === 'add' ||
      e.target.id === 'divide' ||
      e.target.id === 'multiply'
    ) {
      if (
        Number.isFinite(Number(current.innerHTML)) &&
        current.innerHTML !== ''
      ) {
        resetAfterEqual = 'false';
        operate(e.target.innerHTML, eval(e.target.id)); // could also use window[e.target.id]
        lastOperator = e.target.innerHTML;
      }
    } else {
      if (
        (history.innerHTML === '' && current.innerHTML === '') ||
        (history.innerHTML.includes('+') && current.innerHTML === '') ||
        (history.innerHTML.includes('*') && current.innerHTML === '') ||
        (history.innerHTML.includes('/') && current.innerHTML === '') ||
        (history.innerHTML.includes('-') && current.innerHTML === '')
      ) {
        current.innerHTML += '-';
      } else if (current.innerHTML === '-') {
        current.innerHTML = '';
      } else {
        resetAfterEqual = 'false';
        operate('-', subtract);
        lastOperator = '-';
      }
    }
  }
});

//! function to perform any operation
let operate = (sym, func) => {
  if (
    !(lastOperator === sym) &&
    history.innerHTML !== 'history' &&
    oldNumber !== 'not clear'
  ) {
    rightOperation();
    history.innerHTML = oldNumber + ' ' + sym;
    console.log('finished original operation');
  } else if (
    (whichOperator() === sym && current.innerHTML !== '') ||
    (!history.innerHTML == '' &&
      checkOperators() === true &&
      !current.innerHTML == '')
  ) {
    let result = func(oldNumber, current.innerHTML);
    oldNumber = result;
    current.innerHTML = '';
    history.innerHTML = oldNumber + ' ' + sym;
    usedEqual = oldNumber;
    console.log('used equal or same operator, or first operation');
  } else if (oldNumber == 'not clear') {
    oldNumber = current.innerHTML;
    history.innerHTML = current.innerHTML + ' ' + sym;
    current.innerHTML = '';
    console.log('force clear');
  } else if (history.innerHTML == '' && !current.innerHTML == '') {
    history.innerHTML = current.innerHTML + ' ' + sym;
    current.innerHTML = '';
    console.log('pressed operation after equal');
  }
};

//! equals
equals.onclick = () => {
  if (
    history.innerHTML.includes(lastOperator) &&
    Number.isFinite(Number(current.innerHTML)) &&
    current.innerHTML !== ''
  ) {
    resetAfterEqual = 'false';
    rightOperation();
    history.innerHTML = '';
    current.innerHTML = usedEqual;
    resetAfterEqual = 'true';
  }
};

//! operations
const add = (a, b) => {
  let int1 = parseFloat(a);
  let int2 = parseFloat(b);
  return parseFloat((int1 + int2).toFixed(2));
};

const subtract = (a, b) => {
  let int1 = parseFloat(a);
  let int2 = parseFloat(b);
  return parseFloat((int1 - int2).toFixed(2));
};

const multiply = (a, b) => {
  let int1 = parseFloat(a);
  let int2 = parseFloat(b);
  return parseFloat((int1 * int2).toFixed(2));
};

const divide = (a, b) => {
  let int1 = parseFloat(a);
  let int2 = parseFloat(b);
  return parseFloat((int1 / int2).toFixed(2));
};
