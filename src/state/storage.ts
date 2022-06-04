
export function getItemFromStorage<T>(key: string): T | undefined {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e: unknown) {
    console.warn(e);
    return undefined;
  }
}

export function setItemInStorage<T>(key: string, state: T): void {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(key, serializedState);
}

export function deleteItemFromStorage(key: string): void {
  localStorage.removeItem(key);
}
