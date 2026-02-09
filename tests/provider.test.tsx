import React from 'react';
import { render, cleanup, waitFor, act } from '@testing-library/react';
import { FlashMessagesProvider, FlashMessagesContext } from '../src/provider';
import { FlashMessage } from '../src/models';
import { addInfo } from '../src/actions';

function Component() {
  return (
    <FlashMessagesContext.Consumer>
      {(flashMessages: FlashMessage<unknown>[]) => {
        return (
          <ul>
            {flashMessages.map(flashMessage => (
              <li data-testid="message" key={flashMessage.id}>
                {flashMessage.text}
              </li>
            ))}
          </ul>
        );
      }}
    </FlashMessagesContext.Consumer>
  );
}

afterEach(cleanup);

describe('FlashMessagesProvider', () => {
  test('that flashMessages are provided', async () => {
    expect.assertions(1);

    const { getByTestId } = render(
      <FlashMessagesProvider>
        <Component />
      </FlashMessagesProvider>,
    );

    act(() => {
      addInfo({ text: 'info' });
    });

    await waitFor(() => {
      expect(getByTestId('message')).toHaveTextContent('info');
    });
  });
});
