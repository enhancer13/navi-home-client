import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper";

interface IFlexSafeAreaViewInsetsProps {
  children: React.ReactNode;
  ignoreTopInsets?: boolean | undefined;
  ignoreBottomInsets?: boolean | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}

const FlexSafeAreaViewInsets: React.FC<IFlexSafeAreaViewInsetsProps> = ({children, style}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const top = Platform.OS === 'ios' ? insets.top : 0;
  return (
    <View style={[styles.container, style, {paddingTop: top, paddingBottom: insets.bottom, backgroundColor: theme.colors.background}]}>
      <View style={{...styles.topSafeArea, height: top}} />
      {children}
    </View>
  );
};


const createStyles = (theme: Theme) => StyleSheet.create({
  topSafeArea: {
    position: 'absolute',
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
  },
});

export default FlexSafeAreaViewInsets;
