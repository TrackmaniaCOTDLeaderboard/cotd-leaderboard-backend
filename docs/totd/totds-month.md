# Track of the Days of a Month

Get a Track of the Days of a Month.

```http
GET https://api.cotd-leaderboard.com/totd/{year}/{month}/{day}
```

#### Path Parameter

| Key       | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `{year}`  | `number` | Year of the month you want to get the tracks from. |
| `{month}` | `number` | The month that you want to get the tracks from.    |

#### Examples

[Track of the Day | 05.07.2024 ](https://api.cotd-leaderboard.com/totd/2024/7)

#### Response

```json
[
  {
    "id": "2d01de0f-4885-45d9-9570-020f9f8ab4cb",
    "uid": "5LzV0TPHde0uQznxD7jcFpgs7rg",
    "seasonUid": "378f0918-227f-4556-a822-49a08b7e14ed",
    "thumbnail": "https://core.trackmania.nadeo.live/storageObjects/ebef3f9f-d394-4c83-89c7-b6304661e7e0.jpg",
    "name": "$s$FFFL$EEEIG$DDDH$CCCT$n$888HE$777ART$666ED",
    "authorTime": 42231,
    "goldTime": 45000,
    "silverTime": 51000,
    "bronzeTime": 64000,
    "year": 2024,
    "month": 7,
    "day": 5,
    "author": {
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
