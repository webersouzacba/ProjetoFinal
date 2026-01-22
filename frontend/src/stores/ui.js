import { defineStore } from 'pinia';

let _id = 0;

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: []
  }),

  actions: {
    toast({ kind = 'info', message, timeout = 3500 } = {}) {
      const id = ++_id;
      this.toasts.push({ id, kind, message });

      if (timeout && timeout > 0) {
        setTimeout(() => this.dismissToast(id), timeout);
      }
    },

    dismissToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }
  }
});
