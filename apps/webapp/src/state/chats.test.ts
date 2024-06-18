import { beforeEach, describe, expect, test } from 'vitest';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { AllSlices, initializeStore } from '.';
import { ChatSchema, ChatSchemaState, Role } from '../types/chat';

describe('Proof Slice', () => {
  let useStore: UseBoundStore<StoreApi<AllSlices>>;

  const chat: ChatSchema = {
    name: 'test',
    uuid: '1',
    created_at: new Date(),
    state: ChatSchemaState.ACTIVE,
    user_id: 1,
  };
  const message = 'test_1';
  const timestamp = Date.now();

  beforeEach(() => {
    useStore = create<AllSlices>()(initializeStore());
  });

  test('the default is empty, false or undefined', () => {
    expect(useStore.getState().chats.all.length).toBe(0);
    expect(useStore.getState().chats.selectedChat).toBeUndefined();
  });

  describe('addChat()', () => {
    const expectedObj = {
      ...chat,
      history: [
        {
          role: Role.USER,
          content: message,
          timestamp,
        },
      ],
    };
    test('selectedChat and chats can be set', () => {
      useStore.getState().chats.addChat(chat, message, timestamp);
      const all = useStore.getState().chats.all;
      expect(useStore.getState().chats.selectedChat).toStrictEqual(expectedObj);
      expect(all.length).toBe(1);
      expect(all[0]).toStrictEqual(chat);
    });
  });

  describe('addChats()', () => {
    test('chat can be added', () => {
      useStore.getState().chats.addChats([chat]);
      expect(useStore.getState().chats.all.length).toBe(1);
    });
  });

  describe('selectChat()', () => {
    test('selected chat can be set', () => {
      const selectedChat = {
        ...chat,
        history: [
          {
            role: Role.USER,
            body: message,
            timestamp,
          },
        ],
      };
      useStore.getState().chats.selectChat(selectedChat);
      expect(useStore.getState().chats.selectedChat).toStrictEqual(selectedChat);
    });

    test('selected chat can be set to undefined', () => {
      useStore.getState().chats.selectChat(undefined);
      expect(useStore.getState().chats.selectedChat).toBeUndefined();
    });
  });

  describe('writeToChat()', () => {
    test('can write to chat', () => {
      const selectedChat = {
        ...chat,
        history: [
          {
            role: Role.USER,
            body: message,
            timestamp,
          },
        ],
      };
      const secondMessage = {
        role: Role.SYSTEM,
        body: message,
        timestamp,
      };

      useStore.getState().chats.selectChat(selectedChat);

      useStore.getState().chats.writeToChat(secondMessage);
      expect(useStore.getState().chats.selectedChat?.history.length).toBe(2);
    });

    test('throw error if selected chat is not set', () => {
      const secondMessage = {
        role: Role.SYSTEM,
        body: message,
        timestamp,
      };

      expect(() => useStore.getState().chats.writeToChat(secondMessage)).toThrowError(
        'Chat is not selected!',
      );
    });
  });

  describe('renameChat()', () => {
    test('new chat name acn be set', () => {
      useStore.getState().chats.addChats([chat]);
      const newName = 'test_2';

      useStore.getState().chats.renameChat('1', newName);

      expect(useStore.getState().chats.all[0]?.name).toBe(newName);
    });

    test('throw error if try rename not existed chat', () => {
      useStore.getState().chats.addChats([chat]);
      const newName = 'test_2';

      expect(() => useStore.getState().chats.renameChat('2', newName)).toThrowError(
        'Chat doesn`t exist',
      );
    });
  });

  describe('removeChat()', () => {
    test('chat can be removed', () => {
      useStore.getState().chats.addChats([chat]);

      expect(useStore.getState().chats.all.length).toBe(1);

      useStore.getState().chats.removeChat(chat.uuid);

      expect(useStore.getState().chats.all.length).toBe(0);
    });

    test('throw error if try rename not existed chat', () => {
      useStore.getState().chats.addChats([chat]);
      const newName = 'test_2';

      expect(() => useStore.getState().chats.renameChat('2', newName)).toThrowError(
        'Chat doesn`t exist',
      );
    });
  });
});
