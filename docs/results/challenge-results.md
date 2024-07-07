### Challenge Results

Get the Results of a Challenge by `year`, `month` and `day`.

```http
GET https://api.cotd-leaderboard.com/results/challenge/{year}/{month}/{day}?page={page}&version={version}&name={name}
```

#### Path Parameter

| Key       | Type     | Description             |
| --------- | -------- | ----------------------- |
| `{year}`  | `number` | Year of the Challenge.  |
| `{month}` | `number` | Month of the Challenge. |
| `{day}`   | `number` | Day of the Challenge.   |

#### Query Parameter

| Key         | Type     | Required | Default | Description                                                                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}`    | `number` | ❌       | `0`     | Page Size: `64` (One Division). See [Examples](#examples).                                                   |
| `{version}` | `number` | ✔        | `1`     | `1` for Main Cup (19:00 CET)<br>`2` for Night Rerun (03:00 CET)<br>`3` for Morning Rerun (11:00 CET)         |
| `{name}`    | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Challenge Results 06.07.2024 | 19:00 CET](https://api.cotd-leaderboard.com/results/challenge/2024/7/6)

[Challenge Results 06.07.2024 | 19:00 CET | Filter name "gra"](https://api.cotd-leaderboard.com/results/challenge/2024/7/6?name=gra)

[Challenge Results 06.07.2024 | 19:00 CET | 65th-128th (2nd Division)](https://api.cotd-leaderboard.com/results/challenge/2024/7/6?page=1&version=1)

#### Response

```json
[
  {
    "position": 1,
    "score": 44868,
    "player": {
      "name": "cinxsss",
      "id": "04a64a68-7370-4f67-90b2-025e1006631a",
      "zone": {
        "displayId": "3020a27d-7e13-11e8-8060-e284abfd2bc4",
        "id": "3020a27d-7e13-11e8-8060-e284abfd2bc4",
        "name": "Norway",
        "parentId": "301e2106-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
