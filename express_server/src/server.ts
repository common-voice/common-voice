import * as express from 'express'
import * as types from '@types/express'

import * as CommonVoiceConfig from './config-helper';
import routes from './routes/index'

const app:types.Express= express()
const PORT = CommonVoiceConfig.SERVER_PORT || 3000

app.use('/api', routes)

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`)
})
