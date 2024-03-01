import patInfo from './pat-info'
import up from './up'
import { Hono } from 'hono'

const status = new Hono()

status.route('/pat-info', patInfo)
status.route('/up', up)

export default status
