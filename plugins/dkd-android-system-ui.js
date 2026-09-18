const { withAndroidStyles } = require('@expo/config-plugins');

const dkd_upsertThemeItem = (dkd_style, dkd_name, dkd_value) => {
  dkd_style.item = Array.isArray(dkd_style.item) ? dkd_style.item : [];
  const dkd_current = dkd_style.item.find((dkd_item) => dkd_item?.$?.name === dkd_name);
  if (dkd_current) {
    dkd_current._ = dkd_value;
    return;
  }
  dkd_style.item.push({ $: { name: dkd_name }, _: dkd_value });
};

module.exports = function dkd_androidSystemUi(dkd_config) {
  return withAndroidStyles(dkd_config, (dkd_modConfig) => {
    const dkd_styles = dkd_modConfig.modResults?.resources?.style ?? [];
    const dkd_appTheme = dkd_styles.find((dkd_style) => dkd_style?.$?.name === 'AppTheme');
    if (dkd_appTheme) {
      dkd_upsertThemeItem(dkd_appTheme, 'android:navigationBarColor', '@android:color/transparent');
      dkd_upsertThemeItem(dkd_appTheme, 'android:statusBarColor', '@android:color/transparent');
      dkd_upsertThemeItem(dkd_appTheme, 'android:windowLightNavigationBar', 'false');
      dkd_upsertThemeItem(dkd_appTheme, 'android:windowLightStatusBar', 'false');
      dkd_upsertThemeItem(dkd_appTheme, 'android:enforceNavigationBarContrast', 'false');
      dkd_upsertThemeItem(dkd_appTheme, 'android:windowNoTitle', 'true');
    }
    return dkd_modConfig;
  });
};
