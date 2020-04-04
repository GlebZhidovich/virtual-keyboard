// eslint-disable-next-line no-unused-vars
import ModalKeyboard from './modal';

export default class ViewKeyboard {
  private _container: HTMLElement;
  private _keyboardModal: ModalKeyboard;
  private _keyBoard: HTMLElement;
  private _inputElem: HTMLTextAreaElement | HTMLInputElement;
  private classSet = [
    ['backquote', 'digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6', 'digit7', 'digit8', 'digit9', 'digit0', 'minus', 'equal'],
    ['keyq', 'keyw', 'keye', 'keyr', 'keyt', 'keyy', 'keyu', 'keyi', 'keyo', 'keyp', 'bracketleft', 'bracketright'],
    ['keya', 'keys', 'keyd', 'keyf', 'keyg', 'keyh', 'keyj', 'keyk', 'keyl', 'semicolon', 'quote'],
    ['keyz', 'keyx', 'keyc', 'keyv', 'keyb', 'keyn', 'keym', 'comma', 'period', 'slash', 'backslash']
  ];

  constructor() {
  }

  get container() {
    return this._container;
  }

  set container(cont: HTMLElement) {
    this._container = cont;
  }

  get keyBoard() {
    return this._keyBoard;
  }

  get keyboardModal(): ModalKeyboard {
    return this._keyboardModal;
  }

  set keyboardModal(mod:ModalKeyboard) {
    this._keyboardModal = mod;
  }

  set keyBoard(elem) {
    this._keyBoard = elem;
  }

  get inputElem() {
    return  this._inputElem;
  }
  set inputElem(elem: HTMLTextAreaElement | HTMLInputElement) {
    this._inputElem = elem;
  }

  buildView():void {
    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    this.container.append(wrap);
    const description = document.createElement('div');
    description.classList.add('description');
    const shortcut = document.createElement('p');
    shortcut.textContent = 'Ctrl+Alt switch language';
    description.append(shortcut);
    const system = document.createElement('p');
    system.textContent = 'Make keyboard on Windows';
    description.append(system);
    wrap.append(description);
    const textArea = document.createElement('textarea');
    textArea.cols = 60;
    textArea.rows = 6;
    textArea.classList.add('result');
    wrap.append(textArea);
    this.keyBoard = document.createElement('div');
    this.keyBoard.classList.add('keyboard');
    wrap.append(this.keyBoard);
    const {setOfLangs, curLang, langCase} = this._keyboardModal;
    const langArr: string[][] = setOfLangs[`${langCase}${curLang}`];
    this.buildKeyboard(langArr, this.keyBoard);
    this.buildBorRow(this.keyBoard);
    textArea.focus();
  }

  buildBorRow(field: HTMLElement) {
    const bottomKeyboard = ['Ctrl', 'Alt', 'Space', 'Alt', '←', '↓', '→', 'Ctrl'];
    const bottomClasses = ['controlleft', 'altleft', 'space', 'altright','arrowleft', 'arrowdown', 'arrowright', 'controlright'];
    const row = document.createElement('div');
    row.classList.add('row');
    bottomKeyboard.forEach((elem, i) => {
      let key = document.createElement('div');
      key.classList.add('key');
      key.classList.add(`key-${bottomClasses[i]}`);
      key.append(elem);
      row.append(key);
    });
    field.append(row);
  }

  buildKeyboard(arr: string[][], field: HTMLElement):void {
    arr.forEach((elem, index) => {
      const classRow = this.classSet[index];
      const row = document.createElement('div');
      const rowKey = document.createElement('div');
      row.classList.add('row');
      rowKey.classList.add('change-key');
      field.append(row);
      elem.forEach((elem, i) => {
        const nameClass = classRow[i];
        let key = document.createElement('div');
        key.classList.add('key');
        key.classList.add(`key-${nameClass}`);
        key.append(elem);
        rowKey.append(key);
        row.append(rowKey);
      });
      this.buildMainBut(row, index);
    });
  }

  buildMainBut(field, index) {
    const mainButClass = [
      ['backspace'],
      ['tab', 'delete'],
      ['capslock', 'enter'],
      ['shiftleft', 'arrowup', 'shiftright']
    ];
    const mainBut = [
      ['Backspace'],
      ['Tab', 'Delete'],
      ['CapsLock', 'Enter'],
      ['Shift', '↑', 'Shift']
    ];

    mainBut[index].forEach((elem, i) => {
      const button = document.createElement('div');
      button.classList.add('key');
      button.append(elem);
      button.classList.add(`key-${mainButClass[index][i]}`);
      if (i === 0 && elem !== 'Backspace') {
        field.prepend(button);
      } else {
        field.append(button);
      }
    })
  }

  updateText():void {
    this.inputElem.value = this.keyboardModal.textValue;
    this.updateCorPos();
  }

  updateCorPos():void {
    const {keyboardModal, inputElem} = this;
    if (inputElem.selectionEnd - keyboardModal.lastCorPos > 0) {
      inputElem.selectionEnd = keyboardModal.lastCorPos;
    } else {
      inputElem.selectionStart = keyboardModal.lastCorPos;
    }
  }

  update():void {
    const {setOfLangs, curLang, langCase} = this._keyboardModal;
    const langArr = setOfLangs[`${langCase}${curLang}`];
    this.changeKeys(langArr);
  }

  changeKeys(arr: string[][]):void {
    const rows = document.querySelectorAll('.change-key');
    rows.forEach((elem, i) => {
      elem.innerHTML = '';
      arr[i].forEach((el, idx) => {
        const button = document.createElement('div');
        button.classList.add('key');
        button.append(el);
        button.classList.add(`key-${this.classSet[i][idx]}`);
        elem.append(button);
      })
    })
  }

  addAnimateKey(elem:HTMLElement):void {
    elem.classList.add('active-key');
  }

  delAnimateKey(elem:HTMLElement):void {
    elem.classList.remove('active-key');
  }
}
