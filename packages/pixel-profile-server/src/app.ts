import githubContributionsHandle from './github-contributions'
import githubStatsHandle from './github-stats'
import githubStatsCrtHandle from './github-stats-crt'
import statusHandle from './status'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.route('/github-stats', githubStatsHandle)
app.route('/github-stats-crt', githubStatsCrtHandle)
app.route('/github-contributions', githubContributionsHandle)
app.route('/status', statusHandle)

export { app }
