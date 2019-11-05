import { Request, Response } from 'express';

import getLeaderboard from './model/leaderboard';
import Model from './model';

const PromiseRouter = require('express-promise-router');

export default class Challenge {
  private model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  getRouter() {
    const router = PromiseRouter({ mergeParams: true });

    router.get('/:challenge/points', this.getPoints);
    router.get('/:challenge/progress', this.getWeeklyProgress);
    router.get('/:challenge/:locale/members/:type', this.getTopMembers);
    router.get('/:challenge/:locale/teams', this.getTopTeams);
    router.get(
      '/:challenge/:locale/contributors/:type',
      this.getTopContributors
    );

    return router;
  }

  getPoints = async (
    { client_id, params: { challenge } }: Request,
    response: Response
  ) => {
    response.json(await this.model.db.getUserPoints(client_id, challenge));
  };

  getWeeklyProgress = async (
    { client_id, params: { challenge } }: Request,
    response: Response
  ) => {
    const progress = await this.model.db.getWeeklyProgress(
      client_id,
      challenge
    );
    const weeklyProgress = {
      week: progress.week || null,
      user: {
        speak: progress.clip_count || null,
        speak_total: progress.week == 2 ? 100 : 200,
        listen: progress.vote_count || null,
        listen_total: progress.week == 2 ? 50 : 100,
      },
      team: { invite: progress.colleague_count || null, invite_total: 50 },
    };
    response.json(weeklyProgress);
  };

  getTopMembers = async (
    { client_id, params: { challenge, locale, type }, query }: Request,
    response: Response
  ) => {
    const atype = type == 'vote' ? 'vote' : 'clip';
    const cursor = query.cursor ? JSON.parse(query.cursor) : null;
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        type: atype,
        client_id,
        cursor,
        locale,
        arg: { scope: 'members', challenge },
      })
    );
  };

  getTopTeams = async (
    { client_id, params: { challenge, locale }, query }: Request,
    response: Response
  ) => {
    const cursor = query.cursor ? JSON.parse(query.cursor) : null;
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        client_id,
        cursor,
        locale,
        arg: { scope: 'teams', challenge },
      })
    );
  };

  getTopContributors = async (
    { client_id, params: { challenge, locale, type }, query }: Request,
    response: Response
  ) => {
    const atype = type == 'vote' ? 'vote' : 'clip';
    const cursor = query.cursor ? JSON.parse(query.cursor) : null;
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        type: atype,
        client_id,
        cursor,
        locale,
        arg: { scope: 'contributors', challenge },
      })
    );
  };
}
