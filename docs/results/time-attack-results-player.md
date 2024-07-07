### Time Attack Results of Player

Get the Time Attack Results of a Player.

```http
GET https://api.cotd-leaderboard.com/results/time-attack/challenge/{id}?page={page}
```

#### Path Parameter

| Key    | Type     | Description     |
| ------ | -------- | --------------- |
| `{id}` | `string` | `id` of player. |

#### Query Parameter

| Key      | Type     | Required | Default | Description                                                |
| -------- | -------- | -------- | ------- | ---------------------------------------------------------- |
| `{page}` | `number` | ❌       | `0`     | Page Size: `64` (One Division). See [Examples](#examples). |

#### Examples

[Time Attack Results of Player with id 04a64a68-7370-4f67-90b2-025e1006631a](https://api.cotd-leaderboard.com/results/player/time-attack/04a64a68-7370-4f67-90b2-025e1006631a)

#### Response

```json
[
  {
    "position": 1,
    "score": 44278,
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
    "map": {
      "year": 2024,
      "month": 7,
      "day": 6
    }
  }
  // ...
]
```
