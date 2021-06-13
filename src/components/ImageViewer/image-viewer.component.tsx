import * as React from 'react';

import {
    Animated,
    CameraRoll,
    FlatList,
    I18nManager,
    Image,
    Pressable,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image'
import styles from './image-viewer.style';
import VideoPlayer from '../VideoPlayer'
import {IImageSize, IMediaInfo, Props, State} from './image-viewer.type';

export default class ImageViewer extends React.Component<Props, State> {
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

    private imageRefs: any[] = [];
    private thumbnailFlatListRef: any;//FlatList<> | null | undefined;

    public componentDidMount() {
        this.init(this.props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.index !== prevState.prevIndexProp) {
            return {currentShowIndex: nextProps.index, prevIndexProp: nextProps.index};
        }
        return null;
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.index !== this.props.index) {
            this.loadImage(this.props.index || 0);
            this.jumpToCurrentImage();

            Animated.timing(this.fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: !!this.props.useNativeDriver
            }).start();
        }
    }

    public init(nextProps: Props) {
        if (nextProps.imageUrls.length === 0) {
            this.fadeAnim.setValue(0);
            return this.setState(new State());
        }

        const imageSizes: IImageSize[] = [];
        nextProps.imageUrls.forEach(imageUrl => {
            imageSizes.push({
                width: imageUrl.width || 0,
                height: imageUrl.height || 0,
                status: 'loading'
            });
        });

        this.setState(
            {
                currentShowIndex: nextProps.index,
                prevIndexProp: nextProps.index || 0,
                imageSizes
            },
            () => {
                this.loadImage(nextProps.index || 0);
                this.jumpToCurrentImage();
                Animated.timing(this.fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: !!nextProps.useNativeDriver
                }).start();
            }
        );
    }

    /**
     * reset Image scale and position
     */
    public resetImageByIndex = (index: number) => {
        this.imageRefs[index] && this.imageRefs[index].reset();
    };


    public jumpToCurrentImage() {
        this.positionXNumber = this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
        this.standardPositionX = this.positionXNumber;
        this.positionX.setValue(this.positionXNumber);
    }

    public loadImage(index: number) {
        if (!this!.state!.imageSizes![index]) {
            return;
        }

        if (this.loadedIndex.has(index)) {
            return;
        }
        this.loadedIndex.set(index, true);

        const image = this.props.imageUrls[index];
        const imageStatus = {...this!.state!.imageSizes![index]};

        const saveImageSize = () => {
            if (this!.state!.imageSizes![index] && this!.state!.imageSizes![index].status !== 'loading') {
                return;
            }

            const imageSizes = this!.state!.imageSizes!.slice();
            imageSizes[index] = imageStatus;
            this.setState({imageSizes});
        };

        if (this!.state!.imageSizes![index].status === 'success') {
            return;
        }

        if (this!.state!.imageSizes![index].width > 0 && this!.state!.imageSizes![index].height > 0) {
            imageStatus.status = 'success';
            saveImageSize();
            return;
        }

        let imageLoaded = false;
        // Tagged success if url is started with file:, or not set yet(for custom source.uri).
        if (!image.url || image.url.startsWith(`file:`)) {
            imageLoaded = true;
        }

        if (image.width && image.height) {
            if (this.props.enablePreload && imageLoaded === false) {
                Image.prefetch(image.url);
            }
            imageStatus.width = image.width;
            imageStatus.height = image.height;
            imageStatus.status = 'success';
            saveImageSize();
            return;
        }

        Image.getSize(
            image.url,
            (width: number, height: number) => {
                imageStatus.width = width;
                imageStatus.height = height;
                imageStatus.status = 'success';
                saveImageSize();
            },
            () => {
                try {
                    const data = (Image as any).resolveAssetSource(image.props.source);
                    imageStatus.width = data.width;
                    imageStatus.height = data.height;
                    imageStatus.status = 'success';
                    saveImageSize();
                } catch (newError) {
                    // Give up..
                    imageStatus.status = 'fail';
                    saveImageSize();
                }
            }
        );
    }

    public preloadImage = (index: number) => {
        if (index < this.state.imageSizes!.length) {
            this.loadImage(index + 1);
        }
    };

    public handleHorizontalOuterRangeOffset = (offsetX: number = 0) => {
        this.positionXNumber = this.standardPositionX + offsetX;
        this.positionX.setValue(this.positionXNumber);

        const offsetXRTL = !I18nManager.isRTL ? offsetX : -offsetX;

        if (offsetXRTL < 0) {
            if (this!.state!.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
                this.loadImage((this!.state!.currentShowIndex || 0) + 1);
            }
        } else if (offsetXRTL > 0) {
            if (this!.state!.currentShowIndex || 0 > 0) {
                this.loadImage((this!.state!.currentShowIndex || 0) - 1);
            }
        }
    };

    public handleResponderRelease = (vx: number = 0) => {
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
                this.loadImage((this.state.currentShowIndex || 0) - 1);
            }
            return;
        } else if (vxRTL < -0.7) {
            this.goNext.call(this);
            if (this.state.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
                this.loadImage((this.state.currentShowIndex || 0) + 1);
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
        if (index < 0 || index > this.props.imageUrls.length - 1) {
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
            useNativeDriver: !!this.props.useNativeDriver
        }).start();

        if (this.thumbnailFlatListRef) {
            this.thumbnailFlatListRef.scrollToIndex({animated: true, index, viewPosition: .5})
        }

        this.setState(
            {
                currentShowIndex: index
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.currentShowIndex);
                }
            }
        );
    };

    public goBack = () => {
        this.goToIndex((this.state.currentShowIndex || 0) - 1)
    };

    public goNext = () => {
        this.goToIndex((this.state.currentShowIndex || 0) + 1)
    };

    public resetPosition() {
        this.positionXNumber = this.standardPositionX;
        Animated.timing(this.positionX, {
            toValue: this.standardPositionX,
            duration: 150,
            useNativeDriver: !!this.props.useNativeDriver
        }).start();
    }

    public handleLongPress = (image: IMediaInfo) => {
        if (this.props.saveToLocalByLongPress) {
            this.setState({isShowMenu: true});
        }

        if (this.props.onLongPress) {
            this.props.onLongPress(image);
        }
    };

    public handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.handleCancel, this.state.currentShowIndex);
        }
    };

    public handleDoubleClick = () => {
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.handleCancel);
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
            this.jumpToCurrentImage();
        }
    };

    public handleThumbnailClick = (index: number) => {
        this.loadImage(index)
        this.goToIndex(index)
    }

    private renderThumbnail(params: { item: IMediaInfo, index: number }) {
        const {item, index} = params;
        const {thumbnail} = item;
        const selected = (index === this.state.currentShowIndex);
        return (
            <Pressable onPress={() => this.handleThumbnailClick(index)}>
                <FastImage resizeMode={FastImage.resizeMode.contain}
                           style={[this.styles.thumbnailImage, selected && this.styles.thumbnailImageSelected]}
                           source={{
                               uri: thumbnail.url,
                               priority: FastImage.priority.normal,
                               headers: item.props.source.headers,
                           }}/>
            </Pressable>
        )
    }

    private getThumbnails() {
        if (this.props.showThumbnails) {
            const itemLength = Number(this.styles.thumbnailImage.width);
            return (
                <FlatList
                    horizontal={true}
                    ref={ref => this.thumbnailFlatListRef = ref}
                    data={this.props.imageUrls}
                    style={this.styles.thumbnailsFlatList}
                    renderItem={(item) => this.renderThumbnail(item)}
                    keyExtractor={(item: IMediaInfo, index: number) => index.toString()}
                    onScrollToIndexFailed={(info) => {
                    }}
                    initialScrollIndex={this.props.index}
                    getItemLayout={(data, index) => {
                        return {length: itemLength, offset: itemLength * index, index};
                    }
                    }
                    removeClippedSubviews={true}
                />
            )
        }
        return null;
    }

    public getContent() {
        const screenWidth = this.width;
        const screenHeight = this.height;

        const MediaElements = this.props.imageUrls.map((mediaInfo, index) => {
            if ((this.state.currentShowIndex || 0) > index + 1 || (this.state.currentShowIndex || 0) < index - 1) {
                return <View key={index} style={{width: screenWidth, height: screenHeight}}/>;
            }

            if (!this.handleLongPressWithIndex.has(index)) {
                this.handleLongPressWithIndex.set(index, this.handleLongPress.bind(this, mediaInfo));
            }

            console.log(mediaInfo.mediaType);

            if (mediaInfo.mediaType == 'IMAGE') {
                let width = this!.state!.imageSizes![index] && this!.state!.imageSizes![index].width;
                let height = this.state.imageSizes![index] && this.state.imageSizes![index].height;
                const imageInfo = this.state.imageSizes![index];

                if (!imageInfo || !imageInfo.status) {
                    return <View key={index} style={{width: screenWidth, height: screenHeight}}/>;
                }

                if (width > screenWidth) {
                    const widthPixel = screenWidth / width;
                    width *= widthPixel;
                    height *= widthPixel;
                }

                if (height > screenHeight) {
                    const HeightPixel = screenHeight / height;
                    width *= HeightPixel;
                    height *= HeightPixel;
                }

                const Wrapper = ({children, ...others}: any) => (
                    <ImageZoom
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
                    </ImageZoom>
                );

                switch (imageInfo.status) {
                    case 'loading':
                        return (
                            <Wrapper
                                key={index}
                                style={{
                                    ...this.styles.modalContainer,
                                    ...this.styles.loadingContainer
                                }}
                                imageWidth={screenWidth}
                                imageHeight={screenHeight}
                            >
                                <View style={this.styles.loadingContainer}>{this!.props!.loadingRender!()}</View>
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
                            height
                        };

                        if (typeof mediaInfo.props.source === 'number') {
                            // source = require(..), doing nothing
                        } else {
                            if (!mediaInfo.props.source) {
                                mediaInfo.props.source = {};
                            }
                            mediaInfo.props.source = {
                                uri: mediaInfo.url,
                                ...mediaInfo.props.source
                            };
                        }
                        if (this.props.enablePreload) {
                            this.preloadImage(this.state.currentShowIndex || 0);
                        }
                        return (
                            <ImageZoom
                                key={index}
                                ref={el => (this.imageRefs[index] = el)}
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
                                {this!.props!.renderImage!(mediaInfo.props)}
                            </ImageZoom>
                        );
                    case 'fail':
                        return (
                            <Wrapper
                                key={index}
                                style={this.styles.modalContainer}
                                imageWidth={this.props.failImageSource ? this.props.failImageSource.width : screenWidth}
                                imageHeight={this.props.failImageSource ? this.props.failImageSource.height : screenHeight}
                            >
                                {this.props.failImageSource &&
                                this!.props!.renderImage!({
                                    source: {
                                        uri: this.props.failImageSource.url
                                    },
                                    style: {
                                        width: this.props.failImageSource.width,
                                        height: this.props.failImageSource.height
                                    }
                                })}
                            </Wrapper>
                        );
                }
            } else if (mediaInfo.mediaType == 'VIDEO') {
                const player = {
                    src: {
                        uri: mediaInfo.url,
                        ...mediaInfo.props.source
                    },
                    thumbSrc: mediaInfo.thumbnail.url
                }
                return (
                    <VideoPlayer player={player} loading={false} ready={true} />
                )
            }
        });

        return (
            <Animated.View style={{zIndex: 9}}>
                <Animated.View style={{...this.styles.container, opacity: this.fadeAnim}}>
                    {this!.props!.renderHeader!(this.state.currentShowIndex)}

                    <View style={this.styles.arrowLeftContainer}>
                        <TouchableWithoutFeedback onPress={this.goBack}>
                            <View>{this!.props!.renderArrowLeft!()}</View>
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={this.styles.arrowRightContainer}>
                        <TouchableWithoutFeedback onPress={this.goNext}>
                            <View>{this!.props!.renderArrowRight!()}</View>
                        </TouchableWithoutFeedback>
                    </View>

                    <Animated.View style={{
                        ...this.styles.moveBox,
                        transform: [{translateX: this.positionX}],
                        width: this.width * this.props.imageUrls.length
                    }}>
                        {MediaElements}
                    </Animated.View>
                    {this!.props!.renderIndicator!((this.state.currentShowIndex || 0) + 1, this.props.imageUrls.length)}

                    {this.props.imageUrls[this.state.currentShowIndex || 0] &&
                    this.props.imageUrls[this.state.currentShowIndex || 0].originSizeKb &&
                    this.props.imageUrls[this.state.currentShowIndex || 0].originUrl && (
                        <View style={this.styles.watchOrigin}>
                            <TouchableOpacity style={this.styles.watchOriginTouchable}>
                                <Text style={this.styles.watchOriginText}>查看原图(2M)</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[this.styles.thumbnailsContainer, this.props.thumbnailContainerStyle]}>
                        {this.getThumbnails()}
                    </View>

                    <View style={[this.styles.footerContainer, this.props.footerContainerStyle]}>
                        {this!.props!.renderFooter!(this.state.currentShowIndex || 0)}
                    </View>
                </Animated.View>
            </Animated.View>
        );
    }

    public saveToLocal = () => {
        if (!this.props.onSave) {
            CameraRoll.saveToCameraRoll(this.props.imageUrls[this.state.currentShowIndex || 0].url);
            this!.props!.onSaveToCamera!(this.state.currentShowIndex);
        } else {
            this.props.onSave(this.props.imageUrls[this.state.currentShowIndex || 0].url);
        }

        this.setState({isShowMenu: false});
    };

    public getMenu() {
        if (!this.state.isShowMenu) {
            return null;
        }

        if (this.props.menus) {
            return (
                <View style={this.styles.menuContainer}>
                    {this.props.menus({cancel: this.handleLeaveMenu, saveToLocal: this.saveToLocal})}
                </View>
            );
        }

        return (
            <View style={this.styles.menuContainer}>
                <View style={this.styles.menuShadow}/>
                <View style={this.styles.menuContent}>
                    <TouchableHighlight underlayColor="#F2F2F2" onPress={this.saveToLocal}
                                        style={this.styles.operateContainer}>
                        <Text style={this.styles.operateText}>{this.props.menuContext.saveToLocal}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor="#F2F2F2"
                        onPress={this.handleLeaveMenu}
                        style={this.styles.operateContainer}
                    >
                        <Text style={this.styles.operateText}>{this.props.menuContext.cancel}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    public handleLeaveMenu = () => {
        this.setState({isShowMenu: false});
    };

    public handleSwipeDown = () => {
        if (this.props.onSwipeDown) {
            this.props.onSwipeDown();
        }
        this.handleCancel();
    };

    public render() {
        let childs: React.ReactElement;

        childs = (
            <View>
                {this.getContent()}
                {this.getMenu()}
            </View>
        );

        return (
            <View
                onLayout={this.handleLayout}
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    ...this.props.style
                }}
            >
                {childs}
            </View>
        );
    }
}
