const User = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    authId: { type: 'string' },
    email: {
      type: 'string',
      nullable: true,
    },
    googleId: {
      type: 'string',
      nullable: true,
    },
    firstName: {
      type: 'string',
      nullable: true,
    },
    lastName: {
      type: 'string',
      nullable: true,
    },
    locale: { type: 'string' },
    emailVerified: { type: 'boolean' },
    otpVerified: { type: 'boolean' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    deletedAt: {
      type: 'string',
      nullable: true,
    },
  },
}

const UserDetail = {
  allOf: [
    { $ref: '#/components/schemas/User' },
    {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
      },
    },
  ],
}

const UserConsentedApp = {
  type: 'object',
  properties: {
    appId: { type: 'number' },
    appName: { type: 'string' },
  },
}

const PutUserReq = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    isActive: { type: 'boolean' },
    locale: { type: 'string' },
    roles: {
      type: 'array',
      items: { type: 'string' },
    },
  },
}

module.exports = {
  User, UserDetail, PutUserReq, UserConsentedApp,
}
