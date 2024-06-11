import { AllSlices, SliceCreator } from '.';
import { mockChatAirdrop } from '../constants/constants'
import { ChatSchema, ExtendedChatSchema, HistoryMessage, Role, SelectedChat } from '../types/chat';

export interface ChatsSlice {
  all: ChatSchema[];
  selectedChat?: SelectedChat;
  addChat: (chat: ChatSchema & { isNew?: boolean }, message: string, timestamp: number) => void;
  selectChat: (chat: ExtendedChatSchema | undefined) => void;
  addChats: (chats: ChatSchema[]) => void;
  writeToChat: (message: HistoryMessage) => void;
  renameChat: (id: string, name: string) => void;
  removeChat: (id: string) => void;
}

export const createChatsSlice = (): SliceCreator<ChatsSlice> => (set, get) => {
  return {
    all: [mockChatAirdrop],
    selectedChat: mockChatAirdrop,
    selectChat: chat => {
      set(state => {
        state.chats.selectedChat = chat;
      });
    },
    addChat: (chat, message, timestamp) => {
      set(state => {
        state.chats.all = [chat, ...state.chats.all];
        state.chats.selectedChat = {
          ...chat,
          history: [
            {
              role: Role.USER,
              content: message,
              timestamp,
            },
          ],
        };
      });
    },
    addChats: chats => {
      const { all } = get().chats;
      set(state => {
        state.chats.all = [...all, ...chats];
      });
    },
    writeToChat: message => {
      const { selectedChat } = get().chats;

      if (!selectedChat) throw new Error('Chat is not selected!');

      let history = selectedChat.history;

      history = [{ ...message, content: message.content }, ...history];

      set(state => {
        if (state.chats.selectedChat) state.chats.selectedChat.history = history;
      });
    },
    renameChat: (id, name) => {
      const { all } = get().chats;
      const newChatIndex = all.findIndex(i => i.uuid === id);
      if (newChatIndex === -1) throw new Error('Chat doesn`t exist');

      const updatedChat = { ...all[newChatIndex], name: name || null };

      const newList = all.map(i => {
        if (i.uuid !== updatedChat.uuid) {
          return i;
        } else {
          return updatedChat as ChatSchema;
        }
      });

      set(state => {
        state.chats.all = [...newList];
      });
    },
    removeChat: id => {
      const { all } = get().chats;
      const filteredArray = [...all].filter(i => i.uuid !== id);

      set(state => {
        state.chats.all = filteredArray;
      });
    },
  };
};

export const chatsSelector = (state: AllSlices) => state.chats;
