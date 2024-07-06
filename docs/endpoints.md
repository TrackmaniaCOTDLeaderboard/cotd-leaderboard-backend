# Endpoints

## Leaderboard

### Global Cup Leaderboard

```http
GET https://api.cotd-leaderboard.com/leaderboard/cup/global?page={page}&version={version}&name={name}
```

#### Query Parameter

| Key         | Type     | Required | Default | Description |
| ----------- | -------- | -------- | ------- | ----------- |
| `{page}`    | `number` | ❌       | `0`     |             |
| `{version}` | `number` | ✔        | -       |             |
| `{name}`    | `string` | ✔        | -       |             |

#### Example

### Monthly Cup Leaderboard

```http
GET https://api.cotd-leaderboard.com/leaderboard/cup/monthly/{year}/{month}?page={page}&version={version}&name={name}
```

#### Path Parameter

| Key       | Type     | Description |
| --------- | -------- | ----------- |
| `{year}`  | `number` |             |
| `{month}` | `number` |             |

#### Query Parameter

| Key         | Type     | Required | Default | Description |
| ----------- | -------- | -------- | ------- | ----------- |
| `{page}`    | `number` | ❌       | `0`     |             |
| `{version}` | `number` | ✔        | -       |             |
| `{name}`    | `string` | ✔        | -       |             |

## Results

###
