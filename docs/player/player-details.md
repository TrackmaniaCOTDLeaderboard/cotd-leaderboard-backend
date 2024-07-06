# Search Player

Search Player by name.

```http
GET https://api.cotd-leaderboard.com/player/id/
```

#### Examples

[Get Player Details of Player with id 05477e79-25fd-48c2-84c7-e1621aa46517](https://api.cotd-leaderboard.com/player/id/05477e79-25fd-48c2-84c7-e1621aa46517)

#### Response

```json
{
  "name": "GranaDy.",
  "id": "05477e79-25fd-48c2-84c7-e1621aa46517",
  "zone": {
    "displayId": "301ff622-7e13-11e8-8060-e284abfd2bc4",
    "id": "30202b1c-7e13-11e8-8060-e284abfd2bc4",
    "name": "Dresden",
    "parentId": "30202744-7e13-11e8-8060-e284abfd2bc4"
  },
  "mapperLeaderboard": null,
  "monthlyCupLeaderboard": [],
  "monthlyChallengeLeaderboard": [],
  "monthlyTimeAttackLeaderboard": [],
  "globalChallengeLeaderboard": [
    {
      "amount": 2,
      "points": 1496,
      "first": 1,
      "second": 0,
      "third": 0,
      "top8": 0,
      "top16": 0,
      "top32": 1,
      "top64": 0,
      "top128": 0,
      "bestResult": 1,
      "average": 13.5,
      "position": 7,
      "version": 1
    }
  ],
  "globalCupLeaderboard": [
    {
      "amount": 1,
      "points": 1000,
      "first": 1,
      "second": 0,
      "third": 0,
      "top8": 0,
      "top16": 0,
      "top32": 0,
      "top64": 0,
      "top128": 0,
      "bestResult": 1,
      "average": 1,
      "position": 11,
      "version": 1
    }
  ],
  "globalTimeAttackLeaderboard": {
    "amount": 1,
    "points": 452,
    "first": 0,
    "second": 0,
    "third": 0,
    "top8": 0,
    "top16": 0,
    "top32": 1,
    "top64": 0,
    "top128": 0,
    "bestResult": 21,
    "average": 21,
    "position": 52
  }
}
```
