function ready() {
  class ViewKeyboard {
    private _container: HTMLElement;
    private _keyboardModal: ModalKeyboard;
    private _keyBoard: HTMLElement;
    private _textElem: HTMLTextAreaElement | HTMLInputElement;

    constructor(container: HTMLElement) {
      this._container = container;
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

    set textElem(elem: HTMLTextAreaElement | HTMLInputElement) {
      this._textElem = elem;
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
      const {setOfLangs, curLang, langCase} = this._keyboardModal;
      const langArr: string[][] = setOfLangs[`${langCase}${curLang}`];
      this.buildRows(langArr, this.keyBoard);
    }

    buildRows(arr: string[][], field: HTMLElement) {
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

    updateText() {
      this._textElem.value = this.keyboardModal.textValue;
    }

    update() {
      const {setOfLangs, curLang, langCase} = this._keyboardModal;
      const langArr = setOfLangs[`${langCase}${curLang}`];
      this.buildRows(langArr, this.keyBoard);
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

    constructor(view: ViewKeyboard) {
      this._keyboardView = view;
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

    }

    get keyboardView() {
      return  this._keyboardView;
    }

    get textValue() {
      return this._textValue;
    }

    get setOfLangs():ILangsSet {
      return this._langsSet;
    }

    get curLang():string {
      return this._curLang;
    }

    get totalLangs() {
      return this._totalLangs;
    }

    get langCase():string {
      return this._langCase;
    }

    set textValue(value:string) {
      if (value.length > 1) {
        if (this[value]) this[value]();
      }
      else this.addSymbol(value);
    }

    backspace():void {
      if (this._textValue.length === 0) {
        return;
      }
      this._textValue = this._textValue.slice(0, this._textValue.length - 1);
      this._keyboardView.updateText();
    }

    space() {
      this._textValue += ' ';
      this._keyboardView.updateText();
    }

    tab() {
      this._textValue += '    ';
      this._keyboardView.updateText();
    }

    enter() {
      this._textValue += '\n';
      this._keyboardView.updateText();
    }

    addSymbol(value:string):void {
      const newVal = this._langCase === 'low' ? value.toLowerCase() : value.toUpperCase();
      this._textValue += newVal;
      this._keyboardView.updateText();
    }

  }

  class ControlsKeyboard {

    private _field:Document | HTMLElement;
    private _keyboardModal:ModalKeyboard;


    constructor(field:Document | HTMLElement, modal:ModalKeyboard) {
      this._field = field;
      this._keyboardModal = modal;
      this.setHandler();
    }

    get keyboardModal() {
      return this._keyboardModal;
    }

    get field():Document | HTMLElement {
      return this._field;
    }

    setHandler():void {
      this.field.addEventListener('keydown', this.keydownHandler);
      this.field.addEventListener('keyup', this.keyupHandler);
      this.field.addEventListener('click', this.clickHandler);
    }

    keydownHandler = (e: KeyboardEvent):void => {
      e.preventDefault();
      const {key} = e;
      this.keyboardModal.textValue = key.toLowerCase();
    }

    keyupHandler = (e: KeyboardEvent):void => {
      e.preventDefault();
      // console.log(e);
    }

    clickHandler = (e: MouseEvent) => {
      console.log((e.target as HTMLElement).classList.contains('key'));
    }
  }
  const body = document.body;


  const view = new ViewKeyboard(body);
  const modal = new ModalKeyboard(view);
  const controls = new ControlsKeyboard(document, modal);

  view.keyboardModal = modal;
  view.buildView();
  view.textElem = document.querySelector('.result');

}

document.addEventListener('DOMContentLoaded', ready);
