// Base URL for pre-compiled datasheets JSON files in the cv-datasheets repo.
// The filename (e.g. "datasheets-2026-03-06.json") is provided via CLI.
// Override via DATASHEETS_BASE_URL env var to point to an unmerged branch or commit:
//   DATASHEETS_BASE_URL=https://raw.githubusercontent.com/common-voice/cv-datasheets/<commit>/releases
export const DATASHEETS_BASE_URL =
  process.env.DATASHEETS_BASE_URL ||
  'https://raw.githubusercontent.com/common-voice/cv-datasheets/main/releases'

export type Modality = 'scripted' | 'spontaneous' | 'code_switching'

// Maps CLI modality names to the keys used in datasheets.json.
// Once cv-datasheets adopts the canonical names this map can be removed.
export const MODALITY_TO_DATASHEETS_KEY: Record<Modality, string> = {
  scripted: 'scs',
  spontaneous: 'sps',
  code_switching: 'cs',
}
