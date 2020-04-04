// eslint-disable-next-line no-unused-vars
import ViewKeyboard from './view';

interface ILangsSet {
  [lowRu:string]: string[][];
  upEn: string[][];
  upRu: string[][];
  lowEn: string[][]
}

export default class ModalKeyboard {
  private _langsSet: ILangsSet;
  private _totalLangs = ['Ru', 'En'];
  private _caseLangs = ['low', 'up'];
  private _curLang;
  private _langCase = 'low';
  private _keyboardView: ViewKeyboard;
  private _textValue = '';
  private _lastCorPos: number;
  private _keyLangChange: string[] = ['alt', 'ctrl'];
  private _keyPressed = new Set();

  constructor() {
    this.curLang = this.fromStorage();
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
  this.saveLang(this.curLang);
  this.keyboardView.update();
  }

  saveLang(value):void {
    localStorage.setItem('lang', value);
  }

  fromStorage():string {
    if (localStorage.getItem('lang')) {
      return localStorage.getItem('lang');
    }
    return this.totalLangs[1];
  }

  deleteChangeKeys(key):void {
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
