import ModalKeyboard from './modal';
export default class ViewKeyboard {
    private _container;
    private _keyboardModal;
    private _keyBoard;
    private _inputElem;
    private classSet;
    get container(): HTMLElement;
    set container(cont: HTMLElement);
    get keyBoard(): HTMLElement;
    get keyboardModal(): ModalKeyboard;
    set keyboardModal(mod: ModalKeyboard);
    set keyBoard(elem: HTMLElement);
    get inputElem(): HTMLTextAreaElement | HTMLInputElement;
    set inputElem(elem: HTMLTextAreaElement | HTMLInputElement);
    buildView(): void;
    buildBorRow(field: HTMLElement): void;
    buildKeyboard(arr: string[][], field: HTMLElement): void;
    buildMainBut(field: any, index: any): void;
    updateText(): void;
    updateCorPos(): void;
    update(): void;
    changeKeys(arr: string[][]): void;
    addAnimateKey(elem: HTMLElement): void;
    delAnimateKey(elem: HTMLElement): void;
}
