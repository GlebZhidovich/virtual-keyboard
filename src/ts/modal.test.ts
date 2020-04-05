import ModalKeyboard from './modal';

describe('Test modal',() => {
  let modal;
  beforeEach(() => {
    modal = new ModalKeyboard();
  });

  test('lang case', () => {
      expect(modal.langCase).toBe('low');
  });

  test('lang', () => {
      expect(modal.curLang).toBe('en');
  });
});

