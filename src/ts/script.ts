function ready() {
  class ViewKeyboard {
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
    private _keyLangChange: string[] = ['alt', 'ctrl'];
    private _keyPressed = new Set();

    constructor() {
      this._langsSet = {
        lowRu: [
          ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
          ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
          ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
          ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '\\']
        ],
        upRu: [
          ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+'],
          ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
          ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
          ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', '/']
        ],
        lowEn: [
          ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
          ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
          ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\']
        ],
        upEn: [
          ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '|']
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
      const that = this;
      const startPos = that.coretStartPos ;
      const actions = {
        backspace() {
          that.lastCorPos =  startPos - 1;
          that.textValue = that.textValue.slice(0, that.lastCorPos).concat(that.textValue.slice(startPos , that.textValue.length));
        },
        delete() {
          that.lastCorPos = startPos;
          that.textValue = that.textValue.slice(0, that.lastCorPos).concat(that.textValue.slice(startPos + 1, that.textValue.length));
        },
        default() {
          that.lastCorPos = startPos + key.length;
          that.textValue = that.textValue.slice(0, startPos).concat(key, that.textValue.slice(startPos, that.textValue.length));
        }
      };
      if (actions[key]) {
        actions[key]();
      } else {
        actions['default']();
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
      const options = {
        low(value:string):string {
          return value.toLowerCase();
        },
        up(value:string):string {
          return value.toUpperCase();
        }
      };
      const newVal = options[this.langCase](value);
      this.changeInputValue(newVal);
    }

    animateKey(elem:HTMLElement, option) {
      const that = this;
      const options = {
        add(elem) {
          that.keyboardView.addAnimateKey(elem);
        },
        del(elem) {
          that.keyboardView.delAnimateKey(elem);
        }
      };
      if (options[option]) {
        options[option](elem);
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
      const keyElem:HTMLElement = document.querySelector(`.key-${code.toLowerCase()}`);
      if (key === 'Shift' && e.repeat) {
        return;
      }
      this.keyboardModal.changeTextValue = keyElem.textContent.toLowerCase();
      this.keyboardModal.animateKey(keyElem, 'add');
    }

    keyupHandler = (e: KeyboardEvent):void => {
      e.preventDefault();
      const {key, code} = e;
      const keyElem:HTMLElement = document.querySelector(`.key-${code.toLowerCase()}`);
      if (key === 'Shift') {
        this.keyboardModal.changeTextValue = keyElem.textContent.toLowerCase();
      }
      this.keyboardModal.deleteChangeKeys(keyElem.textContent.toLowerCase());
      this.keyboardModal.animateKey(keyElem, 'del');
    }

    mousedownHandler = (e: MouseEvent) => {
      const {textContent, classList} = (e.target as HTMLElement);
      if (classList.contains('key')) {
        this.keyboardModal.changeTextValue = textContent.toLowerCase();
        this.keyboardModal.animateKey((e.target as HTMLElement), 'add');
      }
    }

    mouseupHandler = (e: MouseEvent) => {
      const {textContent, classList} = (e.target as HTMLElement);
      if (textContent === 'Shift') {
        this.keyboardModal.changeTextValue = textContent.toLowerCase();
      }
      if (classList.contains('key')) {
        this.keyboardModal.deleteChangeKeys(textContent.toLowerCase());
        this.keyboardModal.animateKey((e.target as HTMLElement), 'del');
      }
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
