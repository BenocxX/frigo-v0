export class TimeConstants {
  static readonly SECOND_IN_MS = 1000;
  static readonly MINUTE_IN_MS = TimeConstants.SECOND_IN_MS * 60;
  static readonly HOUR_IN_MS = TimeConstants.MINUTE_IN_MS * 60;
  static readonly DAY_IN_MS = TimeConstants.HOUR_IN_MS * 24;
  static readonly WEEK_IN_MS = TimeConstants.DAY_IN_MS * 7;
  static readonly FIFTEEN_DAYS_IN_MS = TimeConstants.DAY_IN_MS * 15;
  static readonly MONTH_IN_MS = TimeConstants.DAY_IN_MS * 30;
  static readonly YEAR_IN_MS = TimeConstants.DAY_IN_MS * 365;
}
