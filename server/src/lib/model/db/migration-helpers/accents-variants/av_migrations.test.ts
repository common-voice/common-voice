/* eslint-disable @typescript-eslint/no-explicit-any */

// This tests the migration helper functions for accent and variant migrations
// It uses a mock database implementation to simulate the necessary database operations
//
// AV Migration Tests (accent => variant):
// - Users with single predefined accent and no variant migrate correctly
// - Users with existing variants are skipped
// - Users with multiple predefined accents are skipped
// - Users with only user-submitted accents are skipped
// - Accent deletion works when doDelete=true
// - Accent preservation works when doDelete=false
// - Multiple mappings process correctly
//
// AAV Migration Tests (accent => accent + variant):
// - Users without existing variants get both accent updated and variant added
// - Users with existing variants get accent updated but variant unchanged
// - Mixed scenarios handled correctly
// - Accent deletion works when doDelete=true
// - Accent preservation works when doDelete=false
//

import {
  findEligibleUsersForAccentVariantMigration,
  findEligibleUsersForAccentToAccentAndVariantMigration,
} from './users'
import { migrateAccentsToVariants_default } from './locales/default_av'
import { migrateAccentsToAccentsAndVariants_default } from './locales/default_aav'

// Mock database implementation
const createMockDb = () => {
  const data = {
    locales: [] as any[],
    accents: [] as any[],
    variants: [] as any[],
    user_client_accents: [] as any[],
    user_client_variants: [] as any[],
  }

  return {
    runSql: jest.fn(async (query: string, params: any[]) => {
      // Mock locale lookup
      if (query.includes('SELECT id FROM locales WHERE name')) {
        const locale = data.locales.find(l => l.name === params[0])
        return locale ? [{ id: locale.id }] : []
      }

      // Mock accent lookup
      if (query.includes('SELECT id') && query.includes('FROM accents')) {
        const accent = data.accents.find(
          a => a.locale_id === params[0] && a.accent_token === params[1]
        )
        return accent ? [{ id: accent.id }] : []
      }

      // Mock variant lookup
      if (query.includes('SELECT id') && query.includes('FROM variants')) {
        const variant = data.variants.find(
          v => v.locale_id === params[0] && v.variant_token === params[1]
        )
        return variant ? [{ id: variant.id }] : []
      }

      // Mock eligible users for AV migration
      if (
        query.includes('FROM user_client_accents uca') &&
        query.includes('JOIN accents a')
      ) {
        const locale_id = params[0]
        const accent_id = params[2]

        const users = data.user_client_accents
          .filter(
            uca => uca.locale_id === locale_id && uca.accent_id === accent_id
          )
          .filter(uca => {
            // No variant set
            return !data.user_client_variants.some(
              ucv =>
                ucv.client_id === uca.client_id && ucv.locale_id === locale_id
            )
          })
          .filter(uca => {
            // Has exactly one predefined accent
            const userAccents = data.user_client_accents.filter(
              u => u.client_id === uca.client_id && u.locale_id === locale_id
            )
            const predefinedAccents = userAccents.filter(u => {
              const accent = data.accents.find(a => a.id === u.accent_id)
              return (
                accent &&
                accent.user_submitted === 0 &&
                accent.accent_token !== 'unspecified'
              )
            })
            return (
              predefinedAccents.length === 1 &&
              predefinedAccents[0].accent_id === accent_id
            )
          })
          .map(uca => ({ client_id: uca.client_id }))

        return users
      }

      // Mock all users with old accent (for AAV - accent update)
      if (
        query.includes('SELECT DISTINCT client_id') &&
        query.includes('FROM user_client_accents') &&
        !query.includes('LEFT JOIN')
      ) {
        const locale_id = params[0]
        const accent_id = params[1]

        const users = data.user_client_accents
          .filter(
            uca => uca.locale_id === locale_id && uca.accent_id === accent_id
          )
          .map(uca => ({ client_id: uca.client_id }))

        return users
      }

      // Mock users without variant (for AAV - variant addition)
      if (
        query.includes('FROM user_client_accents uca') &&
        query.includes('LEFT JOIN user_client_variants ucv') &&
        query.includes('ucv.id IS NULL')
      ) {
        const locale_id = params[0]
        const accent_id = params[2]

        const users = data.user_client_accents
          .filter(
            uca => uca.locale_id === locale_id && uca.accent_id === accent_id
          )
          .filter(uca => {
            return !data.user_client_variants.some(
              ucv =>
                ucv.client_id === uca.client_id && ucv.locale_id === locale_id
            )
          })
          .map(uca => ({ client_id: uca.client_id }))

        return users
      }

      // Mock INSERT IGNORE for variants
      if (query.includes('INSERT IGNORE INTO user_client_variants')) {
        const values = query.match(/\((\?, \?, \?)\)/g)
        if (values) {
          const count = values.length
          for (let i = 0; i < count; i++) {
            const client_id = params[i * 3]
            const locale_id = params[i * 3 + 1]
            const variant_id = params[i * 3 + 2]

            // Only insert if doesn't exist
            const exists = data.user_client_variants.some(
              ucv =>
                ucv.client_id === client_id &&
                ucv.locale_id === locale_id &&
                ucv.variant_id === variant_id
            )

            if (!exists) {
              data.user_client_variants.push({
                id: data.user_client_variants.length + 1,
                client_id,
                locale_id,
                variant_id,
              })
            }
          }
        }
        return []
      }

      // Mock UPDATE for accents
      if (query.includes('UPDATE user_client_accents')) {
        const new_accent_id = params[0]
        const locale_id = params[1]
        const old_accent_id = params[2]
        const client_ids = params.slice(3)

        // Check for duplicate key violation
        for (const client_id of client_ids) {
          const hasBothAccents = data.user_client_accents.some(
            uca =>
              uca.client_id === client_id &&
              uca.locale_id === locale_id &&
              uca.accent_id === new_accent_id
          )
          if (hasBothAccents) {
            const err: any = new Error(
              `Duplicate entry '${client_id}-${locale_id}-${new_accent_id}' for key 'user_client_accents.client_accent'`
            )
            err.code = 'ER_DUP_ENTRY'
            err.errno = 1062
            throw err
          }
        }

        data.user_client_accents = data.user_client_accents.map(uca => {
          if (
            uca.locale_id === locale_id &&
            uca.accent_id === old_accent_id &&
            client_ids.includes(uca.client_id)
          ) {
            return { ...uca, accent_id: new_accent_id }
          }
          return uca
        })
        return []
      }

      // Mock DELETE for user accents
      if (query.includes('DELETE FROM user_client_accents')) {
        const locale_id = params[0]
        const accent_id = params[1]
        const client_ids = params.slice(2)

        data.user_client_accents = data.user_client_accents.filter(
          uca =>
            !(
              uca.locale_id === locale_id &&
              uca.accent_id === accent_id &&
              client_ids.includes(uca.client_id)
            )
        )
        return []
      }

      // Mock COUNT for remaining users with accent
      if (query.includes('SELECT COUNT(*) as count')) {
        const locale_id = params[0]
        const accent_id = params[1]

        const count = data.user_client_accents.filter(
          uca => uca.locale_id === locale_id && uca.accent_id === accent_id
        ).length

        return [{ count }]
      }

      // Mock DELETE accent
      if (query.includes('DELETE FROM accents')) {
        const accent_id = params[0]
        data.accents = data.accents.filter(a => a.id !== accent_id)
        return []
      }

      return []
    }),
    data, // Expose for test setup
  }
}

describe('Accent-Variant Migration Helpers', () => {
  describe('findEligibleUsersForAccentVariantMigration (AV)', () => {
    it('should return users with single predefined accent and no variant', async () => {
      const db = createMockDb()
      const locale_id = 1
      const accent_id = 10

      // Setup data
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'accent1',
        user_submitted: 0,
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const result = await findEligibleUsersForAccentVariantMigration(
        db,
        locale_id,
        accent_id
      )

      expect(result).toEqual(['user1'])
    })

    it('should skip users who already have a variant', async () => {
      const db = createMockDb()
      const locale_id = 1
      const accent_id = 10

      // Setup data
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'accent1',
        user_submitted: 0,
      })
      db.data.variants.push({ id: 1, locale_id: 1, variant_token: 'variant1' })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })
      db.data.user_client_variants.push({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 1,
      })

      const result = await findEligibleUsersForAccentVariantMigration(
        db,
        locale_id,
        accent_id
      )

      expect(result).toBeNull()
    })

    it('should skip users with multiple predefined accents', async () => {
      const db = createMockDb()
      const locale_id = 1
      const accent_id = 10

      // Setup data
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'accent1', user_submitted: 0 },
        { id: 11, locale_id: 1, accent_token: 'accent2', user_submitted: 0 }
      )
      db.data.user_client_accents.push(
        { client_id: 'user1', locale_id: 1, accent_id: 10 },
        { client_id: 'user1', locale_id: 1, accent_id: 11 }
      )

      const result = await findEligibleUsersForAccentVariantMigration(
        db,
        locale_id,
        accent_id
      )

      expect(result).toBeNull()
    })

    it('should skip users with only user-submitted accents', async () => {
      const db = createMockDb()
      const locale_id = 1
      const accent_id = 10

      // Setup data
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'accent1',
        user_submitted: 1,
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const result = await findEligibleUsersForAccentVariantMigration(
        db,
        locale_id,
        accent_id
      )

      expect(result).toBeNull()
    })
  })

  describe('findEligibleUsersForAccentToAccentAndVariantMigration (AAV)', () => {
    it('should return all users with old accent for update, and only users without variant for addition', async () => {
      const db = createMockDb()
      const locale_id = 1
      const old_accent_id = 10

      // Setup data
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'old_accent',
        user_submitted: 1,
      })
      db.data.variants.push({ id: 1, locale_id: 1, variant_token: 'variant1' })
      db.data.user_client_accents.push(
        { client_id: 'user1', locale_id: 1, accent_id: 10 }, // No variant
        { client_id: 'user2', locale_id: 1, accent_id: 10 } // Has variant
      )
      db.data.user_client_variants.push({
        id: 1,
        client_id: 'user2',
        locale_id: 1,
        variant_id: 1,
      })

      const result =
        await findEligibleUsersForAccentToAccentAndVariantMigration(
          db,
          locale_id,
          old_accent_id
        )

      expect(result).toEqual({
        usersForAccentUpdate: ['user1', 'user2'], // Both users get accent updated
        usersForVariantAddition: ['user1'], // Only user1 gets variant added
      })
    })

    it('should respect existing user variant choices', async () => {
      const db = createMockDb()
      const locale_id = 1
      const old_accent_id = 10

      // Setup data
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'old_accent',
        user_submitted: 1,
      })
      db.data.variants.push(
        { id: 1, locale_id: 1, variant_token: 'correct_variant' },
        { id: 2, locale_id: 1, variant_token: 'wrong_variant' }
      )
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })
      // User has "wrong" variant but we should respect their choice
      db.data.user_client_variants.push({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 2,
      })

      const result =
        await findEligibleUsersForAccentToAccentAndVariantMigration(
          db,
          locale_id,
          old_accent_id
        )

      expect(result).toEqual({
        usersForAccentUpdate: ['user1'], // User gets accent updated
        usersForVariantAddition: [], // User keeps their existing variant
      })
    })

    it('should return null when no users have the old accent', async () => {
      const db = createMockDb()
      const locale_id = 1
      const old_accent_id = 10

      const result =
        await findEligibleUsersForAccentToAccentAndVariantMigration(
          db,
          locale_id,
          old_accent_id
        )

      expect(result).toBeNull()
    })
  })

  describe('migrateAccentsToVariants_default (AV Migration)', () => {
    it('should migrate accent to variant and delete accent when doDelete=true', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'old_accent',
        user_submitted: 0,
      })
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const mapping: [string, string, boolean?][] = [
        ['old_accent', 'new_variant', true],
      ]

      await migrateAccentsToVariants_default(db, 'test', mapping)

      // Verify variant was added
      expect(db.data.user_client_variants).toContainEqual({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 1,
      })

      // Verify user accent was deleted
      expect(db.data.user_client_accents).toHaveLength(0)

      // Verify accent was deleted
      expect(db.data.accents).toHaveLength(0)
    })

    it('should keep accent when doDelete=false', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push({
        id: 10,
        locale_id: 1,
        accent_token: 'old_accent',
        user_submitted: 0,
      })
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const mapping: [string, string, boolean?][] = [
        ['old_accent', 'new_variant', false],
      ]

      await migrateAccentsToVariants_default(db, 'test', mapping)

      // Verify variant was added
      expect(db.data.user_client_variants).toHaveLength(1)

      // Verify user accent was NOT deleted
      expect(db.data.user_client_accents).toHaveLength(1)

      // Verify accent was NOT deleted
      expect(db.data.accents).toHaveLength(1)
    })

    it('should handle multiple mappings in sequence', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'accent1', user_submitted: 0 },
        { id: 11, locale_id: 1, accent_token: 'accent2', user_submitted: 0 }
      )
      db.data.variants.push(
        { id: 1, locale_id: 1, variant_token: 'variant1' },
        { id: 2, locale_id: 1, variant_token: 'variant2' }
      )
      db.data.user_client_accents.push(
        { client_id: 'user1', locale_id: 1, accent_id: 10 },
        { client_id: 'user2', locale_id: 1, accent_id: 11 }
      )

      const mapping: [string, string, boolean?][] = [
        ['accent1', 'variant1', true],
        ['accent2', 'variant2', true],
      ]

      await migrateAccentsToVariants_default(db, 'test', mapping)

      // Verify both variants were added
      expect(db.data.user_client_variants).toHaveLength(2)
      expect(db.data.user_client_variants).toContainEqual({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 1,
      })
      expect(db.data.user_client_variants).toContainEqual({
        id: 2,
        client_id: 'user2',
        locale_id: 1,
        variant_id: 2,
      })
    })
  })

  describe('migrateAccentsToAccentsAndVariants_default (AAV Migration)', () => {
    it('should update accent and add variant for users without existing variant', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'old_accent', user_submitted: 1 },
        { id: 20, locale_id: 1, accent_token: 'new_accent', user_submitted: 0 }
      )
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const mapping: [string, string, string, boolean?][] = [
        ['old_accent', 'new_accent', 'new_variant', true],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify accent was updated
      expect(db.data.user_client_accents).toContainEqual({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 20, // Updated to new accent
      })

      // Verify variant was added
      expect(db.data.user_client_variants).toContainEqual({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 1,
      })

      // Verify old accent was deleted
      expect(db.data.accents.find(a => a.id === 10)).toBeUndefined()
    })

    it('should update accent but NOT add variant for users with existing variant', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'old_accent', user_submitted: 1 },
        { id: 20, locale_id: 1, accent_token: 'new_accent', user_submitted: 0 }
      )
      db.data.variants.push(
        { id: 1, locale_id: 1, variant_token: 'new_variant' },
        { id: 2, locale_id: 1, variant_token: 'existing_variant' }
      )
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })
      db.data.user_client_variants.push({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 2, // User already has a different variant
      })

      const mapping: [string, string, string, boolean?][] = [
        ['old_accent', 'new_accent', 'new_variant', true],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify accent was updated
      expect(db.data.user_client_accents).toContainEqual({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 20,
      })

      // Verify variant was NOT changed (still has existing_variant)
      expect(db.data.user_client_variants).toHaveLength(1)
      expect(db.data.user_client_variants[0].variant_id).toBe(2)
    })

    it('should handle mixed scenarios in one migration', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'old_accent', user_submitted: 1 },
        { id: 20, locale_id: 1, accent_token: 'new_accent', user_submitted: 0 }
      )
      db.data.variants.push(
        { id: 1, locale_id: 1, variant_token: 'new_variant' },
        { id: 2, locale_id: 1, variant_token: 'existing_variant' }
      )
      db.data.user_client_accents.push(
        { client_id: 'user1', locale_id: 1, accent_id: 10 }, // No variant
        { client_id: 'user2', locale_id: 1, accent_id: 10 }, // Has variant
        { client_id: 'user3', locale_id: 1, accent_id: 10 } // No variant
      )
      db.data.user_client_variants.push({
        id: 1,
        client_id: 'user2',
        locale_id: 1,
        variant_id: 2,
      })

      const mapping: [string, string, string, boolean?][] = [
        ['old_accent', 'new_accent', 'new_variant', true],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify all accents were updated
      expect(
        db.data.user_client_accents.filter(uca => uca.accent_id === 20)
      ).toHaveLength(3)

      // Verify only users without variants got new variant
      const newVariants = db.data.user_client_variants.filter(
        ucv => ucv.variant_id === 1
      )
      expect(newVariants).toHaveLength(2)
      expect(newVariants.map(v => v.client_id).sort()).toEqual([
        'user1',
        'user3',
      ])

      // Verify user2 kept their existing variant
      const user2Variant = db.data.user_client_variants.find(
        ucv => ucv.client_id === 'user2'
      )
      expect(user2Variant?.variant_id).toBe(2)
    })

    it('should keep accent when doDelete=false', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'old_accent', user_submitted: 0 },
        { id: 20, locale_id: 1, accent_token: 'new_accent', user_submitted: 0 }
      )
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 10,
      })

      const mapping: [string, string, string, boolean?][] = [
        ['old_accent', 'new_accent', 'new_variant', false],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify old accent was NOT deleted
      expect(db.data.accents.find(a => a.id === 10)).toBeDefined()
    })

    it('should handle duplicate accent scenario by deleting old accent', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push(
        { id: 10, locale_id: 1, accent_token: 'old_accent', user_submitted: 1 },
        { id: 20, locale_id: 1, accent_token: 'new_accent', user_submitted: 0 }
      )
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })

      // User has BOTH old and new accent - this causes duplicate key error on UPDATE
      db.data.user_client_accents.push(
        { id: 1, client_id: 'user1', locale_id: 1, accent_id: 10 }, // old accent
        { id: 2, client_id: 'user1', locale_id: 1, accent_id: 20 } // new accent (already has it!)
      )

      const mapping: [string, string, string, boolean?][] = [
        ['old_accent', 'new_accent', 'new_variant', true],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify old accent entry was deleted (not updated, because would cause duplicate)
      const userAccents = db.data.user_client_accents.filter(
        uca => uca.client_id === 'user1' && uca.locale_id === 1
      )
      expect(userAccents).toHaveLength(1)
      expect(userAccents[0].accent_id).toBe(20) // Only new accent remains

      // Verify variant was added
      expect(db.data.user_client_variants).toContainEqual({
        id: 1,
        client_id: 'user1',
        locale_id: 1,
        variant_id: 1,
      })
    })

    it('should skip UPDATE when old and new accent are the same', async () => {
      const db = createMockDb()

      // Setup data
      db.data.locales.push({ id: 1, name: 'test' })
      db.data.accents.push({
        id: 20,
        locale_id: 1,
        accent_token: 'correct_accent',
        user_submitted: 0,
      })
      db.data.variants.push({
        id: 1,
        locale_id: 1,
        variant_token: 'new_variant',
      })
      db.data.user_client_accents.push({
        client_id: 'user1',
        locale_id: 1,
        accent_id: 20,
      })

      const mapping: [string, string, string, boolean?][] = [
        ['correct_accent', 'correct_accent', 'new_variant', false],
      ]

      await migrateAccentsToAccentsAndVariants_default(db, 'test', mapping)

      // Verify accent unchanged
      expect(db.data.user_client_accents[0].accent_id).toBe(20)

      // Verify variant was added
      expect(db.data.user_client_variants).toHaveLength(1)
    })
  })
})
