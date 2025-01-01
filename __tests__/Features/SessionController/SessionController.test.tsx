import {render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {usePopupMessage} from '../../../src/Features/Messaging';
import {useAuth} from '../../../src/Features/Authentication';
import {SessionController} from '../../../src/Features/SessionController';
import moment from 'moment';

jest.mock('../../../src/Features/Messaging', () => ({
    usePopupMessage: jest.fn(),
}));

jest.mock('../../../src/Features/Authentication', () => ({
    useAuth: jest.fn(),
}));

describe('SessionController', () => {
    let showWarning: jest.Mock;

    beforeEach(() => {
        showWarning = jest.fn();
        (usePopupMessage as jest.Mock).mockReturnValue({showWarning});
        jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-03-28T11:59:30Z').getTime());
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('shows a warning when the session is about to expire', async () => {
        // Arrange
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: moment('2023-03-28T12:00:00Z').toISOString(),
            },
            logout: jest.fn(),
        });

        // Act
        render(<SessionController/>);

        // Assert
        await waitFor(() => expect(showWarning).toHaveBeenCalledWith('Your session will expire in 30 seconds.'), {timeout: 10000});
    }, 10000);

    it('logs out and shows a warning when the session has expired', async () => {
        // Arrange
        const logout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: moment().subtract(1, 'seconds').toISOString(),
            },
            logout,
        });

        // Act
        render(<SessionController/>);

        // Assert
        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            expect(showWarning).toHaveBeenCalledWith('Your session has expired, please login');
        }, {timeout: 10000});
    }, 10000);

    it('dispatches navigation action to root page when the session has expired', async () => {
        // Arrange
        const logout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: moment().subtract(1, 'seconds').toISOString(),
            },
            logout,
        });
        const dispatch = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({dispatch});

        // Act
        render(<SessionController/>);

        // Assert
        await waitFor(() => expect(dispatch).toHaveBeenCalledWith(StackActions.popToTop()), {timeout: 10000});
    }, 10000);
});
