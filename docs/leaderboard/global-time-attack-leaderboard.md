# Global Time Attack Leaderboard

Get the Global Track of the Day - Time Attack Leaderboard.

```http
GET https://api.cotd-leaderboard.com/leaderboard/time-attack/global?page={page}&name={name}
```

#### Query Parameter

| Key      | Type     | Required | Default | Description                                                                                                  |
| -------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}` | `number` | ❌       | `0`     | Page Size: `100`. See [Examples](#examples).                                                                 |
| `{name}` | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Global Time Attack Leaderboard](https://api.cotd-leaderboard.com/leaderboard/time-attack/global?page=0)

[Global Time Attack Leaderboard | Filter name "gra"](https://api.cotd-leaderboard.com/leaderboard/time-attack/global?page=0&name=gra)

[Global Time Attack Leaderboard | 101th-200th](https://api.cotd-leaderboard.com/leaderboard/time-attack/global?page=1&version=1)

#### Response

```json
[
  {
    "amount": 2,
    "points": 1875,
    "first": 1,
    "second": 1,
    "third": 0,
    "top8": 0,
    "top16": 0,
    "top32": 0,
    "top64": 0,
    "top128": 0,
    "bestResult": 1,
    "average": 1.5,
    "position": 1,
    "player": {
      "name": "Switch999",
      "id": "d3557ada-6d0c-40be-9208-8587d9293dff",
      "zone": {
        "displayId": "301f6188-7e13-11e8-8060-e284abfd2bc4",
        "id": "301fafaa-7e13-11e8-8060-e284abfd2bc4",
        "name": "Val-de-Marne",
        "parentId": "301fab89-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
