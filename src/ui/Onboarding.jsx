const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { FontIcon } = require('~/react-toolbox');
const UsageCloud = require('~/ui/shared-components/UsageCloud');
const { User } = require('~/icebear');
const T = require('~/ui/shared-components/T');

function createOnboardingItem(icon, title, description, valueFn, action) {
    return { icon, title, description, valueFn, action };
}

@observer
class Onboarding extends React.Component {
    @observable waiting = false;

    items = [
        createOnboardingItem(
            'mail',
            'Confirm your email',
            'Get new copy for this and encourage users to do this task',
            () => User.current.hasConfirmedEmailBonus,
            () => window.router.push('/app/settings/profile')
        ),
        createOnboardingItem(
            'forum',
            'Create a room',
            'How much is this worth? This needs new copy.',
            () => User.current.hasCreatedRoomBonus,
            () => window.router.push('/app/new-channel')
        ),
        createOnboardingItem(
            'person_add',
            'Invite friends to join Peerio',
            'Earn 50MB storage per friend. Up to 5 friends.',
            () => User.current.hasInvitedFriendsBonus,
            () => window.router.push('/app/contacts')
        ),
        createOnboardingItem(
            'phonelink_setup',
            'Enable Two-Step Verification',
            'Earn 100MB storage while increasing your security.',
            () => User.current.hasTwoFABonus,
            () => window.router.push('/app/settings/security')
        ),
        createOnboardingItem(
            'phonelink_setup',
            <T k="title_onboardingInstallMobileApp" />,
            'Earn 100MB storage and access to Peerio while on the go.',
            () => User.current.hasInstallBonus
        )
    ];

    renderItem = item => {
        const { icon, title, description, valueFn, action } = item;
        const done = valueFn();
        return (
            <div key={title}
                onClick={done ? null : action}
                className={css('onboarding-to-do', { done, clickable: !done && !!action })}>
                <div className="flex-row">
                    <FontIcon value={icon} />
                    <div className="flex-col">
                        <div className="title">{title}</div>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="onboarding">
                <div className="onboarding-content">
                    <div className="display-1">Thanks for joining Peerio!</div>
                    <div className="title">Get more free storage by completing these tasks!</div>
                    {/* I am hiding this because confirming email does not give a bonus right now */}
                    {/* <p>200mb of 1000mb earned</p> */}
                    <div className="onboarding-to-dos">
                        {this.items.filter(item => !item.valueFn()).map(this.renderItem)}
                        {this.items.filter(item => item.valueFn()).map(this.renderItem)}
                    </div>
                    {/* TODO Add cloud icon with meter and usage info */}
                    <div style={{ textAlign: 'center', margin: 'auto' }}>
                        <UsageCloud />
                    </div>
                    <div className="onboarding-info">Click the cloud icon in the lower left to return to this list.</div>
                </div>
            </div>
        );
    }
}


module.exports = Onboarding;
