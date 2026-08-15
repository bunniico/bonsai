/**
 * Google Drive integration via Google Identity Services (OAuth implicit flow)
 * and the Drive v3 REST API. Uses the `drive.file` scope, so the app can only
 * see files it created itself — your wider Drive stays private.
 *
 * The user supplies their own OAuth Client ID in Settings (this is a static
 * app with no backend to hold secrets; a client ID is public by design).
 */

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'Bonsai — Art Journey';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

interface TokenClient {
  requestAccessToken: (opts?: { prompt?: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

let gisLoaded: Promise<void> | null = null;
let accessToken: string | null = null;
let tokenExpiry = 0;
let folderId: string | null = null;
const blobUrlCache = new Map<string, string>();

function loadGis(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve();
  if (!gisLoaded) {
    gisLoaded = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gisLoaded = null;
        reject(new Error('Could not load Google Identity Services.'));
      };
      document.head.appendChild(script);
    });
  }
  return gisLoaded;
}

export function isConnected(): boolean {
  return accessToken !== null && Date.now() < tokenExpiry;
}

export async function connect(clientId: string): Promise<void> {
  if (!clientId) throw new Error('Set a Google OAuth Client ID in Settings first.');
  await loadGis();
  await new Promise<void>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error ?? 'Authorization was cancelled.'));
          return;
        }
        accessToken = resp.access_token;
        // Access tokens last ~1h; refresh a bit early.
        tokenExpiry = Date.now() + 55 * 60 * 1000;
        resolve();
      },
    });
    client.requestAccessToken();
  });
}

export function disconnect(): void {
  accessToken = null;
  tokenExpiry = 0;
  folderId = null;
}

async function driveFetch(url: string, init?: RequestInit): Promise<Response> {
  if (!isConnected()) throw new Error('Not connected to Google Drive.');
  const resp = await fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${accessToken}` },
  });
  if (resp.status === 401) {
    disconnect();
    throw new Error('Google Drive session expired — please reconnect.');
  }
  if (!resp.ok) throw new Error(`Drive request failed (${resp.status}).`);
  return resp;
}

async function ensureFolder(): Promise<string> {
  if (folderId) return folderId;
  const q = encodeURIComponent(
    `name='${FOLDER_NAME.replace(/'/g, "\\'")}' and mimeType='${FOLDER_MIME}' and trashed=false`,
  );
  const found = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)&spaces=drive`,
  ).then((r) => r.json());
  if (found.files?.length) {
    folderId = found.files[0].id as string;
    return folderId;
  }
  const created = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME }),
  }).then((r) => r.json());
  folderId = created.id as string;
  return folderId;
}

/** Upload an image into the app's Drive folder; returns the new file's id. */
export async function uploadImage(file: File, nodeId: string): Promise<string> {
  const parent = await ensureFolder();
  const metadata = {
    name: `${nodeId} — ${file.name}`,
    parents: [parent],
    appProperties: { bonsaiNodeId: nodeId },
  };
  const body = new FormData();
  body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  body.append('file', file);
  const resp = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    { method: 'POST', body },
  ).then((r) => r.json());
  return resp.id as string;
}

/** Fetch a Drive image as a cached object URL for display. */
export async function imageUrl(fileId: string): Promise<string> {
  const cached = blobUrlCache.get(fileId);
  if (cached) return cached;
  const resp = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
  );
  const url = URL.createObjectURL(await resp.blob());
  blobUrlCache.set(fileId, url);
  return url;
}
