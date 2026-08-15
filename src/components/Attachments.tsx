import { useEffect, useRef, useState } from 'react';
import * as drive from '../services/drive';
import { deleteLocalImage, localImageUrl, saveLocalImage } from '../services/imageStore';
import { useProgress } from '../state/ProgressContext';
import type { ImageRef } from '../types';

function refKey(ref: ImageRef): string {
  return ref.kind === 'drive' ? `drive:${ref.fileId}` : `local:${ref.id}`;
}

function Thumb({ imgRef, onRemove }: { imgRef: ImageRef; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = imgRef.kind === 'drive' ? drive.imageUrl(imgRef.fileId) : localImageUrl(imgRef.id);
    load
      .then((u) => { if (!cancelled) setUrl(u); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [imgRef]);

  return (
    <figure className="thumb">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={imgRef.name} />
        </a>
      ) : (
        <div className="thumb-placeholder">
          {error
            ? (imgRef.kind === 'drive' ? 'Connect Drive to view' : 'Unavailable')
            : 'Loading…'}
        </div>
      )}
      <figcaption>
        <span className="thumb-name" title={imgRef.name}>{imgRef.name}</span>
        <span className="thumb-badge">{imgRef.kind === 'drive' ? '☁ Drive' : '💾 Local'}</span>
        <button className="thumb-remove" onClick={onRemove} title="Remove from this node">✕</button>
      </figcaption>
    </figure>
  );
}

export function Attachments({ nodeId }: { nodeId: string }) {
  const { progress, addImage, removeImage } = useProgress();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const images = progress.images[nodeId] ?? [];
  const driveReady = drive.isConnected();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (driveReady) {
          const fileId = await drive.uploadImage(file, nodeId);
          addImage(nodeId, { kind: 'drive', fileId, name: file.name });
        } else {
          const id = await saveLocalImage(file);
          addImage(nodeId, { kind: 'local', id, name: file.name });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  async function handleRemove(ref: ImageRef) {
    if (ref.kind === 'local') await deleteLocalImage(ref.id).catch(() => {});
    removeImage(nodeId, ref);
  }

  return (
    <section className="attachments">
      <h3>Your art for this node</h3>
      {images.length > 0 && (
        <div className="thumb-grid">
          {images.map((ref) => (
            <Thumb key={refKey(ref)} imgRef={ref} onRemove={() => handleRemove(ref)} />
          ))}
        </div>
      )}
      <label className="upload-button">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {busy ? 'Uploading…' : `＋ Attach art (${driveReady ? 'to Google Drive' : 'stored locally'})`}
      </label>
      {!driveReady && (
        <p className="hint">Connect Google Drive in the header to back your uploads up to a Drive folder.</p>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
