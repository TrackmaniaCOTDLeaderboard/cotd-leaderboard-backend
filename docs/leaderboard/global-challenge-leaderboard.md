# Global Challenge Leaderboard

Get the Global Challenge Leaderboard.

```http
GET https://api.cotd-leaderboard.com/leaderboard/challenge/global?page={page}&version={version}&name={name}
```

#### Query Parameter

| Key         | Type     | Required | Default | Description                                                                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}`    | `number` | ❌       | `0`     | Page Size: `100`. See [Examples](#examples).                                                                 |
| `{version}` | `number` | ✔        | `1`     | `1` for main cup (19:00 CET)<br>`2` for Night Rerun (03:00 CET)<br>`3` for Morning Rerun (11:00 CET)         |
| `{name}`    | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Global Challenge Leaderboard | 19:00 CET](https://api.cotd-leaderboard.com/leaderboard/challenge/global?page=0&version=1)

[Global Challenge Leaderboard | 19:00 CET | Filter name "gra"](https://api.cotd-leaderboard.com/leaderboard/challenge/global?page=0&version=1&name=gra)

[Global Challenge Leaderboard | 19:00 CET | 101th-200th](https://api.cotd-leaderboard.com/leaderboard/challenge/global?page=1&version=1)

#### Response

```json
[
  {
    "amount": 3,
    "points": 2402,
    "first": 1,
    "second": 1,
    "third": 0,
    "top8": 0,
    "top16": 0,
    "top32": 1,
    "top64": 0,
    "top128": 0,
    "bestResult": 1,
    "average": 9,
    "position": 1,
    "player": {
      "name": "L1ngotm",
      "id": "b981e0b1-2d6a-4470-9b52-c1f6b0b1d0a6",
      "zone": {
        "displayId": "301e6dd7-7e13-11e8-8060-e284abfd2bc4",
        "id": "301e73a7-7e13-11e8-8060-e284abfd2bc4",
        "name": "Quebec",
        "parentId": "301e6dd7-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
