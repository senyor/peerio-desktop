import { S, duration } from 'peerio-icebear/dist/telemetry';

import { setup } from '../main';
import { DurationEvent, TextInputEvent } from '../types';

const login = setup({
    // Login.tsx
    duration: (startTime: number): DurationEvent => [
        S.DURATION,
        {
            location: S.SIGN_IN,
            totalTime: duration(startTime)
        }
    ],

    changeUser: ['Change User'],

    onLoginWithEmail: [
        S.TEXT_INPUT,
        {
            item: S.USERNAME,
            location: S.SIGN_IN,
            sublocation: S.SIGN_IN,
            state: S.ERROR,
            errorType: 'Using @'
        }
    ] as TextInputEvent,

    toggleAkVisibility: (isVisible: boolean) => [
        S.TOGGLE_VISIBILITY,
        {
            item: S.ACCOUNT_KEY,
            location: S.SIGN_IN,
            visible: isVisible
        }
    ],

    onLoginClick: [S.SIGN_IN, { option: S.MANUAL }],

    loginFail: [
        S.SIGN_IN_FAIL,
        {
            option: S.MANUAL
        }
    ],

    loginSuccess: (autologin: boolean, twoFaEnabled: boolean) => [
        S.SIGN_IN_SUCCESS,
        {
            option: autologin ? S.AUTO : S.MANUAL,
            condition: twoFaEnabled ? S.TSV_ON : S.TSV_OFF
        }
    ],

    // TwoFADialog.jsx
    twoFaFail: (autologin: boolean) => [
        S.SIGN_IN_FAIL,
        {
            option: autologin ? S.AUTO : S.MANUAL,
            condition: S.TSV_ON,
            location: S.SIGN_IN,
            sublocation: S.TSV_DIALOG
        }
    ],

    // SignupLink.jsx
    navToCreateAccount: [
        S.START_ACCOUNT_CREATION,
        {
            location: S.SIGN_IN
        }
    ],

    // NewUser.tsx
    newUserDuration: (startTime: number): DurationEvent => [
        S.DURATION,
        {
            location: S.ONBOARDING,
            sublocation: S.WELCOME_SCREEN,
            totalTime: duration(startTime)
        }
    ],

    newUserNavToCreateAccount: [
        S.START_ACCOUNT_CREATION,
        {
            location: S.ONBOARDING,
            sublocation: S.WELCOME_SCREEN
        }
    ],

    newUserNavToSignIn: [
        S.NAVIGATE,
        {
            option: S.SIGN_IN,
            location: S.ONBOARDING,
            sublocation: S.WELCOME_SCREEN
        }
    ]
});

export default login;
