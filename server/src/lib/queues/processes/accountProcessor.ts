import { Job } from 'bull';
import UserClient from '../../model/user-client';

const DELETED_USER_DEFAULTS = {
  PROFILE: {
    email: 'commonvoice@mozilla.com',
    username: '',
    basket_token: '',
    visable: 0,
    skip_submission_feedback: 0,
    has_computed_goals: 0,
    has_login: 0,
  },
  DEMOGRAPHICS: {
    gender: '',
    age: '',
  },
};

const USER_DELETE_TABLES = [
  'accents',
  'awards',
  'custom_goals',
  'demographics',
  'earn',
  'enroll',
  'reached_goals',
  'skipped_clips',
  'skipped_sentences',
  'streaks',
  'user_client_accents',
  'user_client_locale_buckets',
  'user_client_newsletter_prefs',
  'user_client_takeouts',
  'user_client_variants',
];

const USER_REPLACE_TABLES = ['reported_clips', 'reported_sentences', 'votes'];
const GENERIC_EMAIL = 'commonvoice@mozillafoundation.org';

const accountProcessor = async (job: Job) => {
  try {
    const { emails } = job.data;
    if (!emails) {
      throw new Error('No emails found');
    }

    // user can have mulitple emails
    const emailList = emails.reduce((list: string[], email: any) => {
      list.push(email.value);
      return list;
    }, []);

    const deletedUserId = await UserClient.findClientId(emailList[0]);

    if (!deletedUserId) throw new Error('No client id found');
    //get generic account (if exists)
    let genericAccountId = await UserClient.findClientId(GENERIC_EMAIL);

    if (!genericAccountId) {
      console.log('no generic account');
      genericAccountId = await UserClient.createGenericAccount(GENERIC_EMAIL);
    }

    if (!genericAccountId) throw new Error('Cannot access generic account');
    console.log('generic ID', genericAccountId);

    // Just deleting account
    // Replace all clips client_id w/ generic account
    // delete account
    await UserClient.replaceClipOwner(deletedUserId, genericAccountId);

    console.log('processing', emailList);

    const userAccount = await UserClient.deleteAccount(emailList);
    console.log('userAccount', userAccount);

    // deleting clips
    // find all users clips
    // get s3 paths
    // delete from s3
    // delete from database
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export default accountProcessor;
