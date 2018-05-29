const React = require('react');
const { observer } = require('mobx-react');

const routerStore = require('~/stores/router-store');

const css = require('classnames');
const { t } = require('peerio-translator');
const FlipMove = require('react-flip-move');
const { Button, List, ListItem, Tooltip } = require('~/peer-ui');
const PlusIcon = require('~/ui/shared-components/PlusIcon');

@observer
class PatientSidebar extends React.Component {
    goBack() {
        routerStore.navigateTo(routerStore.ROUTES.chats);
    }

    render() {
        return (
            <div className="feature-navigation-list patient-sidebar">
                <div className="list">
                    <div className="navigation"><Button onClick={this.goBack} icon="arrow_back" /></div>
                    <div className="patient-name">Fredrikson, Jennifer</div>

                    {/* from ChatList <List clickable>
                        <div>
                            <PlusIcon onClick={this.newInternalRoom} label={t('title_directMessages')} />
                            <Tooltip text={t('title_addDirectMessage')} position="right" />
                        </div>
                        {routerStore.isNewChat &&
                            <ListItem key="new chat"
                                className={css(
                                    'dm-item', 'new-dm-list-entry', { active: routerStore.isNewChat }
                                )}
                                leftContent={<div className="new-dm-avatar material-icons">help_outline</div>}
                            >
                                <i>{t('title_newDirectMessage')}</i>
                                <Tooltip text={t('title_newDirectMessage')}
                                    position="right" />
                            </ListItem>
                        }
                        <FlipMove duration={200} easing="ease-in-out">
                            {this.dmMap}
                        </FlipMove>
                    </List> */}
                </div>
            </div>
        );
    }
}


module.exports = PatientSidebar;
