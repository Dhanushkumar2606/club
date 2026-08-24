export const isClient = typeof window !== "undefined";

export function loadClientModule<T>(loader: () => Promise<T>): Promise<T | null> {
  return isClient ? loader() : Promise.resolve(null);
}