export const useCalculateDimensions = (width: number, height: number, maxWidth: number, maxHeight: number) => {
    if (!width || !height) {
        return {width: maxWidth, height: maxHeight};
    }

    // Width adjustment
    if (width > maxWidth) {
        const pixelSize = maxWidth / width;
        width *= pixelSize;
        height *= pixelSize;
    }

    // Height adjustment
    if (height > maxHeight) {
        const pixelSize = maxHeight / height;
        width *= pixelSize;
        height *= pixelSize;
    }

    return {width, height};
};
