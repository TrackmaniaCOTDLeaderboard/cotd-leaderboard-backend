# Trackmania Cup of the Day Leaderboard

**DISCLAIMER! This project is not related to Ubisoft Nadeo! It's a fan made project to generate and display a leaderboard for the Trackmania Cup of the Day.**

Get the game here: [Ubisoft Trackmania](https://www.ubisoft.com/de-de/game/trackmania/trackmania)

This project is based on the work of [pointerzio](https://docs.google.com/spreadsheets/d/e/2PACX-1vSVwwjM2OoIEWwoiKy1CqMY9oKJ2EXqWvch_gPIrOzL8WtsSoYZ-KjsiZpR3Ygt3U08VW9fxFpRyv6R/pubhtml#)! Unfortunately he stopped working on this project.

## Contact Me

- Twitter: [@sowiemarkus](https://x.com/sowiemarkus)
- Discord: sowiemarkus
- E-Mail: [markus.u.wieland@gmail.com](mailto:markus.u.wieland@gmail.com)

## Information

At the start of the project there was only one edition of the Cup of the Days. Since then, two more editions have been added at 03:00 CET and 11:00 CET, which are now included in this project. Completely new leaderboards have also been created. There are now leaderboards for the best qualifiers for the Cup of the Day, the best time attack hunters and the mappers with the most tracks of the day. See below for details.

### Cup Leaderboard

The Cup Leaderboard can be divided into a `global` Leaderboard and a Leaderboard for each `month`. These leaderboards are further divided into the Main Cup Leaderboard (19:00 CET), the Night Rerun Leaderboard (03:00 CET) and the Morning Rerun Leaderboard (11:00 CET).

The top 10 divisions will be considered for the Main Cup (640 players).
For the two reruns, only the first two divisions will be counted (128 players).

In the Main Cup the winner will earn 1000 points while the 640th will get one point.
As there are fewer players in the reruns, the winner only gets 200 points and the 128th place finisher gets one point.

The function for the positions in between is shown in the diagram below.

#### Main Cup

$$\text{points(position)} = 1 + (\text{1000} - 1) \times \left(1 - \frac{\log*{10}(position)}{\log*{10}(\text{640})}\right) $$

#### Rerun Cup

$$\text{points(position)} = 1 + (\text{200} - 1) \times \left(1 - \frac{\log*{10}(position)}{\log*{10}(\text{128})}\right) $$

![Point Distribution Cups](images/points_distribution_comparison_Main%20Cup-Rerun%20Cup.jpg)

### Challenge Leaderboard

As qualifying for the Cup of the Day (Challenge) and the Cup itself are closely linked, the leaderboards are structured in the same way. See [Cup Leaderboard](#cup-leaderboard).
Unterteilt in das `globale` Leaderboard, so wie ein Leaderboard für jeden Monat. Diese Leaderboards können dann weiter unterschieden werden in das Leaderboard für den Main Cup (19:00 CET), sowie den Night rerun (03:00 CET) und den Morning rerun (11:00 CET).

The function for the positions in between is shown in the diagram below.

#### Main Challenge

$$\text{points(position)} = 1 + (\text{1000} - 1) \times \left(1 - \frac{\log*{10}(position)}{\log*{10}(\text{640})}\right) $$

#### Rerun Challenge

$$\text{points(position)} = 1 + (\text{200} - 1) \times \left(1 - \frac{\log*{10}(position)}{\log*{10}(\text{128})}\right) $$

![Point Distribution Cups](images/points_distribution_comparison_Main%20Challenge-Rerun%20Challenge.jpg)

### Time Attack Leaderboard

Es gibt zwei arten von Leaderboards welche im Spiel vorhanden sind. Ein seasonal Leaderboard, (wie zum Beispiel Campaigns) was sich nach dem Ablauf einer Season nicht mehr ändert und ein globales Leaderboard in dem die all time besten Zeiten gespeichert werden. Auch für die Strecke des Tages gibt es ein solches seasonal Leaderboard. Dieses wird für die Berechnung von unserem Leaderboard verwendet.

\(\text{points(position)} = 1 + (\text{1000} - 1) \times \left(1 - \frac{\log*{10}(position)}{\log*{10}(\text{256})}\right) \)

![Point Distribution Cups](images/points_distribution_comparison_Time%20Attack.jpg)

Es gab Planungen ein weiteres Leaderboard für die all time besten Zeiten zu implementieren. Das ist jedoch mit einer großen Menge an Abfragen verbunden die an die Trackmania API von Nadeo gesendet werden müssen um die Ergebnisse zu aktualisieren. Daher wurde entschieden ein solches Leaderboard zunächst nicht zu implementieren. Sollte die Nachfrage jedoch hoch sein, kann diese Entscheidung auch zurückgenommen werden.

### Mapper Leaderboard

The mappers deserve some recognition too! There is now a leaderboard for the mappers with the most Track of the Days. One point is awarded per track.

## Getting Started

All game APIs are to be used responsibly. Nadeo/Ubisoft can and will ban your accounts/IPs if they detect any disruptive (sending too many requests too fast) or any other malicious behavior.

1. Run `npm setup`
2. Extract Zone Flags

   1. Download the Game from Ubisoft Connect.
   2. Copy the `Maniaplanet_Flags.zip` from the Trackmania Files. By default the path should look like this: `C:\Program Files (x86)\Ubisoft\Ubisoft Game Launcher\games\Trackmania\Packs\Maniaplanet_Flags.zip`
   3. Run `ptyhon ./scripty/extract_flags.py`

3. Create a [dedicated server account](https://www.trackmania.com/?redirect=https://www.trackmania.com/player/dedicated-servers).
4. Create an [Trackmania OAuth App](https://webservices.openplanet.dev/oauth/auth).
5. Create a `.env` file.

| Key                              | Information                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                           | Der Port auf dem die Anwendung laufen wird. Beispiel: `3000`.                                                                                                                                                                                                                               |
| `MONITOR_USERNAME`               | For the [Monitoring](https://github.com/TrackmaniaCOTDLeaderboard/cotd-leaderboard-monitoring) you need to provide an admin `username`.                                                                                                                                                     |
| `MONITOR_PASSWORD`               | For the [Monitoring](https://github.com/TrackmaniaCOTDLeaderboard/cotd-leaderboard-monitoring) you need to provide an admin `password`.                                                                                                                                                     |
| `JWT_SECRET`                     | To sign the `jwt` token after login with `MONITOR_USERNAME` and `MONITOR_PASSWORD`. You can use `node ./scripts/generate-jwt-secret.js` to generate a secret.                                                                                                                               |
| `USER_AGENT`                     | In order to communicate with Ubisoft who is requesting the data, the `User-Agent` header is sent with every request. This should contain information about the project as well as contact options. Example: `Trackmania COTD Leaderboard - Discord: <your discord name> - <your@email.com>` |
| `UBI_USERNAME`                   | The `username` of your dedicated server account.                                                                                                                                                                                                                                            |
| `UBI_PASSWORD`                   | The `password` of your dedicated server account.                                                                                                                                                                                                                                            |
| `UBI_AUTHENTICATION_URL`         | https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic                                                                                                                                                                                                                     |
| `UBI_REFRESH_URL`                | https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh                                                                                                                                                                                                                   |
| `TRACKMANIA_OAUTH_CLIENT_ID`     | `client id` of your Trackmania OAuth App                                                                                                                                                                                                                                                    |
| `TRACKMANIA_OAUTH_CLIENT_SECRET` | `client secret` of your Trackmania OAuth App                                                                                                                                                                                                                                                |

### Docker

The project is also available as [Docker Image](https://hub.docker.com/r/sowiemarkus/cotd-leaderboard) verfügbar.

`docker pull sowiemarkus/cotd-leaderboard:latest`

To execute the image, the `.env` file, an SQLite database corresponding to `DATABASE_URL` and an `assets` folder with the images of the flags must be transferred as a volume.

Example with Docker Compose:

```yml
cotd-leaderboard:
  container_name: cotd-leaderboard-backend
  image: sowiemarkus/cotd-leaderboard:latest
  volumes:
    - ./cotd.db:/usr/src/app/cotd.db
    - ./assets:/usr/src/app/dist/assets
  env_file: .env
  ports:
    - 3000:3000
```
