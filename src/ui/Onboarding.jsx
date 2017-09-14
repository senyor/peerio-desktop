const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { FontIcon } = require('~/react-toolbox');
const UsageCloud = require('~/ui/shared-components/UsageCloud');
const { User } = require('~/icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

function createOnboardingItem(icon, title, description, valueFn, action, extraClass, buttonItem) {
    return { icon, title, description, valueFn, action, extraClass, buttonItem };
}

@observer
class Onboarding extends React.Component {
    @observable waiting = false;

    get items() {
        const { currentInvitedPeopleBonus, maxInvitedPeopleBonus } = User.current;
        return [
            createOnboardingItem(
                'mail',
                t('title_onboardingConfirmEmail'),
                t('title_onboardingConfirmEmailContent'),
                () => User.current.hasConfirmedEmailBonus,
                () => window.router.push('/app/settings/profile')
            ),
            createOnboardingItem(
                'settings',
                'Upload your avatar',
                '100MB storage added',
                () => User.current.hasAvatarUploadedBonus,
                () => window.router.push('/app/settings/profile')
            ),
            createOnboardingItem(
                'file_download',
                'Save your Account Key PDF document',
                '100MB storage added',
                () => User.current.hasAccountKeyBackedUpBonus,
                () => window.router.push('/app/settings/security')
            ),
            createOnboardingItem(
                'forum',
                t('title_onboardingCreateARoom'),
                t('title_onboardingCreateARoomContent'),
                () => User.current.hasCreatedRoomBonus,
                () => window.router.push('/app/new-channel'),
                'chat-item-add',
                <div className="chat-item-add-icon" />
            ),
            createOnboardingItem(
                'person_add',
                t('title_onboardingInvitePeople', { current: currentInvitedPeopleBonus, max: maxInvitedPeopleBonus }),
                t('title_onboardingInvitePeopleContent'),
                () => currentInvitedPeopleBonus >= maxInvitedPeopleBonus,
                () => window.router.push('/app/contacts')
            ),
            createOnboardingItem(
                'phonelink_setup',
                t('title_onboardingTSV'),
                t('title_onboardingTSVContent'),
                () => User.current.hasTwoFABonus,
                () => window.router.push('/app/settings/security')
            ),
            createOnboardingItem(
                'phonelink_setup',
                <T k="title_onboardingInstallMobileApp" />,
                t('title_onboardingInstallMobileAppContent'),
                () => User.current.hasInstallBonus
            )
        ];
    }

    renderItem = (item, index) => {
        const { icon, title, description, valueFn, action, extraClass, buttonItem } = item;
        const done = valueFn();
        return (
            <div key={title}
                onClick={done ? null : action}
                className={css('onboarding-to-do', { 'done-first': done && index === 0, done, clickable: !done && !!action })}>
                <div className="flex-row">
                    <FontIcon value={done ? 'check' : icon} />
                    <div className="flex-col">
                        <div className={`title ${extraClass}`}>
                            {title}
                            {buttonItem}
                        </div>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { currentOnboardingBonus, maximumOnboardingBonus } = User.current;
        return (
            <div className="onboarding">
                <div className="onboarding-content">
                    <div className="display-1">{t('title_onboarding1')}</div>
                    <div className="title">{t('title_onboarding2')}</div>
                    <p>{t('title_earned', { current: currentOnboardingBonus, max: maximumOnboardingBonus })}</p>
                    <div className="onboarding-to-dos">
                        {this.items.filter(item => !item.valueFn()).map(this.renderItem)}
                        {this.items.filter(item => item.valueFn()).map(this.renderItem)}
                    </div>
                    <div className="usage-cloud-container">
                        <UsageCloud />
                    </div>
                    <div className="onboarding-info">{t('title_onboardingLink')}</div>
                </div>
            </div>
        );
    }
}


module.exports = Onboarding;
