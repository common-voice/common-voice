import { Request, Response } from 'express';
import * as fs from 'fs';

const PromiseRouter = require('express-promise-router');

// [TODO](can) mock data for challenge board, remove it when implementing detailes of the challenge APIs.
const getMockData = () => {
  let data = null;
  try {
    data = JSON.parse(fs.readFileSync('./challenge-mock-data.json', 'utf-8'));
  } catch (err) {
    console.error(err, 'could not load config.json, using defaults');
  }
  return data;
};

export default class Challenge {
  getRouter() {
    const router = PromiseRouter({ mergeParams: true });

    router.post('/points', this.getPoints);
    router.post('/progress/:date', this.getWeeklyProgress);
    router.post(':locale/members/:type', this.getTopMembers);
    router.post(':locale/teams/:type', this.getTopTeams);
    router.post(':locale/contributors/:type', this.getTopContributors);

    return router;
  }

  getPoints = async ({ client_id }: Request, response: Response) => {
    console.log(`[DEBUG] Challenge.getPoints() - client_id:${client_id}`);
    let data = getMockData();

    response.json(data.challengePoint);
  };

  getWeeklyProgress = async (
    { client_id, params: { date } }: Request,
    response: Response
  ) => {
    console.log(
      `[DEBUG] Challenge.getWeeklyProgress - client_id:${client_id}, date:${JSON.stringify(
        date
      )}`
    );
    let data = getMockData();

    response.json(data.weeklyChallenge);
  };

  getTopMembers = async (
    { client_id, params: { locale, type } }: Request,
    response: Response
  ) => {
    console.log(
      `[DEBUG] Challenge.getTopMembers - locale: ${locale}, client_id:${client_id}, type:${type}`
    );
    let data = getMockData();

    if (type === 'recorded') {
      response.json(data.topMember.recorded);
    } else if (type === 'validated') {
      response.json(data.topMember.validated);
    } else {
      response.json({});
    }
  };

  getTopTeams = async (
    { client_id, params: { locale, type } }: Request,
    response: Response
  ) => {
    console.log(
      `[DEBUG] Challenge.getTopTeams - client_id:${client_id}, locale: ${locale}, type:${type}`
    );
    let data = getMockData();

    if (type === 'recorded') {
      response.json(data.topTeams.recorded);
    } else if (type === 'validated') {
      response.json(data.topTeams.validated);
    } else {
      response.json({});
    }
  };

  getTopContributors = async (
    { client_id, params: { locale, type } }: Request,
    response: Response
  ) => {
    console.log(
      `[DEBUG] Challenge.getTopContributors - client_id:${client_id} locale: ${locale}, type:${type}`
    );
    let data = getMockData();

    if (type === 'recorded') {
      response.json(data.topContributors.recorded);
    } else if (type === 'validated') {
      response.json(data.topContributors.validated);
    } else {
      response.json({});
    }
  };
}
