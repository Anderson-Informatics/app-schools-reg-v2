import { beforeEach, describe, expect, it, vi } from 'vitest';

const readBodyMock = vi.fn();
const connectDBMock = vi.fn();
const configFindOneMock = vi.fn();
const sessionFindOneMock = vi.fn();
const sessionCreateMock = vi.fn();
const sessionUpdateOneMock = vi.fn();

vi.mock('~~/server/utils/db', () => ({
  ConnectDB: connectDBMock,
}));

vi.mock('~~/server/models/config.model', () => ({
  default: {
    findOne: configFindOneMock,
  },
}));

vi.mock('~~/server/models/session.model', () => ({
  default: {
    findOne: sessionFindOneMock,
    create: sessionCreateMock,
    updateOne: sessionUpdateOneMock,
  },
}));

describe('server/api/sessions/register.post', () => {
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

  it('creates a new session for first student and applies grouped grade capacity', async () => {
    const student = {
      submissionId: 'sub-1',
      submissionIdInt: '1001',
      FullName: 'Test Student',
      FirstName: 'Test',
      LastName: 'Student',
      GradeEntering: '3',
    };

    readBodyMock.mockResolvedValue(student);
    configFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        group34: true,
        group56: false,
        group78: false,
        g34cap: 12,
      }),
    });
    sessionFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });
    sessionCreateMock.mockResolvedValue({ _id: 'new-session' });

    const { default: handler } = await import('~~/server/api/sessions/register.post');
    const result = await handler({} as any);

    expect(connectDBMock).toHaveBeenCalledTimes(1);
    expect(sessionCreateMock).toHaveBeenCalledTimes(1);
    expect(sessionCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        grade: '3-4',
        capacity: 12,
        students: [student],
        status: 'Open',
      }),
    );
    expect(result).toEqual({ message: 'Student Added to New Session' });
  });

  it('adds a student to an existing session and closes when reaching capacity', async () => {
    const student = {
      submissionId: 'sub-2',
      GradeEntering: '6',
    };

    readBodyMock.mockResolvedValue(student);
    configFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        group56: false,
        g6cap: 2,
      }),
    });
    sessionFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'sess-1',
        grade: '6',
        capacity: 2,
        students: [{ submissionId: 'existing-sub' }],
      }),
    });
    sessionUpdateOneMock.mockResolvedValue({ acknowledged: true });

    const { default: handler } = await import('~~/server/api/sessions/register.post');
    const result = await handler({} as any);

    expect(sessionUpdateOneMock).toHaveBeenCalledWith(
      { _id: 'sess-1' },
      expect.objectContaining({
        $push: { students: student },
        $set: { status: 'Closed' },
      }),
    );
    expect(result).toEqual({ message: 'Student Added to Existing Session' });
  });

  it('prevents duplicate submissionId in an existing session', async () => {
    const student = {
      submissionId: 'sub-dup',
      GradeEntering: '5',
    };

    readBodyMock.mockResolvedValue(student);
    configFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ group56: false, g5cap: 10 }),
    });
    sessionFindOneMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'sess-dup',
        capacity: 10,
        students: [{ submissionId: 'sub-dup' }],
      }),
    });

    const { default: handler } = await import('~~/server/api/sessions/register.post');
    const result = await handler({} as any);

    expect(sessionUpdateOneMock).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Student already registered in session.' });
  });
});
