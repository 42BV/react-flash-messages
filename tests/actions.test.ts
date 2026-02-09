import {
  addError,
  addWarning,
  addSuccess,
  addInfo,
  addApocalypse,
  addFlashMessage,
  removeFlashMessage,
  resetNextFlashMessageId,
} from '../src/actions';
import { FlashMessage } from '../src/models';

import { flashMessageService } from '../src/service';

jest.useFakeTimers();

describe('Flash message actions', () => {
  let onClick: jest.Mock;
  let onRemove: jest.Mock;

  beforeEach(() => {
    onClick = jest.fn();
    onRemove = jest.fn();

    jest.spyOn(flashMessageService, 'addFlashMessage');
    jest.spyOn(flashMessageService, 'removeFlashMessage');

    jest.clearAllMocks();
    jest.clearAllTimers();

    resetNextFlashMessageId();
  });

  function checkCallbacks({flashMessage, expectedRemoveCount}: { flashMessage: FlashMessage<unknown>, expectedRemoveCount: number}) {
    expect(typeof flashMessage.onClick).toBe('function');
      
    flashMessage.onClick();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(flashMessage);

    expect(typeof flashMessage.onRemove).toBe('function');

    flashMessage.onRemove('duration-elapsed');

    expect(onRemove).toHaveBeenCalledTimes(expectedRemoveCount);
    expect(onRemove).toHaveBeenCalledWith(flashMessage, 'duration-elapsed');
  }

  describe('addFlashMessage', () => {
    test('that it adds an id and alters the onClick and onRemove so that it encloses the FlashMessage', () => {
      const flashMessage = addFlashMessage({
        type: 'BLAAT',
        text: 'TLAAB',
        onClick,
        onRemove,
        duration: 5000,
        data: { age: 16 },
      });

      expect(flashMessage.id).toBe(1);
      
      checkCallbacks({flashMessage, expectedRemoveCount: 1});
    });

    test('when onClick, and onRemove are not defined it should assign a noop', () => {
      const flashMessage = addFlashMessage({
        type: 'BLAAT',
        text: 'TLAAB',
        duration: 5000,
        data: { age: 16 },
      });

      expect(typeof flashMessage.onClick).toBe('function');
      expect(flashMessage.onClick()).toBe(undefined);

      expect(typeof flashMessage.onRemove).toBe('function');
      expect(flashMessage.onRemove('manually-removed')).toBe(undefined);
    });

    test('custom type should work', () => {
      const flashMessage = addFlashMessage({
        type: 'BLAAT',
        text: 'TLAAB',
        duration: false,
        onClick,
        onRemove,
        data: { age: 16 },
      });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'BLAAT',
        text: 'TLAAB',
        duration: false,
        data: { age: 16 },
      }));

      checkCallbacks({flashMessage, expectedRemoveCount: 1});
    });
  });

  test('removeFlashMessage', () => {
    const flashMessage = addError({ text: 'Epic error', onClick, onRemove, data: { age: 12 } });

    expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
    expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      type: 'ERROR',
      text: 'Epic error',
      duration: 10000,
      data: { age: 12 },
    }));

    // Calling removeFlashMessage is a manual removal.
    removeFlashMessage(flashMessage);

    expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(1);
    expect(flashMessageService.removeFlashMessage).toHaveBeenCalledWith(flashMessage, 'manually-removed');
  });

  describe('default creators', () => {
    test('addError', () => {
      const flashMessage = addError({ text: 'Epic error', onClick, onRemove, data: { age: 12 } });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'ERROR',
        text: 'Epic error',
        duration: 10000,
        data: { age: 12 },
      }));

      jest.advanceTimersByTime(9999);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledWith(flashMessage, 'duration-elapsed');

      checkCallbacks({flashMessage, expectedRemoveCount: 2});
    });

    test('addWarning', () => {
      const flashMessage = addWarning({ text: 'Epic warning', onClick, onRemove, data: { age: 13 } });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'WARNING',
        text: 'Epic warning',
        duration: 7000,
        data: { age: 13 },
      }));

      jest.advanceTimersByTime(6999);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledWith(flashMessage, 'duration-elapsed');

      checkCallbacks({flashMessage, expectedRemoveCount: 2});
    });

    test('addSuccess', () => {
      const flashMessage = addSuccess({ text: 'Epic success', onClick, onRemove, data: { age: 14 } });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'SUCCESS',
        text: 'Epic success',
        duration: 2000,
        data: { age: 14 },
      }));

      jest.advanceTimersByTime(1999);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledWith(flashMessage, 'duration-elapsed');

      checkCallbacks({flashMessage, expectedRemoveCount: 2});
    });

    test('addInfo', () => {
      const flashMessage = addInfo({ text: 'Epic info', onClick, onRemove, data: { age: 15 } });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'INFO',
        text: 'Epic info',
        duration: 5000,
        data: { age: 15 },
      }));

      jest.advanceTimersByTime(4999);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1);

      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledWith(flashMessage, 'duration-elapsed');

      checkCallbacks({flashMessage, expectedRemoveCount: 2});
    });

    test('addApocalypse', () => {
      const flashMessage = addApocalypse({ text: 'TOTAL ANNIHILATION', onClick, onRemove, data: { age: 16 } });

      expect(flashMessageService.addFlashMessage).toHaveBeenCalledTimes(1);
      expect(flashMessageService.addFlashMessage).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        type: 'APOCALYPSE',
        text: 'TOTAL ANNIHILATION',
        duration: false,
        data: { age: 16 },
      }));

      jest.advanceTimersByTime(600000000);

      expect(flashMessageService.removeFlashMessage).toHaveBeenCalledTimes(0);

      checkCallbacks({flashMessage, expectedRemoveCount: 1});
    });
  });
});
