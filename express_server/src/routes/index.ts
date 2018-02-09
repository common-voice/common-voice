import {Router} from 'express'

import statusRouter from './status'

const route = Router()

route.use('/status', statusRouter)

export default route
