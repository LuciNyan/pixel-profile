import githubStatsHandle from './github-stats'
import statusHandle from './status'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.route('/github-stats', githubStatsHandle)
app.route('/status', statusHandle)

export { app }
