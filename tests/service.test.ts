import { makeFlashMessageService, FlashMessageService } from '../src/service';

describe('AuthenticationService', () => {
  let flashMessageService: FlashMessageService;
  let onClick: jest.Mock;
  let onRemove: jest.Mock;

  beforeEach(() => {
    onClick = jest.fn();
    onRemove = jest.fn();
    flashMessageService = makeFlashMessageService();
  });

  test('addFlashMessage should add flash message and inform subscribers', () => {
    const flashMessage = { id: 1, type: 'info', text: 'Hello', duration: 5000, onClick, onRemove };

    const subscriber = jest.fn();

    flashMessageService.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);

    flashMessageService.addFlashMessage(flashMessage);

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith([flashMessage]);

    expect(flashMessageService.getFlashMessages()).toEqual([flashMessage]);
  });

  test('removeFlashMessage should remove the flash message and inform subscribers', () => {
    const flashMessage = { id: 1, type: 'info', text: 'Hello', duration: 5000, onClick, onRemove };

    const subscriber = jest.fn();

    flashMessageService.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);

    flashMessageService.addFlashMessage(flashMessage);
    expect(subscriber).toHaveBeenCalledTimes(2);

    flashMessageService.removeFlashMessage(flashMessage, 'duration-elapsed');

    expect(subscriber).toHaveBeenCalledTimes(3);
    expect(subscriber).toHaveBeenLastCalledWith([]);

    expect(flashMessageService.getFlashMessages()).toEqual([]);
  });

  test('clearFlashMessages should clear all the flash messages and inform subscribers', () => {
    const flashMessageOne = { id: 1, type: 'info', text: 'Hello', duration: 5000, onClick, onRemove };
    const flashMessageTwo = { id: 2, type: 'warning', text: 'Goodbye', duration: 2000, onClick, onRemove };

    const subscriber = jest.fn();

    flashMessageService.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);

    flashMessageService.addFlashMessage(flashMessageOne);
    expect(subscriber).toHaveBeenCalledTimes(2);

    flashMessageService.addFlashMessage(flashMessageTwo);
    expect(subscriber).toHaveBeenCalledTimes(3);

    flashMessageService.clearFlashMessages();

    expect(subscriber).toHaveBeenCalledTimes(4);
    expect(subscriber).toHaveBeenLastCalledWith([]);

    expect(flashMessageService.getFlashMessages()).toEqual([]);
  });

  test('subscription lifecycle', () => {
    // Subscribe a subscriber.
    const subscriber = jest.fn();
    flashMessageService.subscribe(subscriber);

    // It should immediately receive the state after subscribing.
    expect(subscriber).toHaveBeenCalledTimes(1);

    // Call clearFlashMessages which should inform the subscriber.
    flashMessageService.clearFlashMessages();
    expect(subscriber).toHaveBeenCalledTimes(2);

    // Unsubscribe the subscriber, and call clearFlashMessages.
    flashMessageService.unsubscribe(subscriber);

    flashMessageService.clearFlashMessages();

    // It should not have been informed anymore.
    expect(subscriber).toHaveBeenCalledTimes(2);
  });
});
