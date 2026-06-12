const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let backendAvailable = true;

export async function checkBackend() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

export async function uploadImage(file, category) {
  if (!backendAvailable) {
    throw new Error('Backend server ishga tushirilmagan (npm run dev backendda)');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', category);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Rasm yuklashda xatolik');
  }

  const data = await response.json();
  return data.urls?.[0] || data.url;
}

export async function uploadImages(files, category, onProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadImage(files[i], category);
      urls.push(url);
    } catch (err) {
      throw err;
    }
    if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 100));
  }
  return urls;
}

export async function deleteImage(url) {
  if (!backendAvailable) return false;
  try {
    const response = await fetch(`${API_URL}/api/upload/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [url] }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
