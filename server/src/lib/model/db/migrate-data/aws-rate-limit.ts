const TIMESTEP = 1000;
const AWS_MAX_GET_CALLS_PER_TIMESTEP = 800;

let requestTimesInTimestep: number[] = [];

export async function rateLimit() {
  const now = Date.now();
  const index = requestTimesInTimestep.findIndex(t => t > now - TIMESTEP);
  if (index === -1) return;
  requestTimesInTimestep = requestTimesInTimestep.slice(index);
  if (requestTimesInTimestep.length > AWS_MAX_GET_CALLS_PER_TIMESTEP) {
    await new Promise(resolve =>
      setTimeout(resolve, now - requestTimesInTimestep[0])
    );
  }
  requestTimesInTimestep.push(Date.now());
}
