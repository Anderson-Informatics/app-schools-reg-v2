import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('app/pages/registration.vue', () => {
  const mountPage = async (Page: any) => {
    const Host = defineComponent({
      components: { Page },
      template: '<Suspense><Page /></Suspense>',
    });

    const wrapper = mount(Host, {
      global: {
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot name="text" /><slot /></div>' },
          'v-text-field': { template: '<input />' },
          'v-chip': { template: '<div><slot /></div>' },
          'v-icon': { template: '<span><slot /></span>' },
          'v-snackbar': { template: '<div><slot /><slot name="actions" /></div>' },
          'v-data-table': {
            props: ['items'],
            template: '<div><slot name="item.controls" :item="items[0]" /></div>',
          },
          'v-btn': { template: '<button><slot /></button>' },
          SessionSelectModal: {
            name: 'SessionSelectModal',
            props: ['modelValue', 'selectedSessionId', 'sessions'],
            template: '<div data-testid="session-modal" :data-open="String(modelValue)"></div>',
          },
        },
      },
    });

    await flushPromises();
    return wrapper;
  };

  const getStores = () => {
    const studentStore = {
      students: [],
      getAll: vi.fn().mockResolvedValue([]),
      checkInOne: vi.fn().mockResolvedValue({}),
      addToSession: vi.fn().mockResolvedValue({}),
      addToSelectedSession: vi.fn().mockResolvedValue({}),
      addLabel: vi.fn().mockResolvedValue({}),
    };

    const sessionStore = {
      sessions: [],
      getTodaysSessions: vi.fn().mockResolvedValue([]),
      getTodaysStudents: vi.fn().mockResolvedValue([]),
    };

    const configStore = {
      config: {
        printLabels: false,
        applyLabels: false,
      },
      getConfig: vi.fn().mockResolvedValue({}),
    };

    return { studentStore, sessionStore, configStore };
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.stubGlobal('useAsyncData', vi.fn(async (_key: string, fn: any) => {
      if (typeof fn === 'function') {
        await fn();
      }
      return { data: null };
    }));
    vi.stubGlobal('ref', ref);

    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('printIep', vi.fn());
    vi.stubGlobal('printLabel', vi.fn());
  });

  it('auto-registers non-IEP student into a session on Register click', async () => {
    const { studentStore, sessionStore, configStore } = getStores();

    studentStore.students = [
      {
        submissionId: 'sub-1',
        submissionIdInt: '1001',
        FullName: 'A Student',
        FirstName: 'A',
        LastName: 'Student',
        GradeEntering: '4',
        IEP: 'No',
        CheckIn: '',
      },
    ] as any;

    vi.stubGlobal('useStudentStore', () => studentStore);
    vi.stubGlobal('useSessionStore', () => sessionStore);
    vi.stubGlobal('useConfigStore', () => configStore);

    const Page = (await import('~~/app/pages/registration.vue')).default;

    const wrapper = await mountPage(Page);

    await wrapper.find('button').trigger('click');

    expect(studentStore.checkInOne).toHaveBeenCalledTimes(1);
    expect(studentStore.addToSession).toHaveBeenCalledTimes(1);
  });

  it('opens session selection flow for IEP student and does not auto-add to session', async () => {
    const { studentStore, sessionStore, configStore } = getStores();

    studentStore.students = [
      {
        submissionId: 'sub-2',
        submissionIdInt: '1002',
        FullName: 'B Student',
        FirstName: 'B',
        LastName: 'Student',
        GradeEntering: '5',
        IEP: 'Yes',
        CheckIn: '',
      },
    ] as any;

    vi.stubGlobal('useStudentStore', () => studentStore);
    vi.stubGlobal('useSessionStore', () => sessionStore);
    vi.stubGlobal('useConfigStore', () => configStore);

    const Page = (await import('~~/app/pages/registration.vue')).default;

    const wrapper = await mountPage(Page);

    await wrapper.find('button').trigger('click');

    expect(studentStore.checkInOne).toHaveBeenCalledTimes(1);
    expect(studentStore.addToSession).not.toHaveBeenCalled();

    const modal = wrapper.find('[data-testid="session-modal"]');
    expect(modal.attributes('data-open')).toBe('true');
  });
});
