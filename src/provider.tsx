import React from 'react';
import { useFlashMessages } from './hooks';
import { flashMessageService } from './service';
import { FlashMessage } from './models';

export const FlashMessagesContext = React.createContext<
  FlashMessage<unknown>[]
>(flashMessageService.getFlashMessages());

export type Props = {
  children: React.ReactNode;
};

/**
 * Provider which provides the a flash message context. Should only
 * be used when needing the `FlashMessagesContext`. We recommend
 * using the `useFlashMessages` hook instead were possible.
 *
 * @param children The children to render
 */
export function FlashMessagesProvider({ children }: Props): React.ReactElement {
  const flashMessages = useFlashMessages();

  return (
    <FlashMessagesContext.Provider value={flashMessages}>
      {children}
    </FlashMessagesContext.Provider>
  );
}
