import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorageState } from './store-hooks';

describe('useLocalStorageState', () => {
  beforeEach(() => {
    // clear localstorage
    window.localStorage.clear();
  });

  it('should return default value and a function to set value', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-value', 'test-key')
    );

    const [value, setValue] = result.current;

    expect(value).toBe('test-value');
    expect(typeof setValue).toBe('function');
  });

  it('should change value when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-value', 'test-key')
    );

    const [value, setValue] = result.current;

    expect(value).toBe('test-value');

    act(() => {
      setValue('another-test-value');
    });

    const [updatedValue] = result.current;

    expect(updatedValue).toBe('another-test-value');
  });

  it('should use store a value by key', () => {
    // set an initial value
    const { result } = renderHook(() =>
      useLocalStorageState('test-value', 'test-key')
    );
    const [_value, setValue] = result.current; // eslint-disable-line @typescript-eslint/no-unused-vars
    act(() => {
      setValue('another-test-value');
    });
    const [updatedValue] = result.current;
    expect(updatedValue).toBe('another-test-value');

    // create a seperate hook
    const { result: secondResult } = renderHook(() =>
      useLocalStorageState('some-other-test-value', 'test-key')
    );
    const [secondValue] = secondResult.current;
    expect(secondValue).not.toBe('some-other-test-value');
    expect(secondValue).toBe('another-test-value');
  });

  describe('no key supplied', () => {
    it('acts like a normal useState', () => {
      // set an initial value, no key
      const { result } = renderHook(() => useLocalStorageState('test-value'));
      const [_value, setValue] = result.current; // eslint-disable-line @typescript-eslint/no-unused-vars
      act(() => {
        setValue('another-test-value');
      });
      const [updatedValue] = result.current;
      expect(updatedValue).toBe('another-test-value');

      // create a seperate hook, no key
      const { result: secondResult } = renderHook(() =>
        useLocalStorageState('some-other-test-value')
      );
      const [secondValue] = secondResult.current;
      expect(secondValue).not.toBe('another-test-value');
      expect(secondValue).toBe('some-other-test-value');
    });
  });

  describe(`if the localstorage API isn't available`, () => {
    beforeAll(() => {
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Mock error');
      });

      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('Mock error');
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('acts like a normal useState', () => {
      // set an initial value
      const { result } = renderHook(() =>
        useLocalStorageState('test-value', 'test-key-2')
      );
      const [_value, setValue] = result.current; // eslint-disable-line @typescript-eslint/no-unused-vars
      act(() => {
        setValue('another-test-value');
      });
      const [updatedValue] = result.current;
      expect(updatedValue).toBe('another-test-value');

      // create a seperate hook
      const { result: secondResult } = renderHook(() =>
        useLocalStorageState('some-other-test-value', 'test-key-2')
      );
      const [secondValue] = secondResult.current;
      expect(secondValue).not.toBe('another-test-value');
      expect(secondValue).toBe('some-other-test-value');
    });
  });
});
