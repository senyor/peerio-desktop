import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';
import { MaterialIcon } from 'peer-ui';
import UsageCloud from '~/ui/shared-components/UsageCloud';
import { User, t } from 'peerio-icebear';
import T from '~/ui/shared-components/T';

interface OnboardingItem {
    icon: string;
    title: React.ReactChild;
    description: string;
    descriptionFinished: string;
    valueFn: () => boolean;
    action?: () => void;
    extraClass?: string;
    buttonItem?: JSX.Element;
}

@observer
export default class Onboarding extends React.Component {
    @observable waiting = false;

    get items(): OnboardingItem[] {
        const { currentInvitedPeopleBonus, maxInvitedPeopleBonus } = User.current;
        return [
            {
                icon: 'mail',
                title: t('title_onboardingConfirmEmail'),
                description: t('title_onboardingConfirmEmailContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasConfirmedEmailBonus,
                action: () => window.router.push('/app/settings/profile')
            },
            {
                icon: 'settings',
                title: t('title_onboardingAvatar'),
                description: t('title_onboardingAvatarContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasAvatarUploadedBonus,
                action: () => window.router.push('/app/settings/profile')
            },
            {
                icon: 'file_download',
                title: t('title_onboardingAccountKey'),
                description: t('title_onboardingAccountKeyContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasAccountKeyBackedUpBonus,
                action: () => window.router.push('/app/settings/security')
            },
            {
                icon: 'forum',
                title: t('title_onboardingCreateARoom'),
                description: t('title_onboardingCreateARoomContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasCreatedRoomBonus,
                action: () => window.router.push('/app/chats/new-channel')
            },
            {
                icon: 'person_add',
                title: t('title_onboardingInvitePeople', {
                    current: currentInvitedPeopleBonus,
                    max: maxInvitedPeopleBonus
                }),
                description: t('title_onboardingInvitePeopleContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '250' }),
                valueFn: () => currentInvitedPeopleBonus >= maxInvitedPeopleBonus,
                action: () => window.router.push('/app/contacts')
            },
            {
                icon: 'phonelink_setup',
                title: t('title_onboardingTSV'),
                description: t('title_onboardingTSVContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasTwoFABonus,
                action: () => window.router.push('/app/settings/security')
            },
            {
                icon: 'phonelink_setup',
                title: <T k="title_onboardingInstallMobileApp" />,
                description: t('title_onboardingInstallMobileAppContent'),
                descriptionFinished: t('title_onboardingStorageUnlocked', { amount: '100' }),
                valueFn: () => User.current.hasInstallBonus
            }
        ];
    }

    renderItem = (item: OnboardingItem, index: number) => {
        const {
            icon,
            title,
            description,
            descriptionFinished,
            valueFn,
            action,
            extraClass,
            buttonItem
        } = item;
        const done = valueFn();
        return (
            <div
                key={description}
                onClick={done ? null : action}
                className={css('onboarding-to-do', {
                    'done-first': done && index === 0,
                    done,
                    clickable: !done && !!action
                })}
            >
                <div className="done-container">
                    <MaterialIcon icon={done ? 'check' : icon} />
                    <div className="extraclass-container">
                        <div className={`title ${extraClass}`}>
                            {title}
                            {buttonItem}
                        </div>
                        <p>{done ? descriptionFinished : description}</p>
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
                    <p>
                        {t('title_earned', {
                            current: currentOnboardingBonus,
                            max: maximumOnboardingBonus
                        })}
                    </p>
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
