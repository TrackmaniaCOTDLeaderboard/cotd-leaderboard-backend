# Track of the Day - Mapper Leaderboard

Get the Track of the Day - Mapper Leaderboard.

```http
GET https://api.cotd-leaderboard.com/leaderboard/mapper?page={page}&version={version}&name={name}
```

#### Query Parameter

| Key      | Type     | Required | Default | Description                                                                                                  |
| -------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}` | `number` | ❌       | `0`     | Page Size: `100`. See [Examples](#examples).                                                                 |
| `{name}` | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Mapper Leaderboard](https://api.cotd-leaderboard.com/leaderboard/cup/global?page=0&version=1)

[Mapper Leaderboard | Filter name "ohi"](https://api.cotd-leaderboard.com/leaderboard/mapper?name=ohi)

[Mapper Leaderboard | 101th-200th](https://api.cotd-leaderboard.com/leaderboard/mapper?page=1)

#### Response

```json
[
  {
    "points": 1,
    "position": 1,
    "player": {
      "name": "OHIO_JG",
      "id": "70d991d1-434e-4e69-80df-f6e9c5ab6ea7",
      "zone": {
        "displayId": "301ff622-7e13-11e8-8060-e284abfd2bc4",
        "id": "30202b1c-7e13-11e8-8060-e284abfd2bc4",
        "name": "Dresden",
        "parentId": "30202744-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  // ...
]
```
