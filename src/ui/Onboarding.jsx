const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');


@observer
class Onboarding extends React.Component {
    @observable waiting = false;


    render() {
        return (
            <div className="onboarding">
                <div className="onboarding-content">
                    <div className="display-1">Thanks for joining Peerio!</div>
                    <div className="title">Get more free storage by completing these tasks!</div>
                    <p>200mb of 1000mb earned</p>

                    <div className="onboarding-to-dos">
                        <div className="onboarding-to-do">
                            <div className="flex-row">
                                <FontIcon value="mail" />
                                <div className="flex-col">
                                    <div className="title">Confirm your email</div>
                                    <p>Get new copy for this and encourage users to do this task</p>
                                </div>
                            </div>
                        </div>

                        <div className="onboarding-to-do">
                            <div className="flex-row">
                                <FontIcon value="forum" />
                                <div className="flex-col">
                                    <div className="title">Create a room <div className="chat-item-add-icon" /></div>
                                    <p>How much is this worth? This needs new copy.</p>
                                </div>
                            </div>
                        </div>

                        <div className="onboarding-to-do">
                            <div className="flex-row">
                                <FontIcon value="person_add" />
                                <div className="flex-col">
                                    <div className="title">Inviite friends to join Peerio</div>
                                    <p>Earn 50MB storage per friend. Up to 5 friends.</p>
                                </div>
                            </div>
                        </div>

                        <div className="onboarding-to-do">
                            <div className="flex-row">
                                <FontIcon value="phonelink_setup" />
                                <div className="flex-col">
                                    <div className="title">Enable Two-Step Verification</div>
                                    <p>Earn 100MB storage while increasing your security.</p>
                                </div>
                            </div>
                        </div>

                        <div className="onboarding-to-do">
                            <div className="flex-row">
                                <FontIcon value="phonelink_setup" />
                                <div className="flex-col">
                                    <div className="title">Install mobile app. (<a href="ios app">iOS</a> , <a href="android app">Android</a>)</div>
                                    <p>Earn 100MB storage and access to Peerio while on the go.</p>
                                </div>
                            </div>
                        </div>

                        <div className="onboarding-to-do done">
                            <div className="flex-row">
                                <FontIcon value="check" />
                                <div className="flex-col">
                                    <div className="title">Install mobile app. (<a href="ios app">iOS</a> , <a href="android app">Android</a>)</div>
                                    <p>Earn 100MB storage and access to Peerio while on the go.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TODO Add cloud icon with meter and usage info */}
                    <div className="onboarding-info">Click the cloud icon in the lower left to return to this list.</div>
                </div>
            </div>
        );
    }
}


module.exports = Onboarding;
