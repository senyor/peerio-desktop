const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { FontIcon } = require('~/react-toolbox');
const UsageCloud = require('~/ui/shared-components/UsageCloud');
const { User } = require('~/icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

function createOnboardingItem(icon, title, description, valueFn, action) {
    return { icon, title, description, valueFn, action };
}

// TODO: move to icebear
function getMaxInvitedPeople() { return 5; }

// TODO: move to icebear
function getCurrentInvitedPeople() {
    try {
        const { limit } = User.current.quota.quotas.userInviteOnboardingBonus.bonus.file;
        const bonusPerUser = 100 * 1024 * 1024 - 1;
        return Math.floor(limit / bonusPerUser);
    } catch (e) {
        console.error(e);
    }
    return 0;
}

@observer
class Onboarding extends React.Component {
    @observable waiting = false;

    get items() {
        const current = getCurrentInvitedPeople();
        const max = getMaxInvitedPeople();

        return [
            createOnboardingItem(
                'mail',
                t('title_onboardingConfirmEmail'),
                t('title_onboardingConfirmEmailContent'),
                () => User.current.hasConfirmedEmailBonus,
                () => window.router.push('/app/settings/profile')
            ),
            createOnboardingItem(
                'mail',
                t('title_onboardingConfirmEmail'),
                t('title_onboardingConfirmEmailContent'),
                () => User.current.hasConfirmedEmailBonus,
                () => window.router.push('/app/settings/profile')
            ),
            createOnboardingItem(
                'forum',
                t('title_onboardingCreateARoom'),
                t('title_onboardingCreateARoomContent'),
                () => User.current.hasCreatedRoomBonus,
                () => window.router.push('/app/new-channel')
            ),
            createOnboardingItem(
                'person_add',
                t('title_onboardingInvitePeople', { current, max }),
                t('title_onboardingInvitePeopleContent'),
                () => current >= max,
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
                    <div className="display-1">{t('title_onboarding1')}</div>
                    <div className="title">{t('title_onboarding2')}</div>
                    {/* I am hiding this because confirming email does not give a bonus right now */}
                    {/* <p>200mb of 1000mb earned</p> */}
                    <div className="onboarding-to-dos">
                        {this.items.filter(item => !item.valueFn()).map(this.renderItem)}
                        {this.items.filter(item => item.valueFn()).map(this.renderItem)}
                    </div>
                    <div style={{ textAlign: 'center', margin: 'auto' }}>
                        <UsageCloud />
                    </div>
                    <div className="onboarding-info">{t('title_onboardingLink')}</div>
                </div>
            </div>
        );
    }
}


module.exports = Onboarding;
