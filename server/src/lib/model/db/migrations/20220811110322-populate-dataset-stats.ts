export const up = async function (db: any): Promise<any> {
  //   await db.runSql(`INSERT INTO voiceweb.locale_datasets (dataset_id,locale_id,total_clips_duration,valid_clips_duration,average_clips_duration,total_users,size,checksum) VALUES
  // 		(1,1,2893916688,2096565742,4274,33541,22487893709,NULL),
  // 		(1,30,526772160,505144885,3942,2249,4151335731,NULL),
  // 		(1,43,284516280,266426351,3792,1697,2245754155,NULL),
  // 		(1,28,79378296,76593595,4089,365,622806292,NULL),
  // 		(1,18,26068056,10630590,2801,82,201554829,NULL),
  // 		(1,27,9802458,3223427,4264,33,77597058,NULL),
  // 		(1,147,23086560,18733264,3708,203,182107529,NULL),
  // 		(1,149,73813776,73042166,3572,117,555266991,NULL),
  // 		(1,78,22124544,20968646,4642,63,152729320,NULL),
  // 		(1,45,6320352,5898365,3149,30,48777677,NULL);
  // 		`);
};

export const down = function (): Promise<any> {
  return null;
};
