const isValidJobId = (jobId: string) => {
  console.log('jobId', jobId);
  const numericalId = +jobId;
  console.log('in validation', numericalId);
  if (numericalId <= 0) return false;
  if (Math.floor(numericalId) !== +numericalId) return false;

  return true;
};

export default isValidJobId;
