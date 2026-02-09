import * as index from '../src';

describe('index', () => {
  test('exports', () => {
    expect(index).toMatchInlineSnapshot(`
      {
        "FlashMessage": undefined,
        "FlashMessageConfig": undefined,
        "FlashMessageCreatorConfig": undefined,
        "FlashMessageRemovedReason": undefined,
        "FlashMessagesContext": {
          "$$typeof": Symbol(react.context),
          "Consumer": {
            "$$typeof": Symbol(react.context),
            "_context": [Circular],
          },
          "Provider": {
            "$$typeof": Symbol(react.provider),
            "_context": [Circular],
          },
          "_currentRenderer": null,
          "_currentRenderer2": null,
          "_currentValue": [],
          "_currentValue2": [],
          "_defaultValue": null,
          "_globalName": null,
          "_threadCount": 0,
        },
        "FlashMessagesProvider": [Function],
        "OnFlashMessageClicked": undefined,
        "OnFlashMessageRemoved": undefined,
        "addApocalypse": [Function],
        "addError": [Function],
        "addFlashMessage": [Function],
        "addInfo": [Function],
        "addSuccess": [Function],
        "addWarning": [Function],
        "flashMessageService": {
          "addFlashMessage": [Function],
          "clearFlashMessages": [Function],
          "getFlashMessages": [Function],
          "removeFlashMessage": [Function],
          "subscribe": [Function],
          "unsubscribe": [Function],
        },
        "removeFlashMessage": [Function],
        "useFlashMessages": [Function],
      }
    `);
  });
});
