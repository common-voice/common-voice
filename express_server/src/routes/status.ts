import * as express from 'express'
import * as types from '@types/express'

const Router:types.Router = express.Router()

Router.get('/', (req:types.Request, res:types.Response) => {
  res.json({
    status: 'working',
    timestamp: +new Date()
  })
})

export default Router
