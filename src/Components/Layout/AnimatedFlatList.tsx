import React, {useMemo, useState} from 'react';
import FlexContainer from './FlexContainer';
import {Animated, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TouchableScale from 'react-native-touchable-scale';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useTheme, Text} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import createAnimatedComponent = Animated.createAnimatedComponent;

const AnimatedText = createAnimatedComponent(Text);

const TITLE_HEIGHT = hp(10);
const HEADER_HEIGHT = hp(4);
const BACK_ICON_SIZE = 30;

interface IAnimatedHeaderContainerProps<ItemT> {
  title: string;
  data: ReadonlyArray<ItemT>;
  renderItem: (renderItemInfo: ListRenderItemInfo<ItemT>) => React.ReactElement;
  extraData?: any;
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
}

const AnimatedFlatList: React.FC<IAnimatedHeaderContainerProps<any>> = ({
                                                                          title,
                                                                          data,
                                                                          renderItem,
                                                                          extraData,
                                                                          showBackButton,
                                                                          onBackButtonPress}) => {
  const [scrollAnim] = useState(new Animated.Value(0));
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const titleTranslate = scrollAnim.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleHeight = scrollAnim.interpolate({
    inputRange: [HEADER_HEIGHT, TITLE_HEIGHT],
    outputRange: [TITLE_HEIGHT, HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleTextColor = scrollAnim.interpolate({
    inputRange: [HEADER_HEIGHT, TITLE_HEIGHT],
    outputRange: [theme.colors.primary, theme.colors.onPrimary],
    extrapolate: 'clamp',
  });

  const titleTextSize = scrollAnim.interpolate({
    inputRange: [0, TITLE_HEIGHT],
    outputRange: [30, 20],
    extrapolate: 'clamp',
  });

  return (
    <FlexContainer>
      <View style={styles.headerContainer}>
        {showBackButton && (
          <TouchableScale>
            <Ionicon
              name="arrow-back"
              color={'white'}
              onPress={onBackButtonPress}
              size={BACK_ICON_SIZE}
            />
          </TouchableScale>
        )}
      </View>
      <Animated.View style={[styles.title, {transform: [{translateY: titleTranslate}], height: titleHeight}]}>
        <AnimatedText style={{fontSize: titleTextSize, color: titleTextColor}}>{title}</AnimatedText>
      </Animated.View>
      <FlexContainer bottomTransparency topTransparency>
        <Animated.FlatList
          contentContainerStyle={{paddingTop: TITLE_HEIGHT}}
          scrollEventThrottle={16}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollAnim}}}], {
            useNativeDriver: false
          })}
          keyExtractor={item => item.Key}
          data={data}
          extraData={extraData}
          renderItem={renderItem}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  title: {
    marginTop: HEADER_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100) - BACK_ICON_SIZE * 2,
  },
  group: {
    borderRadius: 10,
    margin: 10,
    flex: 1,
    padding: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    elevation: 4,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
  },
});

export default AnimatedFlatList;
