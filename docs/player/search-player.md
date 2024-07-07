# Search Player

Search Player by name.

```http
GET https://api.cotd-leaderboard.com/player/name?&name={name}
```

#### Query Parameter

| Key      | Type     | Required | Default | Description                                                                                                  |
| -------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `{page}` | `number` | ❌       | `0`     | Page Size: `100`. See [Examples](#examples).                                                                 |
| `{name}` | `string` | ❌       | -       | Set this to filter the response after names. The min length of the string is `3`. See [Examples](#examples). |

#### Examples

[Find Players by "gra"](https://api.cotd-leaderboard.com/player/name?name=gra)

#### Response

```json
[
  {
    "id": "2fb7efdb-02f3-45e7-80ef-287b260276ee",
    "name": "Gramitive",
    "zoneId": "3022a92a-7e13-11e8-8060-e284abfd2bc4",
    "zone": {
      "displayId": "3022a1b2-7e13-11e8-8060-e284abfd2bc4"
    }
  }
  // ...
]
```
