interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'error' | 'success';
}

// Client-only, ephemeral notifications. Module-level ref is fine: toasts are
// only ever pushed from user interactions in the browser, never during SSR.
const toasts = ref<Toast[]>([]);
let seq = 0;

export function useToast() {
  function push(message: string, kind: Toast['kind'] = 'info') {
    const id = ++seq;
    toasts.value.push({ id, message, kind });
    setTimeout(() => dismiss(id), 4500);
  }
  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }
  return {
    toasts,
    dismiss,
    info: (m: string) => push(m, 'info'),
    error: (m: string) => push(m, 'error'),
    success: (m: string) => push(m, 'success'),
  };
}
