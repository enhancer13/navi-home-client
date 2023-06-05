import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {MD3Theme} from 'react-native-paper';

export type NaviTheme = MD3Theme & {
    colors: {
        statusBadge: {
            information: string;
            warning: string;
            error: string;
            onStatusBadge: string;
        }
    };
};

export const lightTheme: NaviTheme = {
    ...MD3LightTheme,
    colors: {
        "primary": '#6959d5',
        "onPrimary": "rgb(255, 255, 255)",
        "primaryContainer": "rgb(234, 221, 255)",
        "onPrimaryContainer": "rgb(37, 0, 90)",
        "secondary": "rgb(99, 91, 112)",
        "onSecondary": "rgb(255, 255, 255)",
        "secondaryContainer": "rgb(233, 222, 248)",
        "onSecondaryContainer": "rgb(30, 24, 43)",
        "tertiary": "rgb(126, 82, 94)",
        "onTertiary": "rgb(255, 255, 255)",
        "tertiaryContainer": "rgb(255, 217, 225)",
        "onTertiaryContainer": "rgb(49, 16, 27)",
        "error": "rgb(186, 26, 26)",
        "onError": "rgb(255, 255, 255)",
        "errorContainer": "rgb(255, 218, 214)",
        "onErrorContainer": "rgb(65, 0, 2)",
        "background": "rgb(240, 240, 240)",
        "onBackground": "rgb(29, 27, 30)",
        "surface": "rgb(255, 251, 255)",
        "onSurface": "rgb(29, 27, 30)",
        "surfaceVariant": "rgb(239,235,248)",
        "onSurfaceVariant": "rgb(73, 69, 78)",
        "outline": "rgb(122, 117, 127)",
        "outlineVariant": "rgb(203, 196, 207)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(50, 48, 51)",
        "inverseOnSurface": "rgb(245, 239, 244)",
        "inversePrimary": "rgb(210, 187, 255)",
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(251, 251, 251)",
            "level2": "rgb(252, 252, 252)",
            "level3": "rgb(253, 253, 253)",
            "level4": "rgb(254, 254, 254)",
            "level5": "rgb(255, 255, 255)"
        },
        "statusBadge": {
            "information": "rgb(28,183,248)",
            "warning": "rgb(255,180,27)",
            "error": "rgb(255,61,27)",
            "onStatusBadge": "rgb(255, 255, 255)",
        },
        "surfaceDisabled": "rgba(29, 27, 30, 0.12)",
        "onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
        "backdrop": "rgba(50, 47, 55, 0.4)"
    }
};

export const darkTheme: NaviTheme = {
    ...MD3DarkTheme,
    colors: {
        "primary": "rgb(163,167,248)",
        "onPrimary": "rgb(24, 29, 140)",
        "primaryContainer": "rgb(50, 57, 163)",
        "onPrimaryContainer": "rgb(224, 224, 255)",
        "secondary": "rgb(197, 196, 221)",
        "onSecondary": "rgb(46, 47, 66)",
        "secondaryContainer": "rgb(68, 69, 89)",
        "onSecondaryContainer": "rgb(225, 224, 249)",
        "tertiary": "rgb(232, 185, 213)",
        "onTertiary": "rgb(70, 38, 59)",
        "tertiaryContainer": "rgb(94, 60, 82)",
        "onTertiaryContainer": "rgb(255, 216, 238)",
        "error": "rgb(255, 180, 171)",
        "onError": "rgb(105, 0, 5)",
        "errorContainer": "rgb(147, 0, 10)",
        "onErrorContainer": "rgb(255, 180, 171)",
        "background": "rgb(27, 27, 31)",
        "onBackground": "rgb(229, 225, 230)",
        "surface": "rgb(35,35,40)",
        "onSurface": "rgb(229, 225, 230)",
        "surfaceVariant": "rgb(70, 70, 79)",
        "onSurfaceVariant": "rgb(199, 197, 208)",
        "outline": "rgb(145, 143, 154)",
        "outlineVariant": "rgb(70, 70, 79)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(229, 225, 230)",
        "inverseOnSurface": "rgb(48, 48, 52)",
        "inversePrimary": "rgb(75, 83, 188)",
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(35, 35, 42)",
            "level2": "rgb(40, 40, 49)",
            "level3": "rgb(45, 45, 56)",
            "level4": "rgb(47, 47, 58)",
            "level5": "rgb(50, 50, 62)"
        },
        "statusBadge": {
            "information": "rgb(28,183,248)",
            "warning": "rgb(255,180,27)",
            "error": "rgb(255,61,27)",
            "onStatusBadge": "rgb(255, 255, 255)",
        },
        "surfaceDisabled": "rgba(229, 225, 230, 0.12)",
        "onSurfaceDisabled": "rgba(229, 225, 230, 0.38)",
        "backdrop": "rgba(48, 48, 56, 0.4)"
    }
};
