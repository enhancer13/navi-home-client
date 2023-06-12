import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Searchbar as PaperSearchBar} from 'react-native-paper';
import {FadeAnimation, ResizeAnimation, SlideAnimation} from "../../Animations";

declare type SearchBarProps = {
    searchActive: boolean;
    onSearchQueryChange: (query: string) => void;
    debounceTime?: number;
    loading?: boolean;
}

const HEIGHT = 72;

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        searchActive,
                                                        onSearchQueryChange,
                                                        debounceTime,
                                                        loading
                                                    }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchBarSlideAnimation = useRef(new SlideAnimation('y', new Animated.Value(0))).current;
    const searchBarHeightAnimation = useRef(new ResizeAnimation('height', new Animated.Value(0))).current;
    const searchBarFadeAnimation = useRef(new FadeAnimation(new Animated.Value(1))).current;
    const searchTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        Animated.parallel([
            searchBarFadeAnimation.getAnimation(searchActive ? 1 : 0, searchActive ? 250 : 100),
            searchBarSlideAnimation.getAnimation(searchActive ? 0 : -HEIGHT, 250),
            searchBarHeightAnimation.getAnimation(searchActive ? HEIGHT : 0, 250)
        ]).start();

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchActive]);

    const onSearchChange = (query: string) => {
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            onSearchQueryChange(query);
        }, debounceTime);
    };

    return (
        <Animated.View
            style={[
                styles.container,
                searchBarSlideAnimation.getStyle(),
                searchBarHeightAnimation.getStyle(),
                searchBarFadeAnimation.getStyle()
            ]}
        >
            <PaperSearchBar
                placeholder="Type to search ..."
                onChangeText={onSearchChange}
                value={searchQuery}
                elevation={1}
                loading={loading}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        overflow: 'hidden',
        justifyContent: 'center',
    },
});
