### Monthly Cup Leaderboard

Get the Monthly Cup of the Day Leaderboard.

```http
GET https://api.cotd-leaderboard.com/leaderboard/cup/monthly/{year}/{month}?page={page}&version={version}&name={name}
```

#### Path Parameter

| Key       | Type     | Description              |
| --------- | -------- | ------------------------ |
| `{year}`  | `number` | Year of the leaderbord.  |
| `{month}` | `number` | Month of the leaderbord. |

#### Query Parameter

| Key         | Type     | Required | Default | Description                                                                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}`    | `number` | ❌       | `0`     | Page Size: `100`. See [Examples](#examples).                                                                 |
| `{version}` | `number` | ✔        | `1`     | `1` for Main Cup (19:00 CET)<br>`2` for Night Rerun (03:00 CET)<br>`3` for Morning Rerun (11:00 CET)         |
| `{name}`    | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Monthly Cup Leaderboard | 07 / 2024 | 19:00 CET](https://api.cotd-leaderboard.com/leaderboard/cup/monthly/2024/7?page=0&version=1)

[Monthly Cup Leaderboard | 07 / 2024 | 19:00 CET | Filter name "gra"](https://api.cotd-leaderboard.com/leaderboard/cup/monthly/2024/7?page=0&version=1&name=gra)

[Monthly Cup Leaderboard | 07 / 2024 | 19:00 CET | 101th-200th](https://api.cotd-leaderboard.com/leaderboard/cup/monthly/2024/7?page=1&version=1)

#### Response

```json
[
  {
    "amount": 2,
    "points": 1751,
    "first": 1,
    "second": 0,
    "third": 0,
    "top8": 1,
    "top16": 0,
    "top32": 0,
    "top64": 0,
    "top128": 0,
    "bestResult": 1,
    "average": 3,
    "position": 1,
    "player": {
      "name": "Ikewolf",
      "id": "2016f67a-0814-42ed-bea8-2e75da48840d",
      "zone": {
        "displayId": "30228733-7e13-11e8-8060-e284abfd2bc4",
        "id": "30229617-7e13-11e8-8060-e284abfd2bc4",
        "name": "Vaud",
        "parentId": "30228733-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
