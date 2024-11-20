import { Request, Response } from 'express'

export const postFxaEventsHandler = async (req: Request, res: Response) => {
  const { events } = req.eventToken || { events: {} }
  console.log({ receivedEvents: events })
  res.sendStatus(200)
}
