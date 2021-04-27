export const isProduction = process.env.NODE_ENV === 'production'
export const graphqlServiceHost = isProduction ? 'https://graphql.archipel.app' : 'http://localhost:5001'
export const authorizationTokenLocalstorageKey = 'archipel-authorization-token'
export const persistStorageKey = 'archipel-persisted-state'
