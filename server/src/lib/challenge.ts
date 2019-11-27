import { Request, Response } from 'express';

import getLeaderboard from './model/leaderboard';
import { earnBonus, hasEarnedBonus } from './model/achievements';
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
    router.use('/:challenge/achievement/:bonus_type', this.getAchievement);

    return router;
  }

  getAchievement = async (
    {
      client_id,
      params: { challenge, bonus_type },
    }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    if (bonus_type === 'session') {
      // earn the invite_contribute_same_session achievement
      response.json(
        await earnBonus('invite_contribute_same_session', [
          client_id,
          client_id,
          challenge,
        ])
      );
    } else if (bonus_type == 'invite') {
      // return { firstInvite: boolean, hasAchieved: boolean } in the json
      // NOTE: easy to get confused about how should return true or false
      // if invite_send achievement is not earned yet, earn that achievement and return firstInvite: true
      // if invite_contribute_same_session is not earned yet, return hasAchieved: false
      const achievement = {
        firstInvite: await earnBonus('invite_send', [
          client_id,
          client_id,
          challenge,
        ]),
        hasAchieved: await hasEarnedBonus(
          'invite_contribute_same_session',
          client_id,
          challenge
        ),
      };
      response.json(achievement);
    }
  };

  getPoints = async (
    { client_id, params: { challenge } }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    response.json(await this.model.db.getPoints(client_id, challenge));
  };

  getWeeklyProgress = async (
    { client_id, params: { challenge } }: ChallengeRequestArgument & Request,
    response: Response
  ) => {
    // week starts from zero
    const progress = await this.model.db.getWeeklyProgress(
      client_id,
      challenge
    );
    const weeklyProgress = {
      week: Math.max(0, Math.min(progress.week, 2)),
      challengeComplete: progress.week > 2,
      user: {
        speak: progress.clip_count,
        speak_total: progress.week === 1 ? 50 : 100,
        listen: progress.vote_count,
        listen_total: progress.week === 1 ? 100 : 200,
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
