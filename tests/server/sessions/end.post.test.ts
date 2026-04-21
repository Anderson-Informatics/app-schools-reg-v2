import { beforeEach, describe, expect, it, vi } from 'vitest';

const readBodyMock = vi.fn();
const connectDBMock = vi.fn();
const sessionUpdateOneMock = vi.fn();
const studentUpdateManyMock = vi.fn();

vi.mock('~~/server/utils/db', () => ({
  ConnectDB: connectDBMock,
}));

vi.mock('~~/server/models/session.model', () => ({
  default: {
    updateOne: sessionUpdateOneMock,
  },
}));

vi.mock('~~/server/models/student.model', () => ({
  default: {
    updateMany: studentUpdateManyMock,
  },
}));

vi.mock('~~/server/api/sessions/start.get', () => ({
  default: vi.fn(),
}));

describe('server/api/sessions/end.post', () => {
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

  it('updates session and student records with computed duration', async () => {
    readBodyMock.mockResolvedValue({
      _id: 'sess-1',
      start: '08:00:00',
      end: '09:30:00',
      students: ['sub-1', 'sub-2'],
      CheckOut: {
        Date: 'Thu Apr 16 2026',
        Time: '09:30:00 AM',
      },
    });

    sessionUpdateOneMock.mockResolvedValue({ acknowledged: true });
    studentUpdateManyMock.mockResolvedValue({ acknowledged: true });

    const { default: handler } = await import('~~/server/api/sessions/end.post');
    const result = await handler({} as any);

    expect(sessionUpdateOneMock).toHaveBeenCalledWith(
      { _id: 'sess-1' },
      expect.objectContaining({
        end: '09:30:00',
        duration: 1.5,
      }),
    );

    expect(studentUpdateManyMock).toHaveBeenCalledWith(
      { SubmissionID: { $in: ['sub-1', 'sub-2'] } },
      expect.objectContaining({
        $set: expect.objectContaining({
          'TestSession.end': '09:30:00',
          'TestSession.duration': 1.5,
          CheckOut: {
            Date: 'Thu Apr 16 2026',
            Time: '09:30:00 AM',
          },
        }),
        upsert: true,
      }),
    );

    expect(result).toEqual({ message: 'Testing Session Successfully Ended' });
  });
});
