'use client';

import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

function getStorageInstance() {
  return getStorage(app);
}

export interface UploadProgress {
  percent: number;
  bytesTransferred: number;
  totalBytes: number;
}

/**
 * Upload a file to Firebase Storage under /properties/{propertyId}/
 * Returns the public download URL.
 */
export function uploadPropertyImage(
  file: File,
  propertyId: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storage = getStorageInstance();
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const path = `properties/${propertyId}/${filename}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);

    task.on(
      'state_changed',
      (snap) => {
        onProgress?.({
          percent: Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          bytesTransferred: snap.bytesTransferred,
          totalBytes: snap.totalBytes
        });
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Delete an image from Firebase Storage by its download URL.
 */
export async function deletePropertyImage(downloadUrl: string): Promise<void> {
  try {
    const storage = getStorageInstance();
    // Extract the storage path from the download URL
    const url = new URL(downloadUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
    if (!pathMatch) return;
    const storagePath = decodeURIComponent(pathMatch[1]);
    const fileRef = storageRef(storage, storagePath);
    await deleteObject(fileRef);
  } catch (e) {
    console.warn('Could not delete image from storage:', e);
  }
}
