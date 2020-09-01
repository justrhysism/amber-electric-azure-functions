# Amber Electric Price Check

_Timer Trigger_

Timer function to check the current pricing, and send a notifcation (via [_Pushover_](https://pushover.net/)) if the price is high.

### Configuration

Use environment variables to configure options.

| Variable Key                        | Description                                                                                              | Default |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| `PriceCheck.Postcode`               | Set the postcode to fetch Amber Electric pricing for.                                                    | `5000`  |
| `PriceCheck.TimezoneOffsetMinutes`  | Set [timezone minutes offset](#timezone-offset).                                                         | `0`     |
| `PriceCheck.Price.Warning`          | Send warning notifications when the pricing reaches this value.                                          | `0.5`   |
| `PriceCheck.Price.Critical`         | Upgrade notification priority to _critical_ when the pricing reaches this values.                        | `1.0`   |
| `PriceCheck.PeriodIndexes.Warning`  | Forecast periods to check for warning notifications. (Zero indexed, e.g. `0` is the next time period)    | `0,1`   |
| `PriceCheck.PeriodIndexes.Critical` | Forecast periods to check for _critical_ notifications. (Zero indexed, e.g. `0` is the next time period) | `0,1`   |
| `Pushover.User`                     | Pushover [user key](https://pushover.net/api#identifiers).                                               | _N/A_   |
| `Pushover.Token`                    | Pushover [application token](https://pushover.net/api#registration).                                     | _N/A_   |
| `Pushover.Device`                   | Pushover [device list](https://pushover.net/api#identifiers), as a comma-separated string.               | _N/A_   |

#### Configuration Notes

- Pricing is _GST inclusive_.
- Periods are in 30 minute blocks.

##### Timezone Offset

Times from Amber Electric are **market time** (i.e. Brisbane time). Use this value to correct pricing to your local timezone. _(Please note at this time this does not account for daylight savings.)_
