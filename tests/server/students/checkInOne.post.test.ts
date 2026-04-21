import { beforeEach, describe, expect, it, vi } from 'vitest';

const readBodyMock = vi.fn();
const connectDBMock = vi.fn();
const updateOneMock = vi.fn();

vi.mock('~~/server/utils/db', () => ({
  ConnectDB: connectDBMock,
}));

vi.mock('~~/server/models/student.model', () => ({
  default: {
    updateOne: updateOneMock,
  },
}));

describe('server/api/students/checkInOne.post', () => {
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

  it('updates CheckIn for the matching student submissionId', async () => {
    const payload = {
      submissionId: 'sub-100',
      CheckIn: {
        Date: 'Thu Apr 16 2026',
        Time: '10:30:00 AM',
        Timestamp: '2026-04-16T14:30:00.000Z',
        Registered: true,
      },
    };

    readBodyMock.mockResolvedValue(payload);
    updateOneMock.mockResolvedValue({ acknowledged: true });

    const { default: handler } = await import('~~/server/api/students/checkInOne.post');
    const result = await handler({} as any);

    expect(connectDBMock).toHaveBeenCalledTimes(1);
    expect(updateOneMock).toHaveBeenCalledWith(
      { submissionId: 'sub-100' },
      { CheckIn: payload.CheckIn },
    );
    expect(result).toEqual({ message: 'Check In Successfully Completed' });
  });
});
