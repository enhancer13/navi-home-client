import * as React from 'react';
import {
  Animated,
  FlatList,
  I18nManager,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MediaZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';
import styles from './media-viewer.style';
import VideoPlayer from '../VideoPlayer';
import { IMediaStatus, IMediaInfo, Props, State } from './media-viewer.type';

export default class MediaViewer extends React.Component<Props, State> {
  public static defaultProps = new Props();
  public state = new State();

  private fadeAnim = new Animated.Value(0);

  private standardPositionX = 0;

  private positionXNumber = 0;
  private positionX = new Animated.Value(0);

  private width = 0;
  private height = 0;

  private styles = styles(0, 0, 'transparent');

  private hasLayout = false;

  private loadedIndex = new Map<number, boolean>();

  private handleLongPressWithIndex = new Map<number, any>();

  private mediaRefs: any[] = [];

  private thumbnailFlatListRef: any;

  private mediaPlayersRefs: VideoPlayer[] = [];

  public componentDidMount() {
    this.init(this.props);
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.index !== prevState.prevIndexProp) {
      return {
        currentShowIndex: nextProps.index,
        prevIndexProp: nextProps.index,
      };
    }
    return null;
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.index !== this.props.index) {
      this.loadMedia(this.props.index || 0);
      this.jumpToCurrentMedia();

      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: !!this.props.useNativeDriver,
      }).start();
    }
  }

  public init(nextProps: Props) {
    if (nextProps.mediaUrls.length === 0) {
      this.fadeAnim.setValue(0);
      return this.setState(new State());
    }

    const imageSizes: IMediaStatus[] = [];
    nextProps.mediaUrls.forEach((imageUrl) => {
      imageSizes.push({
        width: imageUrl.width || 0,
        height: imageUrl.height || 0,
        status: 'loading',
      });
    });

    this.setState(
      {
        currentShowIndex: nextProps.index,
        prevIndexProp: nextProps.index || 0,
        mediaStatuses: imageSizes,
      },
      () => {
        this.loadMedia(nextProps.index || 0);
        this.jumpToCurrentMedia();
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: !!nextProps.useNativeDriver,
        }).start();
      },
    );
  }

  public jumpToCurrentMedia() {
    this.positionXNumber =
      this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
    this.standardPositionX = this.positionXNumber;
    this.positionX.setValue(this.positionXNumber);
  }

  public loadMedia(index: number) {
    if (!this.state.mediaStatuses![index]) {
      return;
    }
    if (this.loadedIndex.has(index)) {
      return;
    }
    this.loadedIndex.set(index, true);

    const mediaInfo = this.props.mediaUrls[index];
    const mediaStatus = { ...this.state.mediaStatuses![index] };
    if (mediaInfo.mediaType === 'VIDEO') {
      //video loading is controlled by video player
      mediaStatus.status = 'success';
      return;
    }

    const saveMediaStatus = () => {
      if (
        this.state.mediaStatuses![index] &&
        this.state.mediaStatuses![index].status !== 'loading'
      ) {
        return;
      }

      const mediaStatuses = this.state.mediaStatuses!.slice();
      mediaStatuses[index] = mediaStatus;
      this.setState({ mediaStatuses: mediaStatuses });
    };

    if (this.state.mediaStatuses![index].status === 'success') {
      return;
    }

    if (this.state.mediaStatuses![index].width > 0 && this.state.mediaStatuses![index].height > 0) {
      mediaStatus.status = 'success';
      saveMediaStatus();
      return;
    }

    let mediaLoaded = false;
    // Tagged success if url is started with file:, or not set yet(for custom source.uri).
    if (!mediaInfo.url || mediaInfo.url.startsWith('file:')) {
      mediaLoaded = true;
    }

    if (mediaInfo.width && mediaInfo.height) {
      if (this.props.enablePreload && mediaLoaded === false) {
        Image.prefetch(mediaInfo.url);
      }
      mediaStatus.width = mediaInfo.width;
      mediaStatus.height = mediaInfo.height;
      mediaStatus.status = 'success';
      saveMediaStatus();
      return;
    }

    Image.getSize(
      mediaInfo.url,
      (width: number, height: number) => {
        mediaStatus.width = width;
        mediaStatus.height = height;
        mediaStatus.status = 'success';
        saveMediaStatus();
      },
      () => {
        try {
          const data = (Image as any).resolveAssetSource(mediaInfo.props.source);
          mediaStatus.width = data.width;
          mediaStatus.height = data.height;
          mediaStatus.status = 'success';
          saveMediaStatus();
        } catch (newError) {
          // Give up..
          mediaStatus.status = 'fail';
          saveMediaStatus();
        }
      },
    );
  }

  public preloadMedia = (index: number) => {
    if (index < this.state.mediaStatuses!.length) {
      this.loadMedia(index + 1);
    }
  };

  public handleHorizontalOuterRangeOffset = (offsetX = 0) => {
    this.positionXNumber = this.standardPositionX + offsetX;
    this.positionX.setValue(this.positionXNumber);

    const offsetXRTL = !I18nManager.isRTL ? offsetX : -offsetX;

    if (offsetXRTL < 0) {
      if (this.state.currentShowIndex || this.props.mediaUrls.length - 1 > 0) {
        this.loadMedia((this.state.currentShowIndex || 0) + 1);
      }
    } else if (offsetXRTL > 0) {
      if (this.state.currentShowIndex || 0 > 0) {
        this.loadMedia((this.state.currentShowIndex || 0) - 1);
      }
    }
  };

  public handleResponderRelease = (vx = 0) => {
    const vxRTL = I18nManager.isRTL ? -vx : vx;
    const isLeftMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0);
    const isRightMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0);

    if (vxRTL > 0.7) {
      this.goBack.call(this);

      if (this.state.currentShowIndex || 0 > 0) {
        this.loadMedia((this.state.currentShowIndex || 0) - 1);
      }
      return;
    } else if (vxRTL < -0.7) {
      this.goNext.call(this);
      if (this.state.currentShowIndex || this.props.mediaUrls.length - 1 > 0) {
        this.loadMedia((this.state.currentShowIndex || 0) + 1);
      }
      return;
    }

    if (isLeftMove) {
      this.goBack.call(this);
    } else if (isRightMove) {
      this.goNext.call(this);
      return;
    } else {
      this.resetPosition.call(this);
      return;
    }
  };

  public goToIndex = (index: number) => {
    if (index < 0 || index > this.props.mediaUrls.length - 1) {
      this.resetPosition.call(this);
      return;
    }
    const deltaIndex = index - (this.state.currentShowIndex || 0);
    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX - this.width * deltaIndex
      : this.standardPositionX + this.width * deltaIndex;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: this.props.pageAnimateTime,
      useNativeDriver: !!this.props.useNativeDriver,
    }).start();

    if (this.thumbnailFlatListRef) {
      this.thumbnailFlatListRef.scrollToIndex({
        animated: true,
        index,
        viewPosition: 0.5,
      });
    }

    const { currentShowIndex } = this.state;
    if (this.mediaPlayersRefs[currentShowIndex]) {
      this.mediaPlayersRefs[currentShowIndex].pause();
    }

    this.setState(
      {
        currentShowIndex: index,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      },
    );
  };

  public goBack = () => {
    this.goToIndex((this.state.currentShowIndex || 0) - 1);
  };

  public goNext = () => {
    this.goToIndex((this.state.currentShowIndex || 0) + 1);
  };

  public resetPosition() {
    this.positionXNumber = this.standardPositionX;
    Animated.timing(this.positionX, {
      toValue: this.standardPositionX,
      duration: 150,
      useNativeDriver: !!this.props.useNativeDriver,
    }).start();
  }

  public handleLongPress = (image: IMediaInfo) => {
    if (this.props.saveToLocalByLongPress) {
      this.setState({ isShowMenu: true });
    }

    if (this.props.onLongPress) {
      this.props.onLongPress(image);
    }
  };

  public handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.handleCancel, this.state.currentShowIndex);
    }
    const { currentShowIndex } = this.state;
    if (this.mediaPlayersRefs[currentShowIndex]) {
      this.mediaPlayersRefs[currentShowIndex].handleSingleClick();
    }
  };

  public handleDoubleClick = () => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(this.handleCancel);
    }
    const { currentShowIndex } = this.state;
    if (this.mediaPlayersRefs[currentShowIndex]) {
      this.mediaPlayersRefs[currentShowIndex].handleDoubleClick();
    }
  };

  public handleCancel = () => {
    this.hasLayout = false;
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  public handleLayout = (event: any) => {
    if (event.nativeEvent.layout.width !== this.width) {
      this.hasLayout = true;

      this.width = event.nativeEvent.layout.width;
      this.height = event.nativeEvent.layout.height;
      this.styles = styles(this.width, this.height, this.props.backgroundColor || 'transparent');

      this.forceUpdate();
      this.jumpToCurrentMedia();
    }
  };

  public handleThumbnailClick = (index: number) => {
    this.loadMedia(index);
    this.goToIndex(index);
  };

  private renderThumbnail(params: { item: IMediaInfo; index: number }) {
    const { item, index } = params;
    const { thumbnail } = item;
    const selected = index === this.state.currentShowIndex;
    return (
      <Pressable onPress={() => this.handleThumbnailClick(index)}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={[this.styles.thumbnailImage, selected && this.styles.thumbnailImageSelected]}
          source={{
            uri: thumbnail.url,
            priority: FastImage.priority.normal,
            headers: item.props.source.headers,
          }}
        />
      </Pressable>
    );
  }

  private getThumbnails() {
    if (this.props.showThumbnails) {
      const itemLength = Number(this.styles.thumbnailImage.width);
      return (
        <FlatList
          horizontal={true}
          ref={(ref) => (this.thumbnailFlatListRef = ref)}
          data={this.props.mediaUrls}
          style={this.styles.thumbnailsFlatList}
          renderItem={(item) => this.renderThumbnail(item)}
          keyExtractor={(item: IMediaInfo, index: number) => index.toString()}
          onScrollToIndexFailed={(_) => {}}
          initialScrollIndex={this.props.index}
          getItemLayout={(data, index) => {
            return { length: itemLength, offset: itemLength * index, index };
          }}
          removeClippedSubviews={true}
        />
      );
    }
    return null;
  }

  public handleSwipeDown = () => {
    if (this.props.onSwipeDown) {
      this.props.onSwipeDown();
    }
    this.handleCancel();
  };

  public getContent() {
    const screenWidth = this.width;
    const screenHeight = this.height;

    const MediaElements = this.props.mediaUrls.map((mediaInfo, index) => {
      if (
        (this.state.currentShowIndex || 0) > index + 1 ||
        (this.state.currentShowIndex || 0) < index - 1
      ) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }

      if (!this.handleLongPressWithIndex.has(index)) {
        this.handleLongPressWithIndex.set(index, this.handleLongPress.bind(this, mediaInfo));
      }

      if (mediaInfo.mediaType === 'IMAGE') {
        let width = this.state.mediaStatuses![index] && this.state.mediaStatuses![index].width;
        let height = this.state.mediaStatuses![index] && this.state.mediaStatuses![index].height;
        const mediaStatus = this.state.mediaStatuses![index];

        if (!mediaStatus || !mediaStatus.status) {
          return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
        }

        if (width > screenWidth) {
          const pixelSize = screenWidth / width;
          width *= pixelSize;
          height *= pixelSize;
        }

        if (height > screenHeight) {
          const pixelSize = screenHeight / height;
          width *= pixelSize;
          height *= pixelSize;
        }

        const Wrapper = ({ children, ...others }: any) => (
          <MediaZoom
            cropWidth={this.width}
            cropHeight={this.height}
            maxOverflow={this.props.maxOverflow}
            horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
            responderRelease={this.handleResponderRelease}
            onMove={this.props.onMove}
            onLongPress={this.handleLongPressWithIndex.get(index)}
            onClick={this.handleClick}
            onDoubleClick={this.handleDoubleClick}
            enableSwipeDown={this.props.enableSwipeDown}
            swipeDownThreshold={this.props.swipeDownThreshold}
            onSwipeDown={this.handleSwipeDown}
            pinchToZoom={this.props.enableImageZoom}
            enableDoubleClickZoom={this.props.enableImageZoom}
            doubleClickInterval={this.props.doubleClickInterval}
            {...others}
          >
            {children}
          </MediaZoom>
        );

        switch (mediaStatus.status) {
          case 'loading':
            return (
              <Wrapper
                key={index}
                style={{
                  ...this.styles.modalContainer,
                  ...this.styles.loadingContainer,
                }}
                imageWidth={screenWidth}
                imageHeight={screenHeight}
              >
                <View style={this.styles.loadingContainer}>{this.props.loadingRender!()}</View>
              </Wrapper>
            );
          case 'success':
            if (!mediaInfo.props) {
              mediaInfo.props = {};
            }

            if (!mediaInfo.props.style) {
              mediaInfo.props.style = {};
            }
            mediaInfo.props.style = {
              ...this.styles.imageStyle, // User config can override above.
              ...mediaInfo.props.style,
              width,
              height,
            };

            if (typeof mediaInfo.props.source === 'number') {
              // source = require(..), doing nothing
            } else {
              if (!mediaInfo.props.source) {
                mediaInfo.props.source = {};
              }
              mediaInfo.props.source = {
                uri: mediaInfo.url,
                ...mediaInfo.props.source,
              };
            }
            if (this.props.enablePreload) {
              this.preloadMedia(this.state.currentShowIndex || 0);
            }
            return (
              <MediaZoom
                key={index}
                ref={(el) => (this.mediaRefs[index] = el)}
                cropWidth={this.width}
                cropHeight={this.height}
                maxOverflow={this.props.maxOverflow}
                horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
                responderRelease={this.handleResponderRelease}
                onMove={this.props.onMove}
                onLongPress={this.handleLongPressWithIndex.get(index)}
                onClick={this.handleClick}
                onDoubleClick={this.handleDoubleClick}
                imageWidth={width}
                imageHeight={height}
                enableSwipeDown={this.props.enableSwipeDown}
                swipeDownThreshold={this.props.swipeDownThreshold}
                onSwipeDown={this.handleSwipeDown}
                panToMove={!this.state.isShowMenu}
                pinchToZoom={this.props.enableImageZoom && !this.state.isShowMenu}
                enableDoubleClickZoom={this.props.enableImageZoom && !this.state.isShowMenu}
                doubleClickInterval={this.props.doubleClickInterval}
                minScale={this.props.minScale}
                maxScale={this.props.maxScale}
              >
                {this.props.renderImage!(mediaInfo.props)}
              </MediaZoom>
            );
          case 'fail':
            return (
              <Wrapper
                key={index}
                style={this.styles.modalContainer}
                imageWidth={
                  this.props.failImageSource ? this.props.failImageSource.width : screenWidth
                }
                imageHeight={
                  this.props.failImageSource ? this.props.failImageSource.height : screenHeight
                }
              >
                {this.props.failImageSource &&
                  this.props.renderImage!({
                    source: {
                      uri: this.props.failImageSource.url,
                    },
                    style: {
                      width: this.props.failImageSource.width,
                      height: this.props.failImageSource.height,
                    },
                  })}
              </Wrapper>
            );
        }
      } else if (mediaInfo.mediaType === 'VIDEO') {
        //TODO replace with real video width/height
        const aspectRatio = 16 / 9;
        const playerWidth = this.width;
        const playerHeight = playerWidth / aspectRatio;
        return (
          <MediaZoom
            key={index}
            ref={(el) => (this.mediaRefs[index] = el)}
            cropWidth={this.width}
            cropHeight={this.height}
            maxOverflow={this.props.maxOverflow}
            horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
            responderRelease={this.handleResponderRelease}
            onMove={this.props.onMove}
            onLongPress={this.handleLongPressWithIndex.get(index)}
            onClick={this.handleClick}
            onDoubleClick={this.handleDoubleClick}
            imageWidth={playerWidth}
            imageHeight={playerHeight}
            enableSwipeDown={this.props.enableSwipeDown}
            swipeDownThreshold={this.props.swipeDownThreshold}
            onSwipeDown={this.handleSwipeDown}
            panToMove={!this.state.isShowMenu}
            pinchToZoom={false}
            enableDoubleClickZoom={false}
            doubleClickInterval={this.props.doubleClickInterval}
            minScale={this.props.minScale}
            maxScale={this.props.maxScale}
          >
            <VideoPlayer
              ref={(ref) => {
                this.mediaPlayersRefs[index] = ref;
              }}
              startPlaying={false}
              uri={mediaInfo.url}
              headers={mediaInfo.props.source.headers}
              tapAnywhereToPause={false}
              doubleTapTime={300}
              onScreenTouch={this.handleClick}
              externalScreenTouchProvider={true}
              hideBottomControlsWhenPaused={false}
            />
          </MediaZoom>
        );
      }
    });
    return (
      <Animated.View style={{ zIndex: 9 }}>
        <Animated.View style={{ ...this.styles.container, opacity: this.fadeAnim }}>
          <View style={[this.styles.headerContainer]}>
            {this.props.renderHeader!(this.state.currentShowIndex)}
          </View>
          {this.props.renderIndicator!(
            (this.state.currentShowIndex || 0) + 1,
            this.props.mediaUrls.length,
          )}

          <View style={this.styles.arrowLeftContainer}>
            <TouchableWithoutFeedback onPress={this.goBack}>
              <View>{this.props.renderArrowLeft!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <View style={this.styles.arrowRightContainer}>
            <TouchableWithoutFeedback onPress={this.goNext}>
              <View>{this.props.renderArrowRight!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <Animated.View
            style={{
              ...this.styles.moveBox,
              transform: [{ translateX: this.positionX }],
              width: this.width * this.props.mediaUrls.length,
            }}
          >
            {MediaElements}
          </Animated.View>

          <View style={[this.styles.thumbnailsContainer, this.props.thumbnailContainerStyle]}>
            {this.getThumbnails()}
          </View>

          <View style={[this.styles.footerContainer, this.props.footerContainerStyle]}>
            {this.props.renderFooter!(this.state.currentShowIndex || 0)}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }

  public render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={{
          flex: 1,
          overflow: 'hidden',
          ...this.props.style,
        }}
      >
        <View>{this.getContent()}</View>
      </View>
    );
  }
}
