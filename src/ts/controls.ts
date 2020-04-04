// eslint-disable-next-line no-unused-vars
import ModalKeyboard from './modal';

export default class ControlsKeyboard {
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
