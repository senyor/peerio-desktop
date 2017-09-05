const React = require('react');
const { Component } = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { Input } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');


@observer class ConfirmKey extends Component {
    @observable confirmText = '';
    confirmTextSample = 'I have saved my account key';

    componentDidMount() {
        reaction(() => this.confirmText.toLocaleLowerCase() === this.confirmTextSample.toLocaleLowerCase(), v => {
            console.log(true);
            if (v) this.props.store.confirmedKeyBackup = true;
        });
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        return (
            <div className="flex-col">
                <div className="confirm-key">
                    <div className="safe" />
                    <div className="headline">{t('title_confirmHeadline')}</div>
                    {/* Got your keys? */}
                    <p>{t('title_confirmContent1')}</p>
                    {/* Only you have a copy of your Account Key. */}
                    <p>{t('title_confirmContent2')}</p>
                    {/* If you lose it, we cannot help you access your account. */}
                    <p>Confirm that you’ve saved your key by entering  “{this.confirmTextSample}” in the input below. </p>
                    {/* Hey Samvel, I'm not sure how to create a key for this. */}
                    <Input
                        onKeyPress={this.handleKeyPress}
                        value={this.confirmText} label="Have you saved your account key?" onChange={text => { this.confirmText = text; }} />
                </div>
            </div>
        );
    }
}

module.exports = ConfirmKey;
