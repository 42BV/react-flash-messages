import React from 'react';
import { render, cleanup, waitFor, act } from '@testing-library/react';
import { useFlashMessages } from '../src/hooks';
import { addInfo } from '../src/actions';
import { flashMessageService } from '../src/service';

describe('useFlashMessages', () => {
  function Component() {
    const flashMessages = useFlashMessages();

    return (
      <ul>
        {flashMessages.map((flashMessage) => (
          <li data-testid="message" key={flashMessage.id}>
            {flashMessage.text}
          </li>
        ))}
      </ul>
    );
  }

  test('that flashMessages are provided', async () => {
    expect.assertions(2);

    vi.spyOn(flashMessageService, 'unsubscribe');

    const { getByTestId } = render(<Component />);

    act(() => {
      addInfo({ text: 'info' });
    });

    await waitFor(() => {
      expect(getByTestId('message')).toHaveTextContent('info');
    });

    cleanup();

    expect(flashMessageService.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
