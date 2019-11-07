import { Request, Response } from 'express';

import getLeaderboard from './model/leaderboard';
import Model from './model';
import { ChallengeRequestArgument } from 'common/challenge';

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
    { client_id, params: { challenge } }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    response.json(await this.model.getPoints(client_id, challenge));
  };

  getWeeklyProgress = async (
    { client_id, params: { challenge } }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    // week starts from zero
    const progress = await this.model.getWeeklyProgress(client_id, challenge);
    const weeklyProgress = {
      week: progress.week,
      user: {
        speak: progress.clip_count,
        speak_total: progress.week === 1 ? 100 : 200,
        listen: progress.vote_count,
        listen_total: progress.week === 1 ? 50 : 100,
      },
      team: { invite: progress.teammate_count, invite_total: 50 },
    };
    response.json(weeklyProgress);
  };

  getTopMembers = async (
    {
      client_id,
      params: { challenge, locale, type },
      query,
    }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        type,
        client_id,
        cursor: query.cursor ? JSON.parse(query.cursor) : null,
        locale,
        arg: { scope: 'members', challenge },
      })
    );
  };

  getTopTeams = async (
    {
      client_id,
      params: { challenge, locale },
      query,
    }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        client_id,
        cursor: query.cursor ? JSON.parse(query.cursor) : null,
        locale,
        arg: { scope: 'teams', challenge },
      })
    );
  };

  getTopContributors = async (
    {
      client_id,
      params: { challenge, locale, type },
      query,
    }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    response.json(
      await getLeaderboard({
        dashboard: 'challenge',
        type,
        client_id,
        cursor: query.cursor ? JSON.parse(query.cursor) : null,
        locale,
        arg: { scope: 'contributors', challenge },
      })
    );
  };
}
