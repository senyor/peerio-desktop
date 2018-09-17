/*
    These are the events for components that are shared between multiple views.
    Since they appear in more than one place, they need to know the current route for the `Sublocation` prop.
    Thus, they need to react to the routerStore.currentRoute value.
*/

import { setup } from '~/telemetry/main';
import routerStore from '~/stores/router-store';
import { TextInputEvent } from '~/telemetry/types';
import { telemetry } from 'peerio-icebear';
const { S, errorMessage } = telemetry;

function context() {
    const { ROUTES, currentRoute } = routerStore;
    const routeNames = {
        [ROUTES.login]: 'Sign In',
        [ROUTES.signup]: 'Onboarding',
        [ROUTES.about]: 'About'
    };
    return routeNames[currentRoute] || 'Unknown route';
}

// TODO: try to get around `any` type
const shared: any = setup({
    validatedInputOnFocus: (label: string): TextInputEvent => {
        return [
            S.TEXT_INPUT,
            {
                item: label,
                location: context(),
                state: S.IN_FOCUS
            }
        ];
    },

    validatedInputOnBlur: (label, errorMsg): TextInputEvent => {
        // We're only sending onBlur events if the input is errored
        if (!errorMsg) return null;

        // Sign Up page "Username Not Available" is reported onError; do not send onBlur.
        const c = context();
        if (c === S.SIGN_UP && errorMsg === 'error_usernameNotAvailable')
            return null;

        return [
            S.TEXT_INPUT,
            {
                item: label,
                location: c,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    validatedInputOnClear: label => {
        return [
            S.CLEAR_TEXT,
            {
                item: label,
                location: context()
            }
        ];
    },

    lawEnforcementLink: [
        S.VIEW_LINK,
        {
            item: S.LAW_ENFORCEMENT_GUIDE,
            location: context()
        }
    ]
});

export default shared;
