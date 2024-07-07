### Challenge Results of Player

Get the Challenge Results of a Player.

```http
GET https://api.cotd-leaderboard.com/results/player/challenge/{id}?page={page}&version={version}
```

#### Path Parameter

| Key    | Type     | Description     |
| ------ | -------- | --------------- |
| `{id}` | `string` | `id` of player. |

#### Query Parameter

| Key         | Type     | Required | Default | Description                                                                                          |
| ----------- | -------- | -------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `{page}`    | `number` | ❌       | `0`     | Page Size: `64` (One Division). See [Examples](#examples).                                           |
| `{version}` | `number` | ✔        | `1`     | `1` for Main Cup (19:00 CET)<br>`2` for Night Rerun (03:00 CET)<br>`3` for Morning Rerun (11:00 CET) |

#### Examples

[Challenge Results of Player with id 04a64a68-7370-4f67-90b2-025e1006631a | 19:00 CET](https://api.cotd-leaderboard.com/results/player/challenge/04a64a68-7370-4f67-90b2-025e1006631a)

[Challenge Results of Player with id 04a64a68-7370-4f67-90b2-025e1006631a | 03:00 CET](https://api.cotd-leaderboard.com/results/player/challenge/04a64a68-7370-4f67-90b2-025e1006631a?version=2)

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
    },
    "challenge": {
      "year": 2024,
      "month": 7,
      "day": 6,
      "version": 1
    }
  }
  // ...
]
```
