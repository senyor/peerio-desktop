const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem, IconMenu, MenuItem } = require('~/react-toolbox');
const { chatStore, fileStore } = require('~/icebear');
const { t } = require('peerio-translator');
const { getAttributeInParentChain } = require('~/helpers/dom');
const SideBarSection = require('./SideBarSection');
const { downloadFile } = require('~/helpers/file');

@observer
class FilesSection extends React.Component {
    share(ev) {
        ev.stopPropagation();
        const fileId = getAttributeInParentChain(ev.target, 'data-fileid');
        const file = fileStore.getById(fileId);
        if (!file) return;
        fileStore.clearSelection();
        file.selected = true;
        window.router.push('/app/sharefiles');
    }

    download(ev) {
        ev.stopPropagation();
        const fileId = getAttributeInParentChain(ev.target, 'data-fileid');
        const file = fileStore.getById(fileId);
        if (!file) return;
        downloadFile(file);
    }

    stopPropagation(ev) {
        ev.stopPropagation();
    }
    render() {
        const chat = chatStore.activeChat;
        if (!chat || !chat.recentFiles || !chat.recentFiles.length) return null;

        const menu = (<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple
            onClick={this.stopPropagation}>
            <MenuItem caption={t('title_download')} icon="file_download" onClick={this.download} />
            <MenuItem caption={t('button_share')} icon="reply" onClick={this.share} />
        </IconMenu>);

        return (
            <SideBarSection title={t('title_recentFiles')} onToggle={this.props.onToggle} open={this.props.open}>
                <List>
                    {chat.recentFiles.map(id => {
                        const file = fileStore.getById(id);
                        if (!file) return null;
                        return (<span key={id} data-fileid={id}>
                            <ListItem caption={file.name} rightActions={[menu]} onClick={this.download} />
                        </span>);
                    })}
                </List>
            </SideBarSection>
        );
    }
}

module.exports = FilesSection;
