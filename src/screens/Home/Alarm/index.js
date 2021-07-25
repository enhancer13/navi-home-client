import React from 'react';
import Globals from '../../../globals/Globals';
import AlarmProfile from './AlarmProfile';
import {EntityEditorList} from '../../../components/EntityEditor';

function AlarmProfileEntityEditor(props) {
  return (
    <EntityEditorList
      navigation={props.navigation}
      entityName={Globals.Entities.ALARM_PROFILE}
      ItemComponent={AlarmProfile}
      title={'Alarm Profiles'}
      backButton={false}
    />
  );
}

export default AlarmProfileEntityEditor;
