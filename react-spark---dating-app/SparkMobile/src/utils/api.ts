// This file is a placeholder for when you connect to a real backend.
// In the current mock data version, this file is not used.
// The mock logic is handled directly in src/contexts/AuthContext.tsx.
const API_BASE = 'http://localhost:8081';

export async function getUser(token: string) {
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(token: string, data: any) {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function uploadPhoto(token: string, photoUri: string) {
  const formData = new FormData();
  formData.append('photo', {
    uri: photoUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_BASE}/user/photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type' is set automatically by fetch for FormData
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload photo');
  return res.json();
}

export async function logout(token: string) {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}