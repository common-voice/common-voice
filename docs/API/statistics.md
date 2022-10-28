# Statistics

All statistics provide the increase in metrics over a 12 month period in monthly intervals.

## How statistics are calculated

- If a month has no increase, it is skipped.
- The date is provided as a key for that month (including a day value).
- If a date has a day value that is **not** the final day of the month (e.g. 2022-12-15) that was the last time a value was added the interval still includes that whole month
- _unless_ the month in question is the current month (i.e. if current date = 2022-12-16, the stats for that month are up until current day).

## Endpoints

Statistics endpoints are accessed at `/api/v1/statistics/<stat name>`

### Downloads

All downloads of any dataset:

`/api/v1/statistics/downloads`

### Clips

All clip contributions (not unique to user or sentence):
`/api/v1/statistics/clips`

#### Options

Filter by only the rejected clips by using query parameter:

`?filter=rejected`

### Speaker

All unique speaker contributors:

`/api/v1/statistics/speakers`

### Accounts

All users that have signed up for an account (i.e. provided an email):
`/api/v1/statistics/accounts`

### Sentences

All Sentences currently available:

`/api/v1/statistics/sentences`

#### Options

Filter by all sentences that have been read (a clip exists) multiple times:

`?filter=duplicate`

### Structure of response

Example of JSON Response:

```json
{
  "total_count": 11,
  "monthly_increase": {
    "2022-10-26": 3,
    "2022-7-21": 2,
    "2022-6-14": 4,
    "2022-5-13": 2
  },
  "monthly_running_totals": {
    "2022-10-26": 11,
    "2022-7-21": 8,
    "2022-6-14": 6,
    "2022-5-13": 2
  },
  "metadata": { "last_fetched": "2022-10-26T12:59:56.397Z" }
}
```

`monthly_increase` represents the values added for that month only (the day represents the last time a value was added in the month).

`monthly_running_totals` represents the running total of statistics (total existing value + current month value).

`total_count` represents the sum of all monthly increases for the past 12 months

## Implementation Details

- All statistics are cached daily, meaning results will be the same for 24 hours after the first request (the date/time of the request is returned in `metadata`)
