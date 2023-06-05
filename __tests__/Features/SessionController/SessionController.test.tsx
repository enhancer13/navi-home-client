import { render } from '@testing-library/react-native';
import React from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {usePopupMessage} from "../../../src/Features/Messaging";
import {useAuth} from "../../../src/Features/Authentication";
import SessionController from "../../../src/Features/SessionController";
import moment from "moment/moment";

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
        jest.resetModules();
        jest.useFakeTimers();
        showWarning = jest.fn();
        (usePopupMessage as jest.Mock).mockReturnValue({ showWarning });
        originalDateNow = Date.now;
        Date.now = jest.fn(() => new Date('2023-03-28T11:59:30Z').getTime());
    });

    afterEach(() => {
        jest.useRealTimers();
        Date.now = originalDateNow;
    });

    it('shows a warning when the session is about to expire', async () => {
        // Mock dependencies
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: moment('2023-03-28T12:00:00Z')
            },
            logout: jest.fn(),
        });

        render(<SessionController />);

        jest.advanceTimersByTime(5000);
        expect(showWarning).toHaveBeenCalledWith('Your session will expire in 30 seconds.');
    });

    it('logs out and shows a warning when the session has expired', () => {
        // Mock dependencies
        const logout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            authentication: {
                expirationDateTime: new Date(Date.now() - 1000).toISOString(),
            },
            logout,
        });

        render(<SessionController />);

        jest.advanceTimersByTime(5000);

        expect(logout).toHaveBeenCalled();
        expect(showWarning).toHaveBeenCalledWith('Your session has expired, please login');
    });

    it('dispatch navigation action to root page when the session has expired', () => {
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
        render(<SessionController />);
        jest.advanceTimersByTime(5000);

        //Assert
        expect(dispatch).toHaveBeenCalledWith(StackActions.popToTop());
    });
});
