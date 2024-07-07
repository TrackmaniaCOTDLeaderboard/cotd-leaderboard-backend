### Cup Results

Get the Results of a Cup by `year`, `month` and `day`.

```http
GET https://api.cotd-leaderboard.com/results/cup/{year}/{month}/{day}?page={page}&version={version}&name={name}
```

#### Path Parameter

| Key       | Type     | Description       |
| --------- | -------- | ----------------- |
| `{year}`  | `number` | Year of the Cup.  |
| `{month}` | `number` | Month of the Cup. |
| `{day}`   | `number` | Day of the Cup.   |

#### Query Parameter

| Key         | Type     | Required | Default | Description                                                                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}`    | `number` | ❌       | `0`     | Page Size: `64` (One Division). See [Examples](#examples).                                                   |
| `{version}` | `number` | ✔        | `1`     | `1` for Main Cup (19:00 CET)<br>`2` for Night Rerun (03:00 CET)<br>`3` for Morning Rerun (11:00 CET)         |
| `{name}`    | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Cup Results 06.07.2024 | 19:00 CET](https://api.cotd-leaderboard.com/results/cup/2024/7/6)

[Cup Results 06.07.2024 | 19:00 CET | Filter name "gra"](https://api.cotd-leaderboard.com/results/cup/2024/7/6?name=gra)

[Cup Results 06.07.2024 | 19:00 CET | 65th-128th (2nd Division)](https://api.cotd-leaderboard.com/results/cup/2024/7/6?page=1&version=1)

#### Response

```json
[
  {
    "position": 1,
    "score": 1861,
    "player": {
      "name": "Larstm",
      "id": "e3ff2309-bc24-414a-b9f1-81954236c34b",
      "zone": {
        "displayId": "301ff622-7e13-11e8-8060-e284abfd2bc4",
        "id": "30201200-7e13-11e8-8060-e284abfd2bc4",
        "name": "Dortmund",
        "parentId": "30200d6a-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
