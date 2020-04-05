import ModalKeyboard from './modal';
export default class ControlsKeyboard {
    private _field;
    private _keyboardModal;
    get keyboardModal(): ModalKeyboard;
    set keyboardModal(modal: ModalKeyboard);
    get field(): Document | HTMLElement;
    set field(field: Document | HTMLElement);
    setHandler(): void;
    keydownHandler: (e: KeyboardEvent) => void;
    keyupHandler: (e: KeyboardEvent) => void;
    mousedownHandler: (e: MouseEvent) => void;
    mouseupHandler: (e: MouseEvent) => void;
}
