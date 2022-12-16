# Statistics

All statistics provide the increase in metrics for a given year in monthly intervals.

## How statistics are calculated

- If a month has no increase, it is skipped.
- The date is provided as a key for that month (including a day value).
- If a date has a day value that is **not** the final day of the month (e.g. 2022-12-15) that was the last time a value was added the interval still includes that whole month
- _unless_ the month in question is the current month (i.e. if current date = 2022-12-16, the stats for that month are up until current day).

## Endpoints

Statistics endpoints are accessed at `/api/v1/statistics/<stat name>`. All endpoints can be queried by year, e.g. `?year=2022`. By default each endpoint returns the statistics for the current year. Where applicable, it can also be combined with other options, e.g. `?filter=rejected&year=2022`.

### Downloads

All downloads of any dataset:

GET `/api/v1/statistics/downloads` HTTP/1.1

### Clips

All clip contributions (not unique to user or sentence):
GET `/api/v1/statistics/clips` HTTP/1.1

#### Options

Filter by only the rejected clips by using query parameter:

`?filter=rejected`

### Speaker

All unique speaker contributors:

GET `/api/v1/statistics/speakers` HTTP/1.1

#### Note:
The number of unique speaker contributors is based on the given year. For example, a person who contributed in 2021 and 2022 will show up as a unique contributor in both time periods but will be counted only once for the time independent `total_count`.

### Accounts

All users that have signed up for an account (i.e. provided an email):
GET `/api/v1/statistics/accounts` HTTP/1.1

### Sentences

All Sentences currently available:

GET `/api/v1/statistics/sentences` HTTP/1.1

#### Options

Filter by all sentences that have been read (a clip exists) multiple times:

`?isDuplicate=true`

### Structure of response

Example of JSON Response:

```json
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "yearly_sum": 11,
  "total_count": 109,
  "monthly_increase": {
    "2022-10-26": 3,
    "2022-07-21": 2,
    "2022-06-14": 4,
    "2022-05-13": 2
  },
  "monthly_running_totals": {
    "2022-10-26": 11,
    "2022-07-21": 8,
    "2022-06-14": 6,
    "2022-05-13": 2
  },
  "metadata": { "last_fetched": "2022-10-26T12:59:56.397Z" }
}
```

`monthly_increase` represents the values added for that month only (the day represents the last time a value was added in the month).

`monthly_running_totals` represents the running total of statistics (total existing value + current month value).

`yearly_sum` represents the sum of all monthly increases for the given year.

`total_count` represents the total count of all the values in the database (not dependent on time).

## Implementation Details

- All statistics are cached daily, meaning results will be the same for 24 hours after the first request (the date/time of the request is returned in `metadata`)
