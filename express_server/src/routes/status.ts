import * as express from 'express'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.json({
    status: 'working',
    timestamp: +new Date()
  })
})

export default Router
