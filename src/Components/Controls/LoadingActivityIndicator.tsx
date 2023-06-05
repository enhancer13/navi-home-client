import React from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import {useTheme} from "react-native-paper";

export const LoadingActivityIndicator: React.FC<ActivityIndicatorProps> = props => {
  const theme = useTheme();

  return (
    <ActivityIndicator
      {...props}
      size="large"
      color={props.color ?? theme.colors.primary}
    />
  );
};
