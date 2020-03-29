function ready() {
  class ViewKeyboard {
    constructor(container) {
      this._container = container;
      this._keybordModal = null;
      this._keyBoard = null;
    }

    set modal(mod) {
      this._keybordModal = mod;
    }

    set keyBoard(elem) {
      this._keyBoard = elem;
    }

    get keyBoard() {
      return this._keyBoard;
    }

    buildView() {
      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      this._container.append(wrap);
      const textArea = document.createElement('textarea');
      textArea.cols = 60;
      textArea.rows = 6;
      textArea.classList.add('result');
      wrap.append(textArea);
      this.keyBoard = document.createElement('div');
      this.keyBoard.classList.add('keyboard');
      wrap.append(this.keyBoard);
      const {setOfLangs, curLang, langCase} = this._keybordModal;
      const langArr = setOfLangs[`${langCase}${curLang}`];
      this.buildRows(langArr, this.keyBoard);
    }

    buildRows(arr, field) {
      arr.forEach(elem => {
        const row = document.createElement('div');
        row.classList.add('row');
        field.append(row);
        elem.forEach(elem => {
          let key = document.createElement('div');
          key.classList.add('key');
          key.classList.add(`key-${elem.toLowerCase()}`);
          if (elem.length > 1) {
            key.classList.add(`${elem.toLowerCase()}`);
          }
          key.append(elem);
          row.append(key);
        })
      });
    }

    update() {
      const {setOfLangs, curLang, langCase} = this._keybordModal;
      const langArr = setOfLangs[`${langCase}${curLang}`];
      this.buildRows(langArr, this.keyBoard);
    }
  }

  class ModalKeyboard {
    constructor() {
      this._totalLangs = ['Ru', 'En'];
      this._caseLangs = ['low', 'up'];
      this._curLang = 'En';
      this._langCase = 'low';
      this._langsSet = {
        lowRu: [
          ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
          ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
          ['CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
          ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '\\', 'Shift'],
          ['Ctrl', 'Alt', 'Space']
        ],
        upRu: [
          ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace'],
          ['Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
          ['CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Enter'],
          ['Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', '/', 'Shift'],
          ['Ctrl', 'Alt', 'Space']
        ],
        lowEn: [
          ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
          ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
          ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
          ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', 'Shift'],
          ['Ctrl', 'Alt', 'Space']
        ],
        upEn: [
          ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
          ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}'],
          ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
          ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '|', 'Shift'],
          ['Ctrl', 'Alt', 'Space']
        ]
      };
      this.keybordControls = null;
    }

    get setOfLangs() {
      return this._langsSet;
    }

    get curLang() {
      return this._curLang;
    }

    get totalLangs() {
      return this._totalLangs;
    }

    get langCase() {
      return this._langCase;
    }


  }

  class ControlsKeyboard {
    constructor(field, modal) {
      this._field = field;
      this.keyModal = modal;
      this.setHandler();
    }

    get field() {
      return this._field;
    }

    setHandler() {
      this.field.addEventListener('keydown', this.keydownHandler);
      this.field.addEventListener('keyup', this.keyupHandler);
    }

    keydownHandler(e) {
      e.preventDefault();
      console.log(e);
    }

    keyupHandler(e) {
      e.preventDefault();
      console.log(e);
    }


  }
  const body = document.body;


  const view = new ViewKeyboard(body);
  const modal = new ModalKeyboard();
  const controls = new ControlsKeyboard(document, modal);

  view.modal = modal;
  view.buildView();
}

document.addEventListener('DOMContentLoaded', ready);
