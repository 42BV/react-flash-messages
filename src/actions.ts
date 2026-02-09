import { flashMessageService } from './service';

import {
  FlashMessage,
  FlashMessageConfig,
  FlashMessageCreatorConfig
} from './models';

/**
 * Each flash message gets an unique id so we can identify the
 * flash message.
 */
let nextFlashMessageId = 1;

/**
 * Adds a FlashMessage to the store and removes it after the
 * duration, if the duration is not false.
 *
 * @param flashMessage The flash message you want to add.
 */
export function addFlashMessage<Data>(
  flashMessageConfig: FlashMessageConfig<Data>
): FlashMessage<Data> {
  const flashMessage = addIdAndOnClick(flashMessageConfig);

  flashMessageService.addFlashMessage(flashMessage);

  const duration = flashMessage.duration;

  if (duration !== false) {
    setTimeout(() => {
      flashMessageService.removeFlashMessage(flashMessage, 'duration-elapsed');
    }, duration);
  }

  return flashMessage;
}

/**
 * Manually removes the flash message from the flash message store.
 *
 * @param flashMessage The flash message you want to remove.
 */
export function removeFlashMessage<Data>(
  flashMessage: FlashMessage<Data>
): void {
  flashMessageService.removeFlashMessage(flashMessage, 'manually-removed');
}

/**
 * Adds a flash message of the type 'ERROR' on the flash message queue.
 *
 * @param {FlashMessageCreatorConfig} Config The config of the flash message
 */
export function addError<Data>(
  config: FlashMessageCreatorConfig<Data>
): FlashMessage<Data> {
  return addFlashMessage({
    type: 'ERROR',
    duration: 10000,
    ...config
  });
}

/**
 * Adds a flash message of the type 'WARNING' on the flash message queue.
 * After 7000 milliseconds it will automatically be removed
 * from the queue.
 *
 * @param {FlashMessageCreatorConfig} Config The config of the flash message
 */
export function addWarning<Data>(
  config: FlashMessageCreatorConfig<Data>
): FlashMessage<Data> {
  return addFlashMessage({
    type: 'WARNING',
    duration: 7000,
    ...config
  });
}

/**
 * Adds a flash message of the type 'SUCCESS' on the flash message queue.
 * After 2000 milliseconds it will automatically be removed
 * from the queue.
 *
 * @param {FlashMessageCreatorConfig} Config The config of the flash message
 */
export function addSuccess<Data>(
  config: FlashMessageCreatorConfig<Data>
): FlashMessage<Data> {
  return addFlashMessage({
    type: 'SUCCESS',
    duration: 2000,
    ...config
  });
}

/**
 * Adds a flash message of the type 'INFO' on the flash message queue.
 * After 5000 milliseconds it will automatically be removed
 * from the queue.
 *
 * @param {FlashMessageCreatorConfig} Config The config of the flash message
 */
export function addInfo<Data>(
  config: FlashMessageCreatorConfig<Data>
): FlashMessage<Data> {
  return addFlashMessage({ type: 'INFO', duration: 5000, ...config });
}

/**
 * Adds a flash message of the type 'APOCALYPSE' on the flash message queue.
 * This message is never removed from the queue automatically.
 *
 * @param {FlashMessageCreatorConfig} Config The config of the flash message
 */
export function addApocalypse<Data>(
  config: FlashMessageCreatorConfig<Data>
): FlashMessage<Data> {
  return addFlashMessage({
    type: 'APOCALYPSE',
    duration: false,
    ...config
  });
}

function addIdAndOnClick<Data>(
  flashMessage: FlashMessageConfig<Data>
): FlashMessage<Data> {
  const onClick =
    flashMessage.onClick !== undefined ? flashMessage.onClick : noop;
  const onRemove =
    flashMessage.onRemove !== undefined ? flashMessage.onRemove : noop;

  // By adding the onClick it is no longer optional, TypeScript
  // does not recognize this so the cast forces it to.
  const f = flashMessage as unknown as FlashMessage<Data>;

  // Assign a unique id to the flash message;
  f.id = nextFlashMessageId;
  nextFlashMessageId += 1;

  // The FlashMessageConfig's onClick requires a FlashMessage instance
  // but the FlashMessage's onClick does not. The reason for this we
  // do not want your user to have to manually provide the flashMessage
  // for the onClick. So we create an onClick which calls the provided
  // onClick from the config with the FlashMessage.
  f.onClick = () => {
    onClick(f);
  };

  // The FlashMessageConfig's onRemove requires a FlashMessage instance
  // but the FlashMessage's onRemove does not. The reason for this we
  // do not want your user to have to manually provide the flashMessage
  // for the onRemove. So we create an onRemove which calls the provided
  // onRemove from the config with the FlashMessage.
  f.onRemove = (reason) => {
    onRemove(f, reason);
  };

  return f;
}

// This export is purely for unit testing
export function resetNextFlashMessageId(): void {
  nextFlashMessageId = 1;
}

// This function does not do anything, and is used as the default
// for the onClick and onRemove
function noop() {
  return undefined;
}
