import ViewKeyboard from './view';
import ModalKeyboard from './modal';
import ControlsKeyboard from  './controls';

function ready(): void {
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
