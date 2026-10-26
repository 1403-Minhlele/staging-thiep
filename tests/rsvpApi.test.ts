import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onRequestPost, onRequestOptions } from '../functions/api/rsvp';

describe('Cloudflare Pages Function: /api/rsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles OPTIONS preflight request with correct CORS headers', async () => {
    const mockRequest = new Request('https://thiepmoi.mekongmeris.com/api/rsvp', {
      method: 'OPTIONS',
      headers: { Origin: 'https://thiepmoi.mekongmeris.com' },
    });

    const context: any = {
      request: mockRequest,
      env: {},
    };

    const response = await onRequestOptions(context);
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('returns 400 when body is not valid JSON', async () => {
    const mockRequest = new Request('https://thiepmoi.mekongmeris.com/api/rsvp', {
      method: 'POST',
      body: 'invalid-json',
      headers: { 'Content-Type': 'application/json' },
    });

    const context: any = {
      request: mockRequest,
      env: {},
    };

    const response = await onRequestPost(context);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 when validation fails (missing guestName)', async () => {
    const mockRequest = new Request('https://thiepmoi.mekongmeris.com/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({
        attendance: 'yes',
        partySize: 1,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const context: any = {
      request: mockRequest,
      env: {},
    };

    const response = await onRequestPost(context);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors?.guestName).toBeDefined();
  });

  it('detects honeypot and rejects bot request', async () => {
    const mockRequest = new Request('https://thiepmoi.mekongmeris.com/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({
        guestName: 'Spam Bot',
        attendance: 'yes',
        partySize: 1,
        website: 'https://spam.com', // Honeypot filled
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const context: any = {
      request: mockRequest,
      env: {},
    };

    const response = await onRequestPost(context);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors?.bot).toBeDefined();
  });

  it('transparently runs in Local Mock Mode when MONGODB_URI is not set, explicitly warning developer', async () => {
    const mockRequest = new Request('https://thiepmoi.mekongmeris.com/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({
        eventId: 'grand-opening-2026',
        guestName: 'Nguyễn Văn Test',
        attendance: 'yes',
        partySize: 2,
      }),
      headers: {
        'Content-Type': 'application/json',
        'cf-connecting-ip': '1.2.3.4',
      },
    });

    const context: any = {
      request: mockRequest,
      env: {
        MONGODB_URI: '', // Unset MONGODB_URI
      },
    };

    const response = await onRequestPost(context);
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Backend-Mode')).toBe('unverified-local-mock');

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.isMock).toBe(true);
    expect(body.notice).toContain('CHẾ ĐỘ XEM TRƯỚC');
    expect(body.rsvpId).toMatch(/^mock_/);
    // Never leak passwords or sensitive cluster info
    expect(body).not.toHaveProperty('connectionString');
  });
});
