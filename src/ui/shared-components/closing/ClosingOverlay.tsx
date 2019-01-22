import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'peer-ui';
import BackgroundIllustration from '~/ui/shared-components/BackgroundIllustration';

@observer
export default class ClosingOverlay extends React.Component<{
    onDismiss?: () => void;
}> {
    render() {
        return (
            <div className="closing-overlay">
                <div className="left">
                    <h2 className="heading">Peerio will be closing</h2>
                    <p>
                        ICYMI. The Peerio service will be shut down on July 15th, 2019. You will be
                        able to use Peerio as usual until then, but we strongly recommend you begin
                        transitioning your files and important information out of Peerio (
                        <a href="https://support.peerio.com/hc/en-us/articles/360021688052">
                            learn how to export your files
                        </a>
                        ).
                    </p>
                    <p>We want to offer a sincere thank you for your trust and support.</p>
                    <p>
                        <a href="https://peerio.com/blog/posts/peerio-has-been-acquired-by-workjam-the-leading-digital-workplace-platform/">
                            Learn more
                        </a>
                    </p>
                    <div className="button-container">
                        <Button
                            label="Got it"
                            onClick={this.props.onDismiss}
                            testId="button_closingOverlayButton"
                        />
                    </div>
                </div>
                <div className="right">
                    <BackgroundIllustration
                        src="./static/img/illustrations/closing-small.svg"
                        height={264}
                        width={632}
                        distance={40}
                    />
                </div>
            </div>
        );
    }
}
