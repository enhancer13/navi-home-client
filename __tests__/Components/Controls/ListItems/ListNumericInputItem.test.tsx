import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {ListNumericInputItem} from '../../../../src/Components/Controls/ListItems';

describe('ListNumericInputItem', () => {
    let mockOnValueChanged: (value: number | null) => void;

    beforeEach(() => {
        jest.useFakeTimers();
        mockOnValueChanged = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders correctly', () => {
        // Arrange + Act
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );

        // Assert
        expect(getByTestId('text-input-flat')).toBeTruthy();
    });

    it('renders null value as empty string', () => {
        // Arrange + Act
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Assert
        expect(input.props.value).toBe('');
    });

    it('renders decimal value 123.45 as "123.45"', () => {
        // Arrange + Act
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={123.45}
            />
        );
        const input = getByTestId('text-input-flat');

        // Assert
        expect(input.props.value).toBe('123.45');
    });

    it('calls onValueChanged when integer value changes', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, '100');

        // Assert
        expect(mockOnValueChanged).toHaveBeenCalledWith(100);
    });

    it('calls onValueChanged when decimal value changes', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="decimal"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, '100.12');

        // Assert
        expect(mockOnValueChanged).toHaveBeenCalledWith(100.12);
    });

    it("doesn't allow non-numeric input when input mode is integer", () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, 'abc');

        // Assert
        expect(mockOnValueChanged).not.toHaveBeenCalled();
    });

    it("doesn't allow non-numeric input when input mode is decimal", () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="decimal"
                value={123}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, 'abc');

        // Assert
        expect(input.props.value).toBe('123');
    });

    it('onValueChanged is not called when user enters non-numeric value', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="decimal"
                value={123}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, 'abc');

        // Assert
        expect(mockOnValueChanged).not.toHaveBeenCalled();
    });

    it('calls onValueChanged with null when input cleared', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, '');

        // Assert
        expect(mockOnValueChanged).toHaveBeenCalledWith(null);
    });

    it('doesnt call onValueChanged when input is empty space', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, ' ');

        // Assert
        expect(mockOnValueChanged).not.toHaveBeenCalled();
    });

    it('doesnt show empty space when user entered empty space', () => {
        // Arrange
        const { getByTestId } = render(
            <ListNumericInputItem
                title="Test"
                placeholder=" "
                onValueChanged={mockOnValueChanged}
                inputMode="numeric"
                value={null}
            />
        );
        const input = getByTestId('text-input-flat');

        // Act
        fireEvent.changeText(input, ' ');

        // Assert
        expect(input.props.value).toBe('');
    });
});
