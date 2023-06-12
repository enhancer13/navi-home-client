import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from "react-native-vector-icons/Feather";

const FontsLoader = {
  load() {
    Ionicons.loadFont();
    FontAwesome.loadFont();
    Entypo.loadFont();
    MaterialIcons.loadFont();
    MaterialCommunityIcons.loadFont();
    AntDesign.loadFont();
    Fontisto.loadFont();
    Feather.loadFont();
  },
};

export default FontsLoader;
