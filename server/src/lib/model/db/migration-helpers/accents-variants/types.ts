// accent -> variant mapping
// array of tuples [accent_token, variant_token, force_delete_old?]
// Unreferenced accents are already get deleted
export type AV_MAPPING_TYPE = [string, string, boolean?][]

// accent -> accent mapping
// array of tuples [old_accent_token, new_accent_token, force_delete_old?]
// Unreferenced accents are already get deleted
export type AA_MAPPING_TYPE = [string, string, boolean?][]

// accent -> accent + variant mapping
// array of tuples [old_accent_token, new_accent_token, new_variant_token, force_delete_old?]
// Unreferenced accents are already get deleted
export type AAV_MAPPING_TYPE = [string, string, string, boolean?][]
