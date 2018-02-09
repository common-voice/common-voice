import * as express from 'express'
import { CommonVoiceConfig, getConfig } from './config-helper';

const app = express()
const PORT = CommonVoiceConfig.SERVER_PORT || 3000



app.listen(PORT, function () {
  console.log('Listening on post ${PORT}')
})
