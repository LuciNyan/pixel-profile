import githubRepoHandle from './github-repo'
import githubStatsHandle from './github-stats'
import githubStatsCrtHandle from './github-stats-crt'
import statusHandle from './status'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.route('/github-stats', githubStatsHandle)
app.route('/github-stats-crt', githubStatsCrtHandle)
app.route('/github-repo', githubRepoHandle)
app.route('/status', statusHandle)

export { app }
