/**
 * Local image storage in IndexedDB — the fallback when Google Drive isn't
 * connected, so attaching art works with zero configuration.
 */

const DB_NAME = 'bonsai-images';
const STORE = 'images';

let dbPromise: Promise<IDBDatabase> | null = null;
const blobUrlCache = new Map<string, string>();

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

export async function saveLocalImage(file: File): Promise<string> {
  const db = await openDb();
  const id = crypto.randomUUID();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return id;
}

export async function localImageUrl(id: string): Promise<string | null> {
  const cached = blobUrlCache.get(id);
  if (cached) return cached;
  const db = await openDb();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  blobUrlCache.set(id, url);
  return url;
}

export async function deleteLocalImage(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  const url = blobUrlCache.get(id);
  if (url) {
    URL.revokeObjectURL(url);
    blobUrlCache.delete(id);
  }
}
