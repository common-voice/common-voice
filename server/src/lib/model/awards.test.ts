import Awards from './awards'

describe('Test Custom Awards module', () => {
  it('should return correct date', () => {
    const db = { query: jest.fn(async () => {}) }

    Awards.checkProgress('test_id', { id: 1 }, db)
    expect(false).toBe(true)
  })
})
