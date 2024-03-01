import { app } from './app'
import { handle } from '@hono/node-server/vercel'

const vercelHandle = handle(app)

export { vercelHandle }
