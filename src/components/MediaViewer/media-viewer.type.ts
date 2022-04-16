import * as React from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';
import { simpleStyle } from './media-viewer.style';

interface IOnMove {
  type: string;
  positionX: number;
  positionY: number;
  scale: number;
  zoomCurrentDistance: number;
}

export class Props {
  public show?: boolean = false;
  public mediaUrls: IMediaInfo[] = [];
  public flipThreshold?: number = 80;
  public maxOverflow?: number = 300;
  public index?: number = 0;
  public failImageSource?: IMediaInfo = undefined;
  public backgroundColor?: string = 'black';
  public footerContainerStyle?: object = {};
  public menuContext?: any = {
    saveToLocal: 'save to the album',
    cancel: 'cancel',
  };
  public saveToLocalByLongPress?: boolean = true;
  public enableImageZoom?: boolean = true;
  public style?: ViewStyle = {};
  public enableSwipeDown?: boolean = false;
  public swipeDownThreshold?: number;
  public doubleClickInterval?: number;
  public minScale?: number;
  public maxScale?: number;
  public enablePreload?: boolean = false;
  public pageAnimateTime?: number = 100;
  public useNativeDriver?: boolean = false;
  public menus?: ({ cancel, saveToLocal }: any) => React.ReactElement<any>;
  public thumbnailContainerStyle?: ViewStyle = {};
  public showThumbnails?: boolean = false;

  public onLongPress?: (image?: IMediaInfo) => void = () => {};
  public onClick?: (close?: () => any, currentShowIndex?: number) => void = () => {};
  public onDoubleClick?: (close?: () => any) => void = () => {};
  public onSave?: (url: string) => void = () => {};
  public onMove?: (position?: IOnMove) => void = () => {};
  public onShowModal?: (content?: any) => void = () => {};
  public onCancel?: () => void = () => {};
  public onSwipeDown?: () => void = () => {};
  public onChange?: (index?: number) => void = () => {};

  public renderHeader?: (currentIndex?: number) => React.ReactElement<any> = () => {
    return null as any;
  };

  public renderFooter?: (currentIndex: number) => React.ReactElement<any> = () => {
    return null as any;
  };

  public renderIndicator?: (currentIndex?: number, allSize?: number) => React.ReactElement<any> = (
    currentIndex?: number,
    allSize?: number,
  ) => {
    return React.createElement(
      View,
      { style: simpleStyle.count },
      React.createElement(Text, { style: simpleStyle.countText }, currentIndex + '/' + allSize),
    );
  };

  public renderImage?: (props: any) => React.ReactElement<any> = (props: any) => {
    return React.createElement(Image, props);
  };

  public renderArrowLeft?: () => React.ReactElement<any> = () => {
    return null as any;
  };

  public renderArrowRight?: () => React.ReactElement<any> = () => {
    return null as any;
  };

  public loadingRender?: () => React.ReactElement<any> = () => {
    return null as any;
  };
}

export class State {
  public show?: boolean = false;
  public currentShowIndex?: number = 0;
  public prevIndexProp?: number = 0;
  public imageLoaded?: boolean = false;
  public mediaStatuses?: IMediaStatus[] = [];
  public isShowMenu?: boolean = false;
}

export interface IThumbnailInfo {
  url: string;
  width?: number;
  height?: number;
  props?: any;
}

export interface IMediaInfo {
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: IThumbnailInfo;
  width?: number;
  height?: number;
  sizeKb?: number;
  originSizeKb?: number;
  originUrl?: string;
  props?: any;
  freeHeight?: boolean;
  freeWidth?: boolean;
}

export interface IMediaStatus {
  width: number;
  height: number;
  status: 'loading' | 'success' | 'fail';
}
