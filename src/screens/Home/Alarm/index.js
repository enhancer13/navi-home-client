import React from 'react';
import {applicationConstants} from '../../../config/ApplicationConstants';
import AlarmProfile from './AlarmProfile';
import {EntityEditorList} from '../../../components/EntityEditor';
import FlexSafeAreaView from '../../../components/View/FlexSafeAreaView';

function AlarmProfileEntityEditor(props) {
  return (
    <EntityEditorList
      navigation={props.navigation}
      entityName={applicationConstants.Entities.ALARM_PROFILE}
      ItemComponent={AlarmProfile}
      title={'Alarm Profiles'}
      backButton={false}
    />
  );
}

export default AlarmProfileEntityEditor;
