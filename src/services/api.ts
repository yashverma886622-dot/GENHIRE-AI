import {
  User,
  CreatorProfile,
  PortfolioItem,
  Brief,
  Engagement,
  MatchedCreator,
  GeneratedBriefData,
} from '../types/index.ts';

const TOKEN_KEY = 'genhire_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function uploadVideo(file: File): Promise<{ success: boolean; assetUrl: string }> {
  const headers = new Headers({ 'Content-Type': 'video/mp4' });
  const token = getStoredToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch('/api/media/videos', {
    method: 'POST',
    headers,
    body: file,
  });
  const data = await response.json().catch(() => ({ success: false, error: 'Invalid server response' }));
  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Video upload failed with status ${response.status}`);
  }
  return data as { success: boolean; assetUrl: string };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Invalid server response' }));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string; role: 'creator' | 'brand' }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () =>
    request<{ success: boolean; user: User }>('/api/auth/me'),

  logout: () =>
    request<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' }),

  // Creators
  getCreators: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; count: number; creators: CreatorProfile[] }>(
      `/api/creators${query ? `?${query}` : ''}`
    );
  },

  getCreatorById: (id: string) =>
    request<{ success: boolean; creator: CreatorProfile; portfolio: PortfolioItem[] }>(
      `/api/creators/${id}`
    ),

  updateCreatorProfile: (data: Partial<CreatorProfile>) =>
    request<{ success: boolean; profile: CreatorProfile }>('/api/creators/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addPortfolioItem: (creatorId: string, data: Partial<PortfolioItem>) =>
    request<{ success: boolean; item: PortfolioItem }>(`/api/creators/${creatorId}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  uploadVideo,

  updatePortfolioItem: (id: string, data: Partial<PortfolioItem>) =>
    request<{ success: boolean; item: PortfolioItem }>(`/api/portfolio/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deletePortfolioItem: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/portfolio/${id}`, {
      method: 'DELETE',
    }),

  // Briefs
  getBriefs: (brandId?: string) => {
    const query = brandId ? `?brandId=${encodeURIComponent(brandId)}` : '';
    return request<{ success: boolean; count: number; briefs: Brief[] }>(`/api/briefs${query}`);
  },

  getBriefById: (id: string) =>
    request<{ success: boolean; brief: Brief }>(`/api/briefs/${id}`),

  createBrief: (data: Partial<Brief>) =>
    request<{ success: boolean; brief: Brief }>('/api/briefs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBrief: (id: string, data: Partial<Brief>) =>
    request<{ success: boolean; brief: Brief }>(`/api/briefs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteBrief: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/briefs/${id}`, {
      method: 'DELETE',
    }),

  getBriefMatches: (briefId: string) =>
    request<{
      success: boolean;
      briefId: string;
      briefTitle: string;
      totalMatched: number;
      matches: MatchedCreator[];
    }>(`/api/briefs/${briefId}/matches`),

  // AI Brief Builder
  buildBriefWithAi: (prompt: string) =>
    request<{ success: boolean; brief: GeneratedBriefData; isAiGenerated: boolean }>(
      '/api/ai/build-brief',
      {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }
    ),

  // Engagements
  getEngagements: () =>
    request<{ success: boolean; count: number; engagements: Engagement[] }>('/api/engagements'),

  inviteCreator: (briefId: string, creatorId: string, customMessage?: string) =>
    request<{ success: boolean; engagement: Engagement }>('/api/engagements', {
      method: 'POST',
      body: JSON.stringify({ briefId, creatorId, customMessage }),
    }),

  advanceEngagement: (id: string, payload: {
    stage: string;
    note?: string;
    pitch?: string;
    proposedTimeline?: string;
    deliverable?: Engagement['deliverables'];
  }) =>
    request<{ success: boolean; engagement: Engagement }>(`/api/engagements/${id}/advance`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  reviseEngagement: (id: string, feedback: string) =>
    request<{ success: boolean; engagement: Engagement }>(`/api/engagements/${id}/revise`, {
      method: 'PATCH',
      body: JSON.stringify({ feedback }),
    }),
};
