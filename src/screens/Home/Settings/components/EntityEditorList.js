import React from 'react';
import MenuList from '../../../../components/MenuList';

function EntityEditorList(props) {
  const items = [
    {
      name: 'Video Cameras Configuration',
      icon: {
        name: 'video-camera',
        type: 'font-awesome',
      },
      action: () => props.navigation.navigate('VideoCameraEntityEditor'),
    },
    {
      name: 'Video Streaming Profiles',
      icon: {
        name: 'video-wireless',
        type: 'material-community',
      },
      action: () => props.navigation.navigate(''),
    },
    {
      name: 'Video Recording Profiles',
      icon: {
        name: 'ios-recording',
        type: 'ionicon',
      },
      action: () => props.navigation.navigate(''),
    },
    {
      name: 'Motion Detection Profiles',
      icon: {
        name: 'motion-sensor',
        type: 'material-community',
      },
      action: () => props.navigation.navigate(''),
    },
  ];

  return <MenuList items={items} />;
}

export default EntityEditorList;
