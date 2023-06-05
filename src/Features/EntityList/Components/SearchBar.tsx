import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Searchbar as PaperSearchBar} from 'react-native-paper';
import {ResizeAnimation, SlideAnimation} from "../../../Animations";

declare type SearchBarProps = {
    searchActive: boolean;
    onSearchQueryChange: (query: string) => void;
    debounceTime?: number;
    loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        searchActive,
                                                        onSearchQueryChange,
                                                        debounceTime,
                                                        loading
                                                    }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchBarSlideAnimationRef = useRef(new SlideAnimation('y', new Animated.Value(0)));
    const searchBarHeightAnimationRef = useRef(new ResizeAnimation('height', new Animated.Value(0)));
    const searchTimeoutRef = useRef<number | null>(null);
    const height = 72;

    useEffect(() => {
        Animated.parallel([
            searchBarSlideAnimationRef.current.getAnimation(searchActive ? 0 : -height, 250),
            searchBarHeightAnimationRef.current.getAnimation(searchActive ? height : 0, 250)
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
                searchBarSlideAnimationRef.current.getStyle(),
                searchBarHeightAnimationRef.current.getStyle()
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
