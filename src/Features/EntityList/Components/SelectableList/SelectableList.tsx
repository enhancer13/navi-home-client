import React from 'react';
import {Animated, ListRenderItem, RefreshControl, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SelectableItem from './SelectableItem';
import FlexContainer from '../../../../Components/Layout/FlexContainer';
import {ActivityIndicator, MD3Theme} from 'react-native-paper';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {sortBy} from 'lodash';

interface Props<TItem> {
    refreshing: boolean;
    items: TItem[];
    columnCount: number;
    onSelectionChanged: (items: TItem[]) => void;
    onSelectionStarted: () => void;
    onSelectionStopped: () => void;
    onPress: (item: TItem) => void;
    onRefresh: () => void;
    onEndReached: ((info: {distanceFromEnd: number}) => void);
    renderItem: (item: TItem, props: { width: number }) => React.ReactNode;
    keyExtractor: (item: TItem) => string;
    theme: MD3Theme;
    onScroll?: | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
}

declare type State<TItem> = {
    items: TItem[];
    selectedKeys: string[];
    selectionActive: boolean;
}

export default class SelectableList<TItem> extends React.Component<Props<TItem>, State<TItem>> {
    constructor(props: Props<TItem>) {
        super(props);
        this.state = { items: [], selectedKeys: [], selectionActive: false };
    }

    static getDerivedStateFromProps(nextProps: Props<any>, prevState: State<any>) {
        const newItems = [...nextProps.items];
        const keyExtractor = nextProps.keyExtractor;
        const selectedKeys = prevState.selectedKeys.filter(x => newItems.some(y => keyExtractor(y) === x));
        return {
            ...prevState,
            items: newItems,
            selectedKeys,
        };
    }

    selectAll(): void {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedKeys: prevState.items.map(this.props.keyExtractor),
                selectionActive: true,
            };
        });
    }

    deselectAll(): void {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedKeys: [],
            };
        });
    }

    startSelection(): void {
        this.setState(prevState => {
            return {
                ...prevState,
                selectionActive: true,
            };
        });
    }

    stopSelection(): void {
        this.setState(prevState => {
            return {
                ...prevState,
                selectedKeys: [],
                selectionActive: false,
            };
        });
    }

    getSelectedItems(): TItem[] {
        const {items, selectedKeys} = this.state;
        return items.filter(x => selectedKeys.includes(this.props.keyExtractor(x)));
    }

    hasSelectedItems(): boolean {
        return this.state.selectedKeys.length > 0;
    }

    selectionActive(): boolean {
        return this.state.selectionActive;
    }

    onItemLongPress = (item: TItem) => {
        this.setState(prevState => {
            let selectedKeys: string[] = [];
            if (!this.state.selectionActive) {
                selectedKeys = [...prevState.selectedKeys];
                selectedKeys.push(this.props.keyExtractor(item));
            }

            return {
                ...prevState,
                selectedKeys: [...new Set(selectedKeys)],
                selectionActive: !prevState.selectionActive,
            };
        });
    };

    onItemPress = (item: TItem) => {
        if (!this.state.selectionActive) {
            this.props.onPress(item);
            return;
        }

        this.setState(prevState => {
            let selectedItemKeys = [...prevState.selectedKeys];
            const pressedItemKey = this.props.keyExtractor(item);
            const index = selectedItemKeys.indexOf(pressedItemKey);
            if (index > -1) {
                selectedItemKeys = selectedItemKeys.filter(x => x !== pressedItemKey);
            } else {
                selectedItemKeys.push(pressedItemKey);
            }
            return {
                ...prevState,
                selectedKeys: [...new Set(selectedItemKeys)],
            };
        });
    };

    renderSelectableItem: ListRenderItem<TItem> = ({item}) => {
        const {columnCount, renderItem, keyExtractor} = this.props;
        const columnWidth = wp(Math.floor(100 / columnCount));
        const key = keyExtractor(item);
        const selected = this.state.selectedKeys.includes(key);

        return (
            <SelectableItem key={key} content={(props: { width: number }) => renderItem(item, props)}
                            selected={selected}
                            width={columnWidth}
                            onPress={() => this.onItemPress(item)}
                            onLongPress={() => this.onItemLongPress(item)}/>
        );
    };

    componentDidUpdate(prevProps: Readonly<Props<TItem>>, prevState: Readonly<State<TItem>>) {
        if (prevState.selectionActive !== this.state.selectionActive) {
            if (this.state.selectionActive) {
                this.props.onSelectionStarted();
            } else {
                this.props.onSelectionStopped();
            }
        }

        const sortedPreviousSelectedIds = sortBy(prevState.selectedKeys);
        const sortedSelectedIds = sortBy(this.state.selectedKeys);
        if (sortedPreviousSelectedIds.length !== sortedSelectedIds.length || !sortedPreviousSelectedIds.every((elem, i) => elem === sortedSelectedIds[i])) {
            this.props.onSelectionChanged(this.getSelectedItems());
        }
    }

    render() {
        const {refreshing, columnCount, keyExtractor, theme, onRefresh, onEndReached, onScroll} = this.props;
        const {items, selectedKeys} = this.state;

        return (
            <FlexContainer>
                {refreshing ? (<ActivityIndicator/>) : (
                    <Animated.FlatList
                        numColumns={columnCount}
                        keyExtractor={keyExtractor}
                        data={items as any}
                        renderItem={this.renderSelectableItem}
                        style={[styles.flatList]}
                        columnWrapperStyle={columnCount > 1 ? styles.columnWrapperStyle : null}
                        refreshing={refreshing}
                        refreshControl={<RefreshControl tintColor={theme.colors.primary}
                                                        titleColor={theme.colors.primary}
                                                        refreshing={refreshing} onRefresh={onRefresh}/>}
                        onEndReachedThreshold={0.5}
                        onEndReached={onEndReached}
                        extraData={selectedKeys}
                        onScroll={onScroll}
                    />
                )}
            </FlexContainer>
        );
    }
}

const styles = StyleSheet.create({
    columnWrapperStyle: {
        justifyContent: 'flex-start',
    },
    flatList: {
        paddingTop: 5,
    },
});
