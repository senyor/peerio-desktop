const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem } = require('~/react-toolbox');
const { chatStore, fileStore } = require('~/icebear');
const { t } = require('peerio-translator');
const { getAttributeInParentChain } = require('~/helpers/dom');
const T = require('~/ui/shared-components/T');
const SideBarSection = require('./SideBarSection');

@observer
class FilesSection extends React.Component {
    render() {
        const chat = chatStore.activeChat;
        if (!chat || !chat.recentFiles || !chat.recentFiles.length) return null;

        return (
            <SideBarSection title={t('title_recentFiles')}>
                <List>
                    {chat.recentFiles.map(id => {
                        const file = fileStore.getById(id);
                        if (!file) return null;
                        return <ListItem key={id} caption={file.name} />;
                    })}
                </List>
            </SideBarSection>
        );
    }
}

module.exports = FilesSection;
