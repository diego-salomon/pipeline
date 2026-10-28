import type { IdGenerator } from '../application/ports'

/** RFC 4122 v4 id. Available in browsers (secure context) and Node 20+. */
export const uuid: IdGenerator = () => crypto.randomUUID()
