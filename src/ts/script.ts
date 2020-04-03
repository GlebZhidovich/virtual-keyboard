function ready() {
  class ViewKeyboard {
    private _container: HTMLElement;
    private _keyboardModal: ModalKeyboard;
    private _keyBoard: HTMLElement;
    private _inputElem: HTMLTextAreaElement | HTMLInputElement;

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

    buildView() {
      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      this.container.append(wrap);
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
      this.buildRows(langArr, this.keyBoard);
      textArea.focus();
    }

    buildRows(arr: string[][], field: HTMLElement) {
      const arrowSet = {
        'ArrowLeft': '←',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowRight': '→'
      };
      const classSet = [
          ['backquote', 'digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6', 'digit7', 'digit8', 'digit9', 'digit0', 'minus', 'equal', 'backspace'],
          ['tab', 'keyq', 'keyw', 'keye', 'keyr', 'keyt', 'keyy', 'keyu', 'keyi', 'keyo', 'keyp', 'bracketleft', 'bracketright', 'delete'],
          ['capslock', 'keya', 'keys', 'keyd', 'keyf', 'keyg', 'keyh', 'keyj', 'keyk', 'keyl', 'semicolon', 'quote', 'enter'],
          ['shiftleft', 'keyz', 'keyx', 'keyc', 'keyv', 'keyb', 'keyn', 'keym', 'comma', 'period', 'slash', 'backslash', 'arrowup', 'shiftright'],
          ['ctrlleft', 'altleft', 'space', 'altright','arrowleft', 'arrowdown', 'arrowright', 'ctrlright']
        ];

      arr.forEach((elem, i) => {
        const classRow = classSet[i];
        const row = document.createElement('div');
        row.classList.add('row');
        field.append(row);
        elem.forEach((elem, i) => {
          const nameClass = classRow[i];
          let key = document.createElement('div');
          key.classList.add('key');
          key.classList.add(`key-${nameClass}`);
          if (arrowSet[elem]) {
            key.append(arrowSet[elem]);
          } else {
            key.append(elem);
          }

          row.append(key);
        })
      });
    }

    updateText() {
      this.inputElem.value = this.keyboardModal.textValue;
      this.updateCorPos();
    }

    updateCorPos() {
      const {keyboardModal, inputElem} = this;
      if (inputElem.selectionEnd - keyboardModal.lastCorPos > 0) {
        inputElem.selectionEnd = keyboardModal.lastCorPos;
      } else {
        inputElem.selectionStart = keyboardModal.lastCorPos;
      }
    }

    update() {
      const {setOfLangs, curLang, langCase} = this._keyboardModal;
      const langArr = setOfLangs[`${langCase}${curLang}`];
      this.keyBoard.innerHTML = '';
      this.buildRows(langArr, this.keyBoard);
    }

    addAnimateKey(key) {
      const pressKey = document.querySelector(`.key_${key}`);
      console.log(pressKey);
    }

    delAnimateKey(key) {
      const pressKey = document.querySelector(`.active-key`);
      console.log(pressKey);
    }

  }

  interface ILangsSet {
    [lowRu:string]: string[][];
    upEn: string[][];
    upRu: string[][];
    lowEn: string[][]
  }

  class ModalKeyboard {
    private _langsSet: ILangsSet;
    private _totalLangs = ['Ru', 'En'];
    private _caseLangs = ['low', 'up'];
    private _curLang = 'En';
    private _langCase = 'low';
    private _keyboardView: ViewKeyboard;
    private _textValue = '';
    private _lastCorPos: number;
    private _keyLangChange: string[] = ['alt', 'control'];
    private _keyPressed = new Set();

    constructor() {
      this._langsSet = {
        lowRu: [
          ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
          ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'Delete'],
          ['CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
          ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '\\', 'ArrowUp', 'Shift'],
          ['Ctrl', 'Alt', 'Space', 'Alt','ArrowLeft', 'ArrowDown', 'ArrowRight', 'Ctrl']
        ],
        upRu: [
          ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace'],
          ['Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Delete'],
          ['CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Enter'],
          ['Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', '/', 'ArrowUp', 'Shift'],
          ['Ctrl', 'Alt', 'Space', 'Alt','ArrowLeft', 'ArrowDown', 'ArrowRight', 'Ctrl']
        ],
        lowEn: [
          ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
          ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Delete'],
          ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
          ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', 'ArrowUp', 'Shift'],
          ['Ctrl', 'Alt', 'Space', 'Alt','ArrowLeft', 'ArrowDown', 'ArrowRight', 'Ctrl']
        ],
        upEn: [
          ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
          ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', 'Delete'],
          ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
          ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '|', 'ArrowUp', 'Shift'],
          ['Ctrl', 'Alt', 'Space', 'Alt','ArrowLeft', 'ArrowDown', 'ArrowRight', 'Ctrl']
        ]
      };

    }

    get keyPressed() {
      return this._keyPressed;
    }

    get keyLangChange() {
      return this._keyLangChange;
    }

    get caseLangs() {
      return this._caseLangs;
    }

    get lastCorPos() {
      return this._lastCorPos;
    }

    set lastCorPos(num) {
      this._lastCorPos = num;
    }

    get keyboardView() {
      return  this._keyboardView;
    }

    set keyboardView(view: ViewKeyboard) {
      this._keyboardView = view;
    }

    get textValue() {
      return this._textValue;
    }

    set textValue(val) {
      this._textValue = val;
    }

    get setOfLangs():ILangsSet {
      return this._langsSet;
    }

    get curLang():string {
      return this._curLang;
    }

    set curLang(lang:string) {
      this._curLang = lang;
    }

    get totalLangs() {
      return this._totalLangs;
    }

    get langCase():string {
      return this._langCase;
    }

    set langCase(val:string) {
      this._langCase = val;
    }

    set changeTextValue(value:string) {
      this.keyboardView.inputElem.focus();
      if (value.length > 1) {
        if (this[value]) this[value]();
        else {
          this.langChange(value);
        }
      }
      else this.addSymbol(value);
      this.keyboardView.updateText();
    }

    get coretStartPos ():number {
      const {inputElem} = this.keyboardView;
      return inputElem.selectionStart;
    }

    get coretEndPos ():number {
      const {inputElem} = this.keyboardView;
      return inputElem.selectionEnd;
    }

    setCoretPos (num: number) {
      if (this.coretEndPos === 0 && num === -1) {
        return;
      }
      this.lastCorPos = this.coretEndPos + num;
    }

    changeInputValue(key) {
      const startPos = this.coretStartPos ;
      if (key === 'backspace') {
        this.lastCorPos =  startPos - 1;
        this.textValue = this.textValue.slice(0, this.lastCorPos).concat(this.textValue.slice(startPos , this.textValue.length));
      } else if (key === 'delete') {
        this.lastCorPos = startPos;
        this.textValue = this.textValue.slice(0, this.lastCorPos).concat(this.textValue.slice(startPos + 1, this.textValue.length));
      } else {
        this.lastCorPos = startPos + key.length;
        this.textValue = this.textValue.slice(0, startPos).concat(key, this.textValue.slice(startPos, this.textValue.length));
      }
      this.keyboardView.updateText();
    }

    arrowleft() {
      this.setCoretPos(-1);
      this.keyboardView.updateText();
    }

    arrowright() {
      this.setCoretPos(1);
      this.keyboardView.updateText();
    }

    arrowdown() {
      this.setCoretPos(-1);
      this.keyboardView.updateText();
    }

    arrowup() {
      this.setCoretPos(1);
      this.keyboardView.updateText();
    }

    backspace():void {
      this.changeInputValue('backspace');
    }

    delete():void {
      this.changeInputValue('delete');
    }

    capslock():void {
      const idxCase = this.caseLangs.indexOf(this.langCase) + 1 === this.caseLangs.length ? 0 : this.caseLangs.indexOf(this.langCase) + 1;
      this.langCase = this.caseLangs[idxCase];
      this.lastCorPos = this.coretStartPos;
      this.keyboardView.update();
    }

    langChange(key):void {
      this.keyPressed.add(key);
      for (let code of this.keyLangChange) {
        if (!this.keyPressed.has(code)) {
          return;
        }
      }
      const idxCase = this.totalLangs.indexOf(this.curLang) + 1 === this.totalLangs.length ? 0 : this.totalLangs.indexOf(this.curLang) + 1;
      this.curLang = this.totalLangs[idxCase];
      this.lastCorPos = this.coretStartPos;
      this.keyboardView.update();
    }

    deleteChangeKeys(key) {
      if (this.keyPressed.has(key)) {
          this.keyPressed.delete(key);
      }
    }

    shift():void {
      this.capslock();
    }

    space(): void {
      this.changeInputValue(' ');
    }

    tab(): void {
      this.changeInputValue('    ');
    }

    enter(): void {
      this.changeInputValue('\n');
    }

    addSymbol(value:string):void {
      const newVal = this._langCase === 'low' ? value.toLowerCase() : value.toUpperCase();
      this.changeInputValue(newVal);
    }

    animateKey(key, option) {
      const pressKey = document.querySelector(`.key_${key}`);
      console.log(pressKey);
      if (option === 'add' && pressKey) {
          pressKey.classList.add('active-key');
      } else if (option === 'del' && pressKey) {
          pressKey.classList.remove('active-key');
      }
    }

  }

  class ControlsKeyboard {
    private _field:Document | HTMLElement;
    private _keyboardModal:ModalKeyboard;

    constructor() {
    }

    get keyboardModal() {
      return this._keyboardModal;
    }

    set keyboardModal(modal: ModalKeyboard) {
      this._keyboardModal = modal;
    }

    get field():Document | HTMLElement {
      return this._field;
    }

    set field(field: Document | HTMLElement) {
      this._field = field;
      this.setHandler();
    }

    setHandler():void {
      this.field.addEventListener('keydown', this.keydownHandler);
      this.field.addEventListener('keyup', this.keyupHandler);
      this.field.addEventListener('mousedown', this.mousedownHandler);
      this.field.addEventListener('mouseup', this.mouseupHandler);
    }

    keydownHandler = (e: KeyboardEvent):void => {
      e.preventDefault();
      const {key, code} = e;
      console.log(e);
      if (key === 'Shift' && e.repeat) {
        return;
      }
      this.keyboardModal.changeTextValue = key.toLowerCase();
      this.keyboardModal.animateKey(key.toLowerCase(), 'add');
    }

    keyupHandler = (e: KeyboardEvent):void => {
      e.preventDefault();
      const {key} = e;
      if (key === 'Shift') {
        this.keyboardModal.changeTextValue = key.toLowerCase();
      }
      this.keyboardModal.deleteChangeKeys(key.toLowerCase());
      this.keyboardModal.animateKey(key.toLowerCase(), 'del');
    }

    mousedownHandler = (e: MouseEvent) => {
      const classSet = {
        'ShiftRight': 'Shift',
        'ShiftLeft': 'Shift',
        'CtrlLeft': 'Ctrl',
        'AltLeft': 'Alt',
        'AltRight': 'Alt',
        'CtrlRight': 'Ctrl',
      };
      const {innerText, classList} = (e.target as HTMLElement);
      if (classList.contains('key')) {
        console.log((e.target as HTMLElement).innerText);
        this.keyboardModal.changeTextValue = innerText.toLowerCase();
        this.keyboardModal.animateKey(innerText.toLowerCase(), 'add');
      }
    }

    mouseupHandler = (e: MouseEvent) => {
      console.log((e.target as HTMLElement).classList.contains('key'));
      const {innerText} = (e.target as HTMLElement);
      if (innerText === 'Shift') {
        this.keyboardModal.changeTextValue = innerText.toLowerCase();
      }
      this.keyboardModal.deleteChangeKeys(innerText.toLowerCase());
      this.keyboardModal.animateKey(innerText.toLowerCase(), 'del');
    }

  }
  const body = document.body;

  const view = new ViewKeyboard();
  view.container = body;
  const modal = new ModalKeyboard();
  modal.keyboardView = view;
  const controls = new ControlsKeyboard();
  controls.keyboardModal = modal;
  controls.field = document;

  view.keyboardModal = modal;
  view.buildView();
  view.inputElem = document.querySelector('.result');

}

document.addEventListener('DOMContentLoaded', ready);
