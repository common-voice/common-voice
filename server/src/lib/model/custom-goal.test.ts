import customGoal from './custom-goal'

const timeout = 20000 // 20

const mockQuery = jest.fn()

jest.mock('./db/mysql', () => {
  return {
    getMySQLInstance: jest.fn().mockReturnValue({
      query: mockQuery,
    }),
  }
})

// Import after mocking to get the mocked version
import { getMySQLInstance } from './db/mysql'

describe('customGoal', () => {
  let mockDb: ReturnType<typeof getMySQLInstance>

  beforeEach(() => {
    jest.clearAllMocks()
    mockQuery.mockReset()
    mockQuery.mockResolvedValue([[]])
  })

  describe('create', () => {
    test(
      'insert daily customGoal for listen to 15 clips',
      async () => {
        const client_id = 'xxx123'
        const locale = 'en'
        const params = {
          type: 'listen',
          daysInterval: 1,
          amount: 15,
        }

        const mockInsertResult = [{ insertId: 123 }, null]
        mockQuery.mockResolvedValueOnce(mockInsertResult)

        const result = await customGoal.create(client_id, locale, params)

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO goals'),
          expect.arrayContaining([
            params.type,
            params.daysInterval,
            params.amount,
          ])
        )
        expect(result).toEqual(expect.objectContaining({ id: 123, ...params }))
      },
      timeout
    )

    test(
      'should handle database errors properly',
      async () => {
        const client_id = 'xxx123'
        const locale = 'en'
        const params = {
          type: 'exercise',
          daysInterval: 2,
          amount: 30,
        }

        // Mock a database error
        const mockError = new Error('Database error')
        mockQuery.mockRejectedValueOnce(mockError)

        // Act & Assert
        await expect(
          customGoal.create(client_id, locale, params)
        ).rejects.toThrow('Database error')
        expect(mockQuery).toHaveBeenCalled()
      },
      timeout
    )
  })
})
