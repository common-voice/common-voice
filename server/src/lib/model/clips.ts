import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

type PreprocessedClips = {
  id: number;
  path: string;
};

const Clips = {
  /**
   * Update avatar for user and return original value
   */

  async updateClipsDuration(clipsData: any) {
    try {
      await db.query(
        'UPDATE clips_metadata SET duration = ? WHERE clip_id = ?',
        [clipsData, clipsData]
      );
    } catch (error) {
      return error;
    }
  },

  async getBatchClipPathWithoutDuration(
    batchSize: number
  ): Promise<PreprocessedClips[]> {
    try {
      const [rows] = await db.query(
        `
        SELECT c.id,path FROM clips c 
        LEFT JOIN clips_metadata cm ON c.id = cm.clip_id
        WHERE cm.duration IS NULL
        LIMIT ?
        `,
        [batchSize]
      );
      return rows;
    } catch (error) {
      return error;
    }
  },

  async deleteAvatarClipURL(email: string) {
    await db.query(
      'UPDATE user_clients SET avatar_clip_url = NULL WHERE email = ?',
      [email]
    );
  },
};

export default Clips;
