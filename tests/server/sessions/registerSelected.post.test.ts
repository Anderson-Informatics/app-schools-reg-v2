import { beforeEach, describe, expect, it, vi } from 'vitest';

const readBodyMock = vi.fn();
const connectDBMock = vi.fn();
const sessionFindOneMock = vi.fn();
const sessionUpdateOneMock = vi.fn();

vi.mock('~~/server/utils/db', () => ({
  ConnectDB: connectDBMock,
}));

vi.mock('~~/server/models/session.model', () => ({
  default: {
    findOne: sessionFindOneMock,
    updateOne: sessionUpdateOneMock,
  },
}));

describe('server/api/sessions/registerSelected.post', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.stubGlobal('defineEventHandler', (handler: any) => handler);
    vi.stubGlobal('readBody', readBodyMock);
    vi.stubGlobal('createError', (payload: any) => {
      const err = new Error(payload?.message || payload?.statusMessage || 'error');
      return Object.assign(err, payload);
    });
  });

  it('returns not found when target session does not exist', async () => {
    readBodyMock.mockResolvedValue({
      sessionId: 'missing-session',
      student: { submissionId: 'sub-1' },
    });
    sessionFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });

    const { default: handler } = await import('~~/server/api/sessions/registerSelected.post');

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Session not found.',
    });
  });

  it('adds student and closes selected session at capacity', async () => {
    readBodyMock.mockResolvedValue({
      sessionId: 'sess-1',
      student: { submissionId: 'sub-2' },
    });
    sessionFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'sess-1',
        capacity: 2,
        students: [{ submissionId: 'existing' }],
      }),
    });

    const { default: handler } = await import('~~/server/api/sessions/registerSelected.post');
    const result = await handler({} as any);

    expect(sessionUpdateOneMock).toHaveBeenCalledWith(
      { _id: 'sess-1' },
      expect.objectContaining({
        $push: { students: { submissionId: 'sub-2' } },
        $set: { status: 'Closed' },
      }),
    );
    expect(result).toEqual({ message: 'Student added to selected session.' });
  });
});
