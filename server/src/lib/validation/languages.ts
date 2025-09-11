import { AllowedSchema } from 'express-json-validator-middleware'

export const accentSchema: AllowedSchema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
    clientId: {
      type: 'string',
    },
  },
}

export const variantSchema: AllowedSchema = {
  type: 'object',
  required: ['id', 'locale', 'name', 'tag'],
  properties: {
    id: {
      type: 'number',
    },
    locale: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    tag: {
      type: 'string',
    },
  },
}

export const sentenceCountSchema: AllowedSchema = {
  type: 'object',
  required: ['currentCount', 'targetSentenceCount'],
  properties: {
    currentCount: {
      type: 'number',
    },
    targetSentenceCount: {
      type: 'number',
    },
  },
}

export const languageSchema: AllowedSchema = {
  type: 'object',
  required: ['id', 'name', 'sentenceCount', 'native_name', 'text_direction'],
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    sentenceCount: {
      type: 'object',
      required: ['currentCount', 'targetSentenceCount'],
      properties: {
        currentCount: {
          type: 'number',
        },
        targetSentenceCount: {
          type: 'number',
        },
      },
    },
    target_sentence_count: {
      type: 'number',
    },
    is_contributable: {
      type: 'boolean',
    },
    is_translated: {
      type: 'boolean',
    },
    native_name: {
      type: 'string',
    },
    text_direction: {
      type: 'string',
    },
  },
}

export const userVariantSchema: AllowedSchema = {
  type: 'object',
  required: ['id', 'locale', 'name', 'tag', 'is_preferred_option'],
  properties: {
    id: {
      type: 'number',
    },
    locale: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    tag: {
      type: 'string',
    },
    is_preferred_option: {
      type: 'boolean',
    },
  },
}

export const userLanguageSchema: AllowedSchema = {
  type: 'object',
  required: ['locale'],
  properties: {
    locale: {
      type: 'string',
    },
    variant: {
      type: 'object',
      required: ['id', 'locale', 'name', 'tag'],
      properties: {
        id: {
          type: 'number',
        },
        locale: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        tag: {
          type: 'string',
        },
      },
    },
    accents: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          token: {
            type: 'string',
          },
          clientId: {
            type: 'string',
          },
        },
      },
    },
  },
}

export const anonUserMetadataSchema: AllowedSchema = {
  type: 'object',
  required: [],
  properties: {
    gender: { type: "string" },
    languages: {
      type: 'array',
      items: {
        type: 'object',
        required: ['locale'],
        properties: {
          locale: {
            type: 'string',
          },
          variant: {
            type: 'object',
            required: ['id'],
            properties: {
              id: {
                type: 'number',
              },
              locale: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              tag: {
                type: 'string',
              },
              is_preferred_option: {
                type: 'boolean',
              },
            },
          },
          accents: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: {
                  type: 'number',
                },
                name: {
                  type: 'string',
                },
                token: {
                  type: 'string',
                },
                clientId: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}
