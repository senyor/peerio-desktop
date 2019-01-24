import React from 'react';
import { observer } from 'mobx-react';

import { t } from 'peerio-icebear';
import css from 'classnames';
import { Button } from 'peer-ui';

interface BannerBaseProps {
    /** Determines the background color */
    theme?: 'error';
}

interface DefaultBannerProps extends BannerBaseProps {
    /**
     * If true, no icon and no action buttons.
     * Just a single line of content.
     */
    singleLine?: false;

    headerText?: string;
    mainText?: string;

    onDismiss?: () => void;

    /**
     * Action button at the right of the banner.
     * "Dismiss" is already built into Banner.
     */
    actionButton?: {
        label: string;
        url?: string;
        onClick?: () => void;
    };
}

interface SimpleBannerProps extends BannerBaseProps {
    /**
     * If true, no icon and no action buttons.
     * Just a single line of content.
     */
    singleLine: true;

    /** In single line Banner, main content can be any JSX */
    mainContent: JSX.Element;
}

type BannerProps = DefaultBannerProps | SimpleBannerProps;

@observer
export default class Banner extends React.Component<BannerProps> {
    get actionButtonRendered() {
        if (this.props.singleLine === true) return null;
        const { label, onClick, url } = this.props.actionButton;

        return (
            <div className="buttons">
                {this.props.onDismiss ? (
                    <Button
                        label={t('button_dismiss')}
                        onClick={this.props.onDismiss}
                        theme="no-hover"
                    />
                ) : null}
                {url ? (
                    <Button href={url} theme="no-hover">
                        {label}
                    </Button>
                ) : (
                    <Button label={label} onClick={onClick} theme="no-hover" />
                )}
            </div>
        );
    }

    render() {
        return (
            <div className={css('banner', this.props.theme)}>
                {this.props.singleLine === true ? (
                    <div className="single-line">{this.props.mainContent}</div>
                ) : (
                    <>
                        <div className="content">
                            <div className="icon-container">
                                <div className="icon">i</div>
                            </div>
                            <div className="text-content">
                                {this.props.headerText ? (
                                    <div className="header-text">{this.props.headerText}</div>
                                ) : null}
                                {this.props.mainText ? (
                                    <div className="main-text">{this.props.mainText}</div>
                                ) : null}
                            </div>
                        </div>
                        {this.actionButtonRendered}
                    </>
                )}
            </div>
        );
    }
}
