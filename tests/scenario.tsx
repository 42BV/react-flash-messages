import React from 'react';
import {
  render,
  cleanup,
  waitFor,
  act,
  fireEvent
} from '@testing-library/react';
import { useFlashMessages } from '../src/hooks';
import { addInfo, removeFlashMessage } from '../src/actions';
import { FlashMessage } from '../src/models';

afterEach(cleanup);

describe('Scenario', () => {
  function Component() {
    const flashMessages = useFlashMessages();

    return (
      <ul>
        {flashMessages.map((flashMessage) => {
          const { id, text, onClick } = flashMessage;

          return (
            <li data-testid="message" key={id} onClick={onClick}>
              {text}
            </li>
          );
        })}
      </ul>
    );
  }

  test('a basic complete scenario which shows flash messages which remove when clicked', async () => {
    expect.assertions(7);

    const { getByTestId, queryByTestId } = render(<Component />);

    const onClick = (flashMessage: FlashMessage<unknown>) => {
      expect(flashMessage.id).toBeDefined();
      expect(flashMessage.text).toBe('info');
      removeFlashMessage(flashMessage);
    };

    act(() => {
      addInfo({
        text: 'info',
        onClick,
        onRemove: (flashMessage, reason) => {
          expect(flashMessage.id).toBeDefined();
          expect(flashMessage.text).toBe('info');

          expect(reason).toBe('manually-removed');
        }
      });
    });

    await waitFor(() => {
      expect(getByTestId('message')).toHaveTextContent('info');
    });

    fireEvent.click(getByTestId('message'));

    await waitFor(() => {
      expect(queryByTestId('message')).toBe(null);
    });
  });
});
