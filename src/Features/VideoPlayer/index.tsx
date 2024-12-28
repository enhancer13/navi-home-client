import React, {Component} from 'react';
import Video from 'react-native-video';
import {
    TouchableWithoutFeedback,
    TouchableHighlight,
    PanResponder,
    StyleSheet,
    Animated,
    Easing,
    Image,
    View,
    Text,
    ViewStyle, StyleProp, ImageStyle,
} from 'react-native';
import padStart from 'lodash/padStart';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {OnPlaybackStateChangedData} from 'react-native-video/src/specs/VideoNativeComponent.ts';

type VideoPlayerProps = {
    uri?: string;
    thumbUri?: string;
    headers: { [key: string]: string } | undefined;
    resizeMode?: 'stretch' | 'contain' | 'cover' | 'none' | undefined;
    rate?: number;
    volume: number;
    muted?: boolean;
    toggleResizeModeOnFullscreen?: boolean;
    controlAnimationTiming?: number;
    doubleTapTime?: number;
    playInBackground?: boolean;
    playWhenInactive?: boolean;
    fullscreen?: boolean;
    showOnStart?: boolean;
    repeat?: boolean;
    title?: string;
    showTimeRemaining?: boolean;
    showHours?: boolean;
    nativeControls?: boolean;
    disableBack?: boolean;
    disableVolume?: boolean;
    disableFocus?: boolean;
    alwaysShowBottomControls?: boolean;
    hideBottomControlsWhenPaused?: boolean;
    tapAnywhereToPause?: boolean;
    externalScreenTouchProvider?: boolean;
    disposeOnPause?: boolean;
    onError?: (error: any) => void;
    onBack?: () => void;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    onLoadStart?: () => void;
    onLoad?: (data?: any) => void;
    onProgress?: (data?: any) => void;
    onEnd?: () => void;
    onPlaybackStateChanged?: (e: OnPlaybackStateChangedData) => void;
    onFullscreenPlayerDidPresent?: () => void;
    onFullscreenPlayerDidDismiss?: () => void;
    onControlsVisibilityChanged?: (isVisible: boolean) => void;
    onShowControls?: () => void;
    onHideControls?: () => void;
    controlTimeout?: number;
    scrubbing?: number;
    videoStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    navigator?: NativeStackNavigationProp<any, any>;
    showRemainingTime?: boolean;
    paused: boolean;
    disableTimer?: boolean;
    disableSeekbar?: boolean;
    disablePlayPause?: boolean;
    disableFullscreen?: boolean;
    seekColor?: string;
} & Partial<typeof VideoPlayer.defaultProps>

interface VideoPlayerState {
    rate?: number;
    volume: number;
    muted?: boolean;
    resizeMode?: 'stretch' | 'contain' | 'cover' | 'none' | undefined;
    duration: number;
    currentTime: number;
    paused: boolean;
    fullscreen?: boolean;
    seeking: boolean;
    loading: boolean;
    error: boolean;
    showControls?: boolean;
    showTimeRemaining?: boolean;
    showHours?: boolean;
    volumeTrackWidth: number;
    volumeFillWidth: number;
    seekerFillWidth: number;
    volumePosition: number;
    seekerPosition: number;
    volumeOffset: number;
    seekerOffset: number;
    originallyPaused: boolean;
    scrubbing: boolean;
    showRemainingTime?: boolean;
}

interface VideoPlayerMethods {
    toggleFullscreen: () => void;
    togglePlayPause: () => void;
    rewindForward: () => void;
    toggleControls: () => void;
    toggleTimer: () => void;
    reconnectAfterError: () => void;
}

interface VideoPlayerEvents {
    onError: (error?: any) => void;
    onBack: () => void;
    onEnd: () => void;
    onScreenTouch: () => void;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    onShowControls?: () => void;
    onHideControls?: () => void;
    onLoadStart: () => void;
    onProgress: () => void;
    onSeek: () => void;
    onLoad: () => void;
    onPlaybackStateChanged: (e: OnPlaybackStateChangedData) => void;
    onFullscreenPlayerDidPresent: () => void;
    onFullscreenPlayerDidDismiss: () => void;
    onPlaybackRateChange: ({playbackRate}: { playbackRate: any; }) => void;
}

interface VideoPlayerOptions {
    playWhenInactive?: boolean;
    playInBackground?: boolean;
    repeat?: boolean;
    title?: string;
}

interface VideoPlayerPlayer {
    controlTimeoutDelay: number;
    volumePanResponder: any;
    seekPanResponder: any;
    controlTimeout: undefined | NodeJS.Timeout;
    tapActionTimeout: undefined | NodeJS.Timeout;
    volumeWidth: number;
    iconOffset: number;
    seekerWidth: number;
    ref: any;
    scrubbingTimeStep: number;
    tapAnywhereToPause?: boolean;
}

interface VideoPlayerAnimations {
    bottomControl: {
        marginBottom: Animated.Value;
        opacity: Animated.Value;
    };
    topControl: {
        marginTop: Animated.Value;
        opacity: Animated.Value;
    };
    video: {
        opacity: Animated.Value;
    };
    loader: {
        rotate: Animated.Value;
        MAX_VALUE: number;
    };
}

interface VideoPlayerStyles {
    videoStyle: any;
    containerStyle: any;
}

export default class VideoPlayer extends Component<VideoPlayerProps, VideoPlayerState> {
    static defaultProps = {
        toggleResizeModeOnFullscreen: true,
        controlAnimationTiming: 500,
        doubleTapTime: 130,
        playInBackground: false,
        playWhenInactive: false,
        resizeMode: 'contain',
        fullscreen: false,
        showOnStart: true,
        repeat: false,
        muted: false,
        volume: 1,
        title: '',
        rate: 1,
        showTimeRemaining: true,
        showHours: false,
        nativeControls: false,
        disableBack: true,
        disableVolume: true,
        disableFocus: true,
        disposeOnPause: false,
        alwaysShowBottomControls: false,
        hideBottomControlsWhenPaused: true,
        tapAnywhereToPause: false,
        paused: true,
        externalScreenTouchProvider: false,
    };

    methods: VideoPlayerMethods;
    events: VideoPlayerEvents;
    opts: VideoPlayerOptions;
    player: VideoPlayerPlayer;
    animations: VideoPlayerAnimations;
    styles: VideoPlayerStyles;
    mounted: boolean;

    constructor(props: VideoPlayerProps) {
        super(props);
        /**
         * All of our values that are updated by the
         * methods and listeners in this class
         */
        this.state = {
            // Video
            resizeMode: this.props.resizeMode,
            paused: this.props.paused,
            muted: this.props.muted,
            volume: this.props.volume,
            rate: this.props.rate,

            // Controls
            fullscreen: this.props.fullscreen || this.props.resizeMode === 'cover',
            showTimeRemaining: this.props.showTimeRemaining,
            showHours: this.props.showHours,
            volumeTrackWidth: 0,
            volumeFillWidth: 0,
            seekerFillWidth: 0,
            showControls: this.props.showOnStart,
            volumePosition: 0,
            seekerPosition: 0,
            volumeOffset: 0,
            seekerOffset: 0,
            seeking: false,
            originallyPaused: false,
            scrubbing: false,
            loading: false,
            currentTime: 0,
            error: false,
            duration: 0,
            showRemainingTime: this.props.showTimeRemaining,
        };

        /**
         * Any options that can be set at init.
         */
        this.opts = {
            playWhenInactive: this.props.playWhenInactive,
            playInBackground: this.props.playInBackground,
            repeat: this.props.repeat,
            title: this.props.title,
        };

        /**
         * Our app listeners and associated methods
         */
        this.events = {
            onError: this.props.onError || this._onError.bind(this),
            onBack: this.props.onBack || this._onBack.bind(this),
            onEnd: this.props.onEnd || this._onEnd.bind(this),
            onScreenTouch: this._onScreenTouch.bind(this),
            onEnterFullscreen: this.props.onEnterFullscreen,
            onExitFullscreen: this.props.onExitFullscreen,
            onShowControls: this.props.onShowControls,
            onHideControls: this.props.onHideControls,
            onLoadStart: this._onLoadStart.bind(this),
            onProgress: this._onProgress.bind(this),
            onSeek: this._onSeek.bind(this),
            onLoad: this._onLoad.bind(this),
            onPlaybackStateChanged: this._onPlaybackStateChanged.bind(this),
            onFullscreenPlayerDidPresent: this._onFullscreenPlayerDidPresent.bind(this),
            onFullscreenPlayerDidDismiss: this._onFullscreenPlayerDidDismiss.bind(this),
            onPlaybackRateChange: this._onPlaybackRateChange.bind(this),
        };

        /**
         * Functions used throughout the application
         */
        this.methods = {
            toggleFullscreen: this._toggleFullscreen.bind(this),
            togglePlayPause: this._togglePlayPause.bind(this),
            rewindForward: this._rewindForward.bind(this),
            toggleControls: this._toggleControls.bind(this),
            toggleTimer: this._toggleTimer.bind(this),
            reconnectAfterError: this.reconnectAfterError.bind(this),
        };

        /**
         * Player information
         */
        this.player = {
            tapActionTimeout: undefined,
            controlTimeoutDelay: this.props.controlTimeout || 15000,
            volumePanResponder: PanResponder,
            seekPanResponder: PanResponder,
            controlTimeout: undefined,
            volumeWidth: 150,
            iconOffset: 0,
            seekerWidth: 0,
            ref: Video,
            scrubbingTimeStep: this.props.scrubbing || 0,
            tapAnywhereToPause: this.props.tapAnywhereToPause,
        };

        this.mounted = false;

        /**
         * Various animations
         */
        const initialValue = this.props.showOnStart ? 1 : 0;

        this.animations = {
            bottomControl: {
                marginBottom: new Animated.Value(0),
                opacity: new Animated.Value(initialValue),
            },
            topControl: {
                marginTop: new Animated.Value(0),
                opacity: new Animated.Value(initialValue),
            },
            video: {
                opacity: new Animated.Value(1),
            },
            loader: {
                rotate: new Animated.Value(0),
                MAX_VALUE: 360,
            },
        };

        /**
         * Various styles that be added...
         */
        this.styles = {
            videoStyle: this.props.videoStyle || {},
            containerStyle: this.props.style || {},
        };
    }

    componentDidUpdate = (prevProps: VideoPlayerProps) => {
        const {fullscreen} = this.props;

        if (prevProps.fullscreen !== fullscreen) {
            this.setState({
                fullscreen,
            });
        }
    };

    /**
     | -------------------------------------------------------
     | Events
     | -------------------------------------------------------
     |
     | These are the events that the <Video> component uses
     | and can be overridden by assigning it as a prop.
     | It is suggested that you override onEnd.
     |
     */

    /**
     * When load starts we display a loading icon
     * and show the controls.
     */
    _onLoadStart() {
        this.setState(
            {
                loading: true,
                error: false,
            }, this.loadAnimation
        );

        if (typeof this.props.onLoadStart === 'function') {
            this.props.onLoadStart();
        }
    }

    /**
     * When load is finished we hide the load icon
     * and hide the controls. We also set the
     * video duration.
     *
     * @param {object} data The video meta data
     */
    _onLoad(data: any = {}) {
        const {duration = 0} = data;
        this.setState({
            duration,
            loading: false,
        });

        if (this.state.showControls) {
            this.setControlTimeout();
        }

        if (typeof this.props.onLoad === 'function') {
            this.props.onLoad(data);
        }
    }

    _onPlaybackStateChanged(e: OnPlaybackStateChangedData) {
        console.debug('onPlaybackStateChanged');
        this.setState({
            paused: false,
        });

        if (typeof this.props.onPlaybackStateChanged === 'function') {
            this.props.onPlaybackStateChanged(e);
        }
    }

    _onFullscreenPlayerDidPresent() {
        this.setState({
            fullscreen: true,
        });
    }

    _onFullscreenPlayerDidDismiss() {
        this.setState({
            fullscreen: false,
        });
        if (!this.state.showControls) {
            this.methods.toggleControls();
        }
    }

    _onPlaybackRateChange({playbackRate}: { playbackRate: any; }) {
        console.debug('onPlaybackRateChange', playbackRate);
    }

    /**
     * For onprogress we fire listeners that
     * update our seekbar and timer.
     *
     * @param {object} data The video meta data
     */
    _onProgress(data: any = {}) {
        //{currentPosition, bufferedDuration, seekableDuration, currentPlaybackTime}
        const state = this.state;
        if (!state.scrubbing) {
            if (!state.seeking) {
                const position = this.calculateSeekerPosition();
                this.setSeekerPosition(position);
            }

            if (typeof this.props.onProgress === 'function') {
                this.props.onProgress(data);
            }

            this.setState({
                currentTime: data.currentTime,
            });
        }
    }

    /**
     * For onSeek we clear scrubbing if set.
     *
     * @param {object} data The video metadata
     */
    _onSeek(data: any = {}) {
        const state = this.state;
        if (state.scrubbing) {
            // Seeking may be false here if the user released the seek bar while the player was still processing
            // the last seek command. In this case, perform the steps that have been postponed.
            let {paused} = this.state;
            if (!state.seeking) {
                this.setControlTimeout();
                paused = state.originallyPaused;
            }

            this.setState({
                scrubbing: false,
                currentTime: data.currentTime,
                paused,
            });
        }
    }

    /**
     * Set the error state to true which then
     * changes our renderError function
     *
     * @param {object} err  Err obj returned from <Video> component
     */
    _onError(err: any) {
        console.error('Error...', err);
        if (this.state.error) {
            return;
        }
        this.setState({error: true, paused: true, loading: false});
    }

    /**
     * This is a single and double tap listener
     * when the user taps the screen anywhere.
     * One tap toggles controls and/or toggles pause,
     * two toggles fullscreen mode.
     */
    _onScreenTouch() {
        if (this.player.tapActionTimeout) {
            this.handleDoubleClick();
        } else {
            this.player.tapActionTimeout = setTimeout(this.handleSingleClick, this.props.doubleTapTime);
        }
    }

    /**
     | -------------------------------------------------------
     | Methods
     | -------------------------------------------------------
     |
     | These are all of our functions that interact with
     | various parts of the class. Anything from
     | calculating time remaining in a video
     | to handling control operations.
     |
     */

    pause() {
        this.setState({
            paused: true,
            loading: false,
        });
    }

    handleSingleClick = () => {
        const state = this.state;
        if (this.player.tapAnywhereToPause && state.showControls) {
            this.methods.togglePlayPause();
            this.resetControlTimeout();
        } else {
            this.methods.toggleControls();
        }
        this.player.tapActionTimeout = undefined;
    };

    handleDoubleClick = () => {
        clearTimeout(this.player.tapActionTimeout);
        this.player.tapActionTimeout = undefined;
        this.methods.toggleFullscreen();
        const state = this.state;
        if (state.showControls) {
            this.resetControlTimeout();
        }
    };

    reconnectAfterError() {
        this.setState({
            error: false,
            paused: false,
        });
    }

    /**
     * Set a timeout when the controls are shown
     * that hides them after a length of time.
     * Default is 15s
     */
    setControlTimeout() {
        this.player.controlTimeout = setTimeout(() => {
            this._hideControls();
        }, this.player.controlTimeoutDelay);
    }

    /**
     * Clear the hide controls timeout.
     */
    clearControlTimeout() {
        clearTimeout(this.player.controlTimeout);
    }

    /**
     * Reset the timer completely
     */
    resetControlTimeout() {
        this.clearControlTimeout();
        this.setControlTimeout();
    }

    /**
     * Animation to hide controls. We fade the
     * display to 0 then move them off the
     * screen so they're not interactable
     */
    hideControlAnimation() {
        let animateActions = [
            Animated.timing(this.animations.topControl.opacity, {
                toValue: 0,
                duration: this.props.controlAnimationTiming,
                useNativeDriver: false,
            }),
            Animated.timing(this.animations.topControl.marginTop, {
                toValue: -100,
                duration: this.props.controlAnimationTiming,
                useNativeDriver: false,
            }),
        ];
        if (
            !this.props.alwaysShowBottomControls &&
            (this.props.hideBottomControlsWhenPaused || !this.state.paused)
        ) {
            animateActions = animateActions.concat([
                Animated.timing(this.animations.bottomControl.opacity, {
                    toValue: 0,
                    duration: this.props.controlAnimationTiming,
                    useNativeDriver: false,
                }),
                Animated.timing(this.animations.bottomControl.marginBottom, {
                    toValue: -100,
                    duration: this.props.controlAnimationTiming,
                    useNativeDriver: false,
                }),
            ]);
        }
        Animated.parallel(animateActions).start();
    }

    /**
     * Animation to show controls...opposite of
     * above...move onto the screen and then
     * fade in.
     */
    showControlAnimation() {
        Animated.parallel([
            Animated.timing(this.animations.topControl.opacity, {
                toValue: 1,
                useNativeDriver: false,
                duration: this.props.controlAnimationTiming,
            }),
            Animated.timing(this.animations.topControl.marginTop, {
                toValue: 0,
                useNativeDriver: false,
                duration: this.props.controlAnimationTiming,
            }),
            Animated.timing(this.animations.bottomControl.opacity, {
                toValue: 1,
                useNativeDriver: false,
                duration: this.props.controlAnimationTiming,
            }),
            Animated.timing(this.animations.bottomControl.marginBottom, {
                toValue: 0,
                useNativeDriver: false,
                duration: this.props.controlAnimationTiming,
            }),
        ]).start();
    }

    /**
     * Loop animation to spin loader icon. If not loading then stop loop.
     */
    loadAnimation() {
        if (this.state.loading) {
            Animated.sequence([
                Animated.timing(this.animations.loader.rotate, {
                    toValue: this.animations.loader.MAX_VALUE,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(this.animations.loader.rotate, {
                    toValue: 0,
                    duration: 0,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]).start(this.loadAnimation.bind(this));
        }
    }

    /**
     * Function to hide the controls. Sets our
     * state then calls the animation.
     */
    _hideControls() {
        if (this.mounted) {
            this.hideControlAnimation();
            typeof this.events.onHideControls === 'function' && this.events.onHideControls();

            this.setState({
                showControls: false,
            });
        }
    }

    /**
     * Function to toggle controls based on
     * current state.
     */
    _toggleControls() {
        const state = this.state;

        if (state.showControls) {
            this.showControlAnimation();
            this.setControlTimeout();
            typeof this.events.onShowControls === 'function' && this.events.onShowControls();
        } else {
            this.hideControlAnimation();
            this.clearControlTimeout();
            typeof this.events.onHideControls === 'function' && this.events.onHideControls();
        }

        this.setState(prevState => ({
            showControls: !prevState.showControls,
        }));
    }

    /**
     * Toggle fullscreen changes resizeMode on
     * the <Video> component then updates the
     * fullscreen state.
     */
    _toggleFullscreen() {
        const state = this.state;
        if (state.paused) {
            return;
        }

        let resizeMode = state.resizeMode;
        if (this.props.toggleResizeModeOnFullscreen) {
            resizeMode = state.fullscreen ? 'cover' : 'contain';
        }

        if (state.fullscreen) {
            typeof this.events.onEnterFullscreen === 'function' && this.events.onEnterFullscreen();
        } else {
            typeof this.events.onExitFullscreen === 'function' && this.events.onExitFullscreen();
        }

        this.setState(prevState => ({
            fullscreen: !prevState.fullscreen,
            resizeMode,
        }));
    }

    /**
     * Toggle playing state on <Video> component
     */
    _togglePlayPause() {
        const state = this.state;

        let loading = state.loading;
        if (state.paused) {
            loading = false;
        }

        this.setState(prevState => ({
            paused: !prevState.paused,
            loading,
        }));
    }

    /**
     * Rewind forward
     */

    _rewindForward() {
    }


    _onEnd() {
        console.debug('onEnd reached');
        this.setState({paused: true});
        this.setSeekerPosition(0);
        this.seekTo(0);
    }

    /**
     * Toggle between showing time remaining or
     * video duration in the timer control
     */
    _toggleTimer() {
        this.setState(prevState => ({
            showTimeRemaining: !prevState.showTimeRemaining,
        }));
    }

    /**
     * The default 'onBack' function pops the navigator
     * and as such the video player requires a
     * navigator prop by default.
     */
    _onBack() {
        if (this.props.navigator && this.props.navigator.pop) {
            this.props.navigator.pop();
        } else {
            console.warn(
                'Warning: _onBack requires navigator property to function. Either modify the onBack prop or pass a navigator prop',
            );
        }
    }

    /**
     * Calculate the time to show in the timer area
     * based on if they want to see time remaining
     * or duration. Formatted to look as 00:00.
     */
    calculateTime() {
        if (this.state.showTimeRemaining) {
            const time = this.state.duration - this.state.currentTime;
            return `-${this.formatTime(time)}`;
        }

        return this.formatTime(this.state.currentTime);
    }

    /**
     * Format a time string as mm:ss
     *
     * @param {int} time time in milliseconds
     * @return {string} formatted time string in mm:ss format
     */
    formatTime(time = 0) {
        const symbol = this.state.showRemainingTime ? '-' : '';
        time = Math.min(Math.max(time, 0), this.state.duration);

        if (!this.state.showHours) {
            const formattedMinutes = padStart(String(Math.floor(time / 60).toFixed(0)), 2, '0');
            const formattedSeconds = padStart(String(Math.floor(time % 60).toFixed(0)), 2, '0');


            return `${symbol}${formattedMinutes}:${formattedSeconds}`;
        }

        const formattedHours = padStart(String(Math.floor(time / 3600).toFixed(0)), 2, '0');
        const formattedMinutes = padStart(String((Math.floor(time / 60) % 60).toFixed(0)), 2, '0');
        const formattedSeconds = padStart(String(Math.floor(time % 60).toFixed(0)), 2, '0');

        return `${symbol}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    /**
     * Set the position of the seekbar's components
     * (both fill and handle) according to the
     * position supplied.
     *
     * @param {float} position position in px of seeker handle}
     */
    setSeekerPosition(position = 0) {
        const state = this.state;
        position = this.constrainToSeekerMinMax(position);

        let seekerOffset = this.state.seekerOffset;
        if (!state.seeking) {
            seekerOffset = position;
        }

        this.setState({
            seekerFillWidth: position,
            seekerPosition: position,
            seekerOffset,
        });
    }

    /**
     * Constrain the location of the seeker to the
     * min/max value based on how big the
     * seeker is.
     *
     * @param {float} val position of seeker handle in px
     * @return {float} constrained position of seeker handle in px
     */
    constrainToSeekerMinMax(val = 0) {
        if (val <= 0) {
            return 0;
        } else if (val >= this.player.seekerWidth) {
            return this.player.seekerWidth;
        }
        return val;
    }

    /**
     * Calculate the position that the seeker should be
     * at along its track.
     *
     * @return {float} position of seeker handle in px based on currentTime
     */
    calculateSeekerPosition() {
        const percent = this.state.currentTime / this.state.duration;
        return this.player.seekerWidth * percent;
    }

    /**
     * Return the time that the video should be at
     * based on where the seeker handle is.
     *
     * @return {float} time in ms based on seekerPosition.
     */
    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }

    /**
     * Seek to a time in the video.
     *
     * @param {float} time time to seek to in ms
     */
    seekTo(time = 0) {
        this.player.ref.seek(time);
        this.setState({
            currentTime: time,
        });
    }

    /**
     * Set the position of the volume slider
     *
     * @param {float} position position of the volume handle in px
     */
    setVolumePosition(position = 0) {
        let {volumePosition, volumeFillWidth, volumeTrackWidth} = this.state;
        position = this.constrainToVolumeMinMax(position);
        volumePosition = position + this.player.iconOffset;
        volumeFillWidth = position;

        volumeTrackWidth = this.player.volumeWidth - volumeFillWidth;

        if (volumeFillWidth < 0) {
            volumeFillWidth = 0;
        }

        if (volumeTrackWidth > 150) {
            volumeTrackWidth = 150;
        }

        this.setState({
            volumePosition,
            volumeFillWidth,
            volumeTrackWidth,
        });
    }

    /**
     * Constrain the volume bar to the min/max of
     * its track's width.
     *
     * @param {float} val position of the volume handle in px
     * @return {float} contrained position of the volume handle in px
     */
    constrainToVolumeMinMax(val = 0) {
        if (val <= 0) {
            return 0;
        } else if (val >= this.player.volumeWidth + 9) {
            return this.player.volumeWidth + 9;
        }
        return val;
    }

    /**
     * Get the volume based on the position of the
     * volume object.
     *
     * @return {float} volume level based on volume handle position
     */
    calculateVolumeFromVolumePosition() {
        return this.state.volumePosition / this.player.volumeWidth;
    }

    /**
     * Get the position of the volume handle based
     * on the volume
     *
     * @return {float} volume handle position in px based on volume
     */
    calculateVolumePositionFromVolume() {
        return this.player.volumeWidth * this.state.volume;
    }

    /**
     | -------------------------------------------------------
     | React Component functions
     | -------------------------------------------------------
     |
     | Here we're initializing our listeners and getting
     | the component ready using the built-in React
     | Component methods
     |
     */

    /**
     * Before mounting, init our seekbar and volume bar
     * pan responders.
     */
    UNSAFE_componentWillMount() {
        this.initSeekPanResponder();
        this.initVolumePanResponder();
    }

    /**
     * To allow basic playback management from the outside
     * we have to handle possible props changes to state changes
     */
    UNSAFE_componentWillReceiveProps(nextProps: VideoPlayerProps) {
        if (this.styles.videoStyle !== nextProps.videoStyle) {
            this.styles.videoStyle = nextProps.videoStyle;
        }

        if (this.styles.containerStyle !== nextProps.style) {
            this.styles.containerStyle = nextProps.style;
        }
    }

    /**
     * Upon mounting, calculate the position of the volume
     * bar based on the volume property supplied to it.
     */
    componentDidMount() {
        const position = this.calculateVolumePositionFromVolume();
        this.setVolumePosition(position);
        this.mounted = true;

        this.setState({
            volumeOffset: position,
        });
    }

    /**
     * When the component is about to unmount kill the
     * timeout less it fire in the prev/next scene
     */
    componentWillUnmount() {
        this.mounted = false;
        this.clearControlTimeout();
    }

    /**
     * Get our seekbar responder going
     */
    initSeekPanResponder() {
        this.player.seekPanResponder = PanResponder.create({
            // Ask to be the responder.
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            /**
             * When we start the pan tell the machine that we're
             * seeking. This stops it from updating the seekbar
             * position in the onProgress listener.
             */
            onPanResponderGrant: (evt) => {
                let {originallyPaused, paused} = this.state;
                this.clearControlTimeout();
                const position = evt.nativeEvent.locationX;
                this.setSeekerPosition(position);
                originallyPaused = paused;
                if (this.player.scrubbingTimeStep > 0) {
                    paused = true;
                }
                this.setState({
                    seeking: true,
                    scrubbing: false,
                    originallyPaused,
                    paused,
                });
            },

            /**
             * When panning, update the seekbar position, duh.
             */
            onPanResponderMove: (evt, gestureState) => {
                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition(position);
                const state = this.state;

                if (this.player.scrubbingTimeStep > 0 && !state.loading && !state.scrubbing) {
                    const time = this.calculateTimeFromSeekerPosition();
                    const timeDifference = Math.abs(state.currentTime - time) * 1000;

                    if (time < state.duration && timeDifference >= this.player.scrubbingTimeStep) {
                        this.setState({
                            scrubbing: true,
                        });
                        setTimeout(() => {
                            this.player.ref.seek(time, this.player.scrubbingTimeStep);
                        }, 1);
                    }
                }
            },

            /**
             * On release we update the time and seek to it in the video.
             * If you seek to the end of the video we fire the
             * onEnd callback
             */
            onPanResponderRelease: () => {
                const time = this.calculateTimeFromSeekerPosition();
                let {paused, seeking} = this.state;
                if (time >= this.state.duration && !this.state.loading) {
                    paused = true;
                    this.events.onEnd();
                } else if (this.state.scrubbing) {
                    seeking = false;
                } else {
                    this.seekTo(time);
                    this.setControlTimeout();
                    paused = this.state.originallyPaused;
                    seeking = false;
                }
                this.setState({
                    paused,
                    seeking,
                });
            },
        });
    }

    /**
     * Initialize the volume pan responder.
     */
    initVolumePanResponder() {
        this.player.volumePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.clearControlTimeout();
            },

            /**
             * Update the volume as we change the position.
             * If we go to 0 then turn on the mute prop
             * to avoid that weird static-y sound.
             */
            onPanResponderMove: (evt, gestureState) => {
                const state = this.state;
                const position = this.state.volumeOffset + gestureState.dx;

                this.setVolumePosition(position);
                this.setState({
                    volume: this.calculateVolumeFromVolumePosition(),
                    muted: state.volume <= 0,
                });
            },

            /**
             * Update the offset...
             */
            onPanResponderRelease: () => {
                const state = this.state;
                this.setControlTimeout();
                this.setState({
                    volumeOffset: state.volumePosition,
                });
            },
        });
    }

    /**
     | -------------------------------------------------------
     | Rendering
     | -------------------------------------------------------
     |
     | This section contains all of our render methods.
     | In addition to the typical React render func
     | we also have all the render methods for
     | the controls.
     |
     */

    renderBlank() {
        return (
            <View style={[styles.player.container, this.styles.containerStyle, styles.blank.container]}/>
        );
    }

    /**
     * Standard render control function that handles
     * everything except the sliders. Adds a
     * consistent <TouchableHighlight>
     * wrapper and styling.
     */
    renderControl(children: React.ReactNode, callback: () => void, style = {}) {
        return (
            <TouchableHighlight
                underlayColor="transparent"
                activeOpacity={0.3}
                onPress={() => {
                    this.resetControlTimeout();
                    callback();
                }}
                style={[styles.controls.control, style]}>
                {children}
            </TouchableHighlight>
        );
    }

    /**
     * Renders an empty control, used to disable a control without breaking the view layout.
     */
    renderNullControl() {
        return <View style={[styles.controls.control]}/>;
    }

    /**
     * Groups the top bar controls together in an animated
     * view and spaces them out.
     */
    renderTopControls() {
        const backControl = this.props.disableBack ? this.renderNullControl() : this.renderBack();
        const volumeControl = this.props.disableVolume ? this.renderNullControl() : this.renderVolume();
        const fullscreenControl = this.props.disableFullscreen
            ? this.renderNullControl()
            : this.renderFullscreen();

        return (
            <View style={styles.controls.top}>
                <Animated.View
                    style={[
                        styles.controls.topAnimatedContainer,
                        {
                            opacity: this.animations.topControl.opacity,
                            marginTop: this.animations.topControl.marginTop,
                        },
                    ]}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
                        style={styles.controls.topControlGroup}>
                        {backControl}
                        <View style={styles.controls.pullRight}>
                            {volumeControl}
                            {fullscreenControl}
                        </View>
                    </LinearGradient>
                </Animated.View>
            </View>
        );
    }

    /**
     * Back button control
     */
    renderBack() {
        return this.renderControl(
            <Image source={require('./assets/img/back.png')} style={styles.controls.icon as StyleProp<ImageStyle>}/>,
            this.events.onBack,
            undefined
        );
    }

    /**
     * Render the volume slider and attach the pan handlers
     */
    renderVolume() {
        return (
            <View style={styles.volume.container}>
                <View style={[styles.volume.fill, {width: this.state.volumeFillWidth}]}/>
                <View style={[styles.volume.track, {width: this.state.volumeTrackWidth}]}/>
                <View
                    style={[styles.volume.handle, {left: this.state.volumePosition}]}
                    {...this.player.volumePanResponder.panHandlers}>
                    <Image style={styles.volume.icon} source={require('./assets/img/volume.png')}/>
                </View>
            </View>
        );
    }

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    renderFullscreen() {
        const source =
            this.state.fullscreen === true
                ? require('./assets/img/shrink3x.png')
                : require('./assets/img/expand3x.png');
        return this.renderControl(
            <Image source={source} style={styles.controls.icon as StyleProp<ImageStyle>}/>,
            this.methods.toggleFullscreen,
            styles.controls.fullscreen,
        );
    }

    /**
     * Render bottom control group and wrap it in a holder
     */
    renderBottomControls() {
        const timerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
        const seekbarControl = this.props.disableSeekbar
            ? this.renderNullControl()
            : this.renderSeekbar();
        const playPauseControl = this.props.disablePlayPause
            ? this.renderNullControl()
            : this.renderPlayPause();

        return (
            <View style={styles.controls.bottom}>
                <Animated.View
                    style={[
                        styles.controls.bottomAnimatedContainer,
                        {
                            opacity: this.animations.bottomControl.opacity,
                            marginBottom: this.animations.bottomControl.marginBottom,
                        },
                    ]}>
                    {seekbarControl}
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                        style={[styles.controls.row, styles.controls.bottomControlGroup]}>
                        {playPauseControl}
                        {this.renderTitle()}
                        {timerControl}
                    </LinearGradient>
                </Animated.View>
            </View>
        );
    }

    /**
     * Render the seekbar and attach its handlers
     */
    renderSeekbar() {
        return (
            <View
                style={styles.seekbar.container}
                collapsable={false}
                {...this.player.seekPanResponder.panHandlers}>
                <View
                    style={styles.seekbar.track}
                    onLayout={event => (this.player.seekerWidth = event.nativeEvent.layout.width)}
                    pointerEvents={'none'}>
                    <View
                        style={[
                            styles.seekbar.fill,
                            {
                                width: this.state.seekerFillWidth,
                                backgroundColor: this.props.seekColor || '#FFF',
                            },
                        ]}
                        pointerEvents={'none'}
                    />
                </View>
                <View
                    style={[styles.seekbar.handle, {left: this.state.seekerPosition}]}
                    pointerEvents={'none'}>
                    <View
                        style={[styles.seekbar.circle, {backgroundColor: this.props.seekColor || '#FFF'}]}
                        pointerEvents={'none'}
                    />
                </View>
            </View>
        );
    }

    /**
     * Render the play/pause button and show the respective icon
     */
    renderPlayPause() {
        const source =
            this.state.paused
                ? require('./assets/img/play3x.png')
                : require('./assets/img/pause3x.png');
        return this.renderControl(
            <Image source={source} style={styles.controls.icon as StyleProp<ImageStyle>}/>,
            this.methods.togglePlayPause,
            styles.controls.playPause,
        );
    }

    /**
     * Render our title...if supplied.
     */
    renderTitle() {
        if (this.opts.title) {
            return (
                <View style={[styles.controls.control, styles.controls.title]}>
                    <Text style={[styles.controls.text, styles.controls.titleText]} numberOfLines={1}>
                        {this.opts.title || ''}
                    </Text>
                </View>
            );
        }

        return null;
    }

    /**
     * Show our timer.
     */
    renderTimer() {
        return this.renderControl(
            <Text style={styles.controls.timerText}>{this.calculateTime()}</Text>,
            this.methods.toggleTimer,
            undefined
        );
    }

    /**
     * Show loading icon
     */
    renderLoader() {
        if (this.state.loading) {
            return (
                <View style={styles.loader.container}>
                    <Animated.Image
                        source={require('./assets/img/loader-icon3x.png')}
                        style={[
                            styles.loader.icon,
                            {
                                transform: [
                                    {
                                        rotate: this.animations.loader.rotate.interpolate({
                                            inputRange: [0, 360],
                                            outputRange: ['0deg', '360deg'],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
            );
        }
        return null;
    }

    renderError() {
        if (this.state.error) {
            return (
                <View style={[styles.player.container, this.styles.containerStyle, styles.error.container]}>
                    <Text style={styles.error.text}>Failed to play video.</Text>
                    {this.renderControl(
                        <Image source={require('./assets/img/error-icon3x.png')} style={styles.error.icon}/>,
                        this.methods.reconnectAfterError,
                        undefined
                    )}
                    <Text style={styles.error.text}>Click to retry.</Text>
                </View>
            );
        }
        return null;
    }

    renderPoster() {
        const {thumbUri, headers} = this.props;
        const {paused, error, fullscreen} = this.state;
        if (!paused || error || fullscreen || !thumbUri) {
            return null;
        }

        return (
            <Image
                style={styles.poster.image}
                source={{
                    uri: thumbUri,
                    headers: headers,
                }}
            />
        );
    }

    renderVideo() {
        const {resizeMode, volume, error, paused, muted, rate, fullscreen} = this.state;
        const {uri, headers, nativeControls, disableFocus, disposeOnPause} = this.props;
        const {
            onLoadStart,
            onProgress,
            onError,
            onLoad,
            onEnd,
            onSeek,
            onPlaybackStateChanged,
            onFullscreenPlayerDidPresent,
            onFullscreenPlayerDidDismiss,
            onPlaybackRateChange,
        } = this.events;
        if (error || (paused && disposeOnPause && !fullscreen)) {
            return null;
        }
        return (
            <Video
                ref={videoPlayer => (this.player.ref = videoPlayer)}
                resizeMode={resizeMode}
                controls={nativeControls}
                disableFocus={disableFocus}
                volume={volume}
                paused={paused}
                muted={muted}
                rate={rate}
                fullscreen={fullscreen}
                fullscreenOrientation={'landscape'}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                onError={onError}
                onLoad={onLoad}
                onEnd={onEnd}
                onSeek={onSeek}
                onPlaybackStateChanged={onPlaybackStateChanged}
                style={[styles.player.video, this.styles.videoStyle]}
                onFullscreenPlayerDidPresent={onFullscreenPlayerDidPresent}
                onFullscreenPlayerDidDismiss={onFullscreenPlayerDidDismiss}
                onPlaybackRateChange={onPlaybackRateChange}
                source={{
                    uri,
                    headers,
                }}
                bufferConfig={{
                    minBufferMs: 3000,
                    maxBufferMs: 5000,
                    bufferForPlaybackMs: 3000,
                    bufferForPlaybackAfterRebufferMs: 3000,
                }}
            />
        );
    }

    renderScreenTouchHandler(children: React.ReactNode) {
        if (this.props.externalScreenTouchProvider) {
            return <View style={[styles.player.container, this.styles.containerStyle]}>{children}</View>;
        }
        return (
            <TouchableWithoutFeedback
                onPress={this.events.onScreenTouch}
                style={[styles.player.container, this.styles.containerStyle]}>
                {children}
            </TouchableWithoutFeedback>
        );
    }

    /**
     * Provide all of our options and render the whole component.
     */
    render() {
        if (!this.props.uri) {
            return this.renderBlank();
        }
        return this.renderScreenTouchHandler(
            <View style={[styles.player.container, this.styles.containerStyle]}>
                {this.renderVideo()}
                {this.renderError()}
                {this.renderPoster()}
                {this.renderLoader()}
                {this.renderTopControls()}
                {this.renderBottomControls()}
            </View>,
        );
    }
}

const styles = {
    player: StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            backgroundColor: '#000',
            flex: 1,
            justifyContent: 'space-between',
            overflow: 'hidden',
        },
        video: {
            bottom: 0,
            left: 0,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            top: 0,
        },
    }),
    poster: StyleSheet.create({
        image: {
            height: '100%',
            position: 'absolute',
            resizeMode: 'contain',
            width: '100%',
        },
    }),
    blank: StyleSheet.create({
        container: {
            backgroundColor: 'black',
        },
    }),
    error: StyleSheet.create({
        container: {
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            zIndex: 1,
        },
        icon: {
            aspectRatio: 1,
            resizeMode: 'contain',
            width: '10%',
        },
        text: {
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: wp(3),
        },
    }),
    loader: StyleSheet.create({
        container: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        icon: {
            aspectRatio: 1,
            resizeMode: 'contain',
            width: wp(10),
        },
    }),
    controls: StyleSheet.create({
        bottom: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-end',
            zIndex: 0,
        },
        bottomAnimatedContainer: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-end',
        },
        bottomControlGroup: {
            alignItems: 'center',
            alignSelf: 'stretch',
            height: '25%',
            justifyContent: 'space-between',
            paddingLeft: 12,
            paddingRight: 12,
        },
        column: {
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        control: {},
        fullscreen: {
            position: 'relative',
            zIndex: 0,
        },
        icon: {
            aspectRatio: 1,
            height: '70%',
            resizeMode: 'contain',
        },
        playPause: {
            position: 'relative',
            zIndex: 0,
        },
        pullRight: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        rewindForward: {
            position: 'relative',
            zIndex: 0,
        },
        row: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        text: {
            backgroundColor: 'transparent',
            color: '#FFF',
            fontSize: wp(2.5),
            textAlign: 'center',
        },
        timerText: {
            color: '#FFF',
            fontSize: wp(2.5),
            height: '100%',
            textAlign: 'center',
            textAlignVertical: 'center',
            width: '100%',
        },
        title: {
            alignItems: 'center',
            flex: 0.6,
            flexDirection: 'column',
            padding: 0,
        },
        titleText: {
            textAlign: 'center',
        },
        top: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-start',
            zIndex: 0,
        },
        topAnimatedContainer: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-start',
        },
        topControlGroup: {
            alignItems: 'center',
            alignSelf: 'stretch',
            flexDirection: 'row',
            height: '25%',
            justifyContent: 'space-between',
            paddingLeft: 12,
            paddingRight: 12,
        },
        vignette: {
            resizeMode: 'stretch',
        },
        volume: {
            flexDirection: 'row',
        },
    }),
    volume: StyleSheet.create({
        container: {
            alignItems: 'center',
            flexDirection: 'row',
            height: 1,
            justifyContent: 'flex-start',
            marginLeft: 40,
            marginRight: 40,
            width: 150,
        },
        fill: {
            backgroundColor: '#FFF',
            height: 1,
        },
        handle: {
            marginLeft: -24,
            marginTop: -24,
            padding: 16,
            position: 'absolute',
        },
        icon: {
            marginLeft: 7,
        },
        track: {
            backgroundColor: '#333',
            height: 1,
            marginLeft: 7,
        },
    }),
    seekbar: StyleSheet.create({
        circle: {
            borderRadius: 12,
            height: 12,
            left: 8,
            position: 'relative',
            top: 8,
            width: 12,
        },
        container: {
            alignSelf: 'stretch',
            height: 28,
            marginLeft: 20,
            marginRight: 20,
        },
        fill: {
            backgroundColor: '#FFF',
            height: 1,
            width: '100%',
        },
        handle: {
            height: 28,
            marginLeft: -7,
            position: 'absolute',
            width: 28,
        },
        track: {
            backgroundColor: '#333',
            height: 1,
            position: 'relative',
            top: 14,
            width: '100%',
        },
    }),
};
