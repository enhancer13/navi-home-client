export default class FormatUtils {
  static formatEnumValue = (value) => {
    return value
      .split('_')
      .map((val) => {
        val = val.toLowerCase();
        return val[0].toUpperCase() + val.slice(1);
      })
      .join(' ');
  };
}
