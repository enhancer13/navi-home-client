import {render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {usePopupMessage} from '../../../src/Features/Messaging';
import {useAuth} from '../../../src/Features/Authentication';
import {SessionController} from '../../../src/Features/SessionController';
import moment from 'moment/moment';

jest.mock('../../../src/Features/Messaging', () => ({
    usePopupMessage: jest.fn(),
}));

jest.mock('../../../src/Features/Authentication', () => ({
    useAuth: jest.fn(),
}));

describe('SessionController', () => {
    let showWarning: jest.Mock;
    let originalDateNow: () => number;

    beforeEach(() => {
        jest.useFakeTimers();
        showWarning = jest.fn();
        (usePopupMessage as jest.Mock).mockReturnValue({showWarning});
        originalDateNow = Date.now;
        Date.now = jest.fn(() => new Date('2023-03-28T11:59:30Z').getTime());
    });

    afterEach(() => {
        jest.useRealTimers();
        Date.now = originalDateNow;
    });

    it('shows a warning when the session is about to expire', async () => {
        // Arrange
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: moment('2023-03-28T12:00:00Z'),
            },
            logout: jest.fn(),
        });

        // Act
        render(<SessionController/>);
        jest.advanceTimersByTime(5000);
        await waitFor(() => expect(showWarning).toHaveBeenCalled(), {timeout: 1000});

        // Assert
        expect(showWarning).toHaveBeenCalledWith('Your session will expire in 30 seconds.');
    });

    it('logs out and shows a warning when the session has expired', async () => {
        // Arrange
        const logout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: new Date(Date.now() - 1000).toISOString(),
            },
            logout,
        });

        // Act
        render(<SessionController/>);
        jest.advanceTimersByTime(5000);
        await waitFor(() => expect(showWarning).toHaveBeenCalled(), {timeout: 1000});

        // Assert
        expect(logout).toHaveBeenCalled();
        expect(showWarning).toHaveBeenCalledWith('Your session has expired, please login');
    });

    it('dispatch navigation action to root page when the session has expired', async () => {
        //Arrange
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: new Date(Date.now() - 1000).toISOString(),
            },
            logout: jest.fn(),
        });
        const dispatch = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            dispatch,
        });

        //Act
        render(<SessionController/>);
        jest.advanceTimersByTime(5000);
        await waitFor(() => expect(dispatch).toHaveBeenCalled(), {timeout: 1000});

        //Assert
        expect(dispatch).toHaveBeenCalledWith(StackActions.popToTop());
    });
});
