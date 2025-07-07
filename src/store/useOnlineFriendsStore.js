import { create } from "zustand";

const useOnlineFriendsStore = create((set) => ({
  onlineFriends: new Set(),

  setOnlineFriends: (ids) => set(() => ({ onlineFriends: new Set(ids) })),

  addOnlineFriend: (id) =>
    set((state) => {
      const updated = new Set(state.onlineFriends);
      updated.add(id);
      return { onlineFriends: updated };
    }),

  removeOnlineFriend: (id) =>
    set((state) => {
      const updated = new Set(state.onlineFriends);
      updated.delete(id);
      return { onlineFriends: updated };
    }),
}));

export default useOnlineFriendsStore;
