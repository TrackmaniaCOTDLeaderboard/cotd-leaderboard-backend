### Time Attack Results

Get the Time Attack of a Track by `year`, `month` and `day`.

```http
GET https://api.cotd-leaderboard.com/results/time-attack/{year}/{month}/{day}?page={page}&name={name}
```

#### Path Parameter

| Key       | Type     | Description         |
| --------- | -------- | ------------------- |
| `{year}`  | `number` | Year of the Track.  |
| `{month}` | `number` | Month of the Track. |
| `{day}`   | `number` | Day of the Track.   |

#### Query Parameter

| Key      | Type     | Required | Default | Description                                                                                                  |
| -------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}` | `number` | ❌       | `0`     | Page Size: `64`. See [Examples](#examples).                                                                  |
| `{name}` | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Time Attack Results 06.07.2024](https://api.cotd-leaderboard.com/time-attack/2024/7/6)

[Time Attack Results 06.07.2024 | Filter name "gra"](https://api.cotd-leaderboard.com/results/time-attack/2024/7/6?name=gra)

[Time Attack Results 06.07.2024 | 65th-128th ](https://api.cotd-leaderboard.com/results/time-attack/2024/7/6?page=1)

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
    }
  }
  // ...
]
```
