import { Job } from 'bull';
import UserClient from '../../model/user-client';

const DELETED_USER_DEFAULTS = {
  email: 'commonvoice@mozilla.com',
  gender: '',
  age: '',
};

const accountProcessor = async (job: Job) => {
  const { user } = job.data as {
    user: Express.User;
  };
  try {
    // deleting account
    // get user
    // replace user PII with default info
    // keep client_id the same (unique)
    console.log(DELETED_USER_DEFAULTS);
    const userAccount = await UserClient.deleteAccount(user.emails);
    console.log('userAccount', userAccount);

    // deleting clips
    // find all users clips
    // get s3 paths
    // delete from database
    // delete from s3
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export default accountProcessor;
