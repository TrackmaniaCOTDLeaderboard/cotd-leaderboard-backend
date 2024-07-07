# Maps of Player

Get Maps of Player.

```http
GET https://api.cotd-leaderboard.com/player/maps/{id}
```

#### Path Parameter

| Key    | Type     | Description         |
| ------ | -------- | ------------------- |
| `{id}` | `string` | `id` of the Player. |

#### Examples

[Get Maps build by player with id dbe0408e-3943-4619-82b2-d364596d7795](https://api.cotd-leaderboard.com/player/maps/dbe0408e-3943-4619-82b2-d364596d7795)

#### Response

```json
[
  {
    "id": "53ec1100-7142-44dc-9158-bf290c956144",
    "uid": "VVyovovGPsNATlB0Acb0lR1rQ2h",
    "seasonUid": "f3680bf8-c7c9-48d0-9ed9-4a01e5e1f450",
    "thumbnail": "https://core.trackmania.nadeo.live/storageObjects/33dd2025-6853-4a65-895b-6d3c0ebd9d18.jpg",
    "name": "$o  $0d0De$ADEFrost",
    "authorTime": 46557,
    "goldTime": 50000,
    "silverTime": 56000,
    "bronzeTime": 70000,
    "year": 2024,
    "month": 7,
    "day": 6,
    "author": {
      "name": "Biobolical",
      "id": "dbe0408e-3943-4619-82b2-d364596d7795",
      "zone": {
        "displayId": "3022ab53-7e13-11e8-8060-e284abfd2bc4",
        "id": "3022e2f0-7e13-11e8-8060-e284abfd2bc4",
        "name": "Missouri",
        "parentId": "3022ab53-7e13-11e8-8060-e284abfd2bc4"
      }
    }
  }
  //...
]
```
