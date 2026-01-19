// accent -> variant mapping
// array of tuples [accent_token, variant_token, delete_old?]
// If delete_old is true (default), unreferenced accents will be deleted
export type AV_MAPPING_TYPE = [string, string, boolean?][]

// accent -> accent mapping
// array of tuples [old_accent_token, new_accent_token, delete_old?]
// If delete_old is true (default), unreferenced accents will be deleted
export type AA_MAPPING_TYPE = [string, string, boolean?][]

// accent -> accent + variant mapping
// array of tuples [old_accent_token, new_accent_token, new_variant_token, delete_old?]
// If delete_old is true (default), unreferenced accents will be deleted
export type AAV_MAPPING_TYPE = [string, string, string, boolean?][]
