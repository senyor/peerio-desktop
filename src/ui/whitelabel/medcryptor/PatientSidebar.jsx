const React = require('react');
const { computed } = require('mobx');
const { observer } = require('mobx-react');

const routerStore = require('~/stores/router-store');

const css = require('classnames');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const FlipMove = require('react-flip-move');
const { Button, List, ListItem } = require('peer-ui');
// const AvatarWithPopup = require('~/ui/contact/components/AvatarWithPopup');
const PlusIcon = require('~/ui/shared-components/PlusIcon');
const { chatStore, chatInviteStore } = require('peerio-icebear');

@observer
class PatientSidebar extends React.Component {
    get space() { console.log(chatStore.spaces[0]); return chatStore.spaces[0]; }
    get isNewInternalRoom() { return routerStore.currentRoute === routerStore.ROUTES.newInternalRoom; }
    get isNewPatientRoom() { return routerStore.currentRoute === routerStore.ROUTES.newPatientRoom; }

    goBack() {
        routerStore.navigateTo(routerStore.ROUTES.chats);
    }

    newInternalRoom() {
        console.log('new internal room');
    }

    newPatientRoom() {
        console.log('new patient room');
    }

    activateChat() {
        console.log('activate chat');
    }

    @computed get internalRoomMap() {
        // placeholder internal rooms objectArray
        const rooms = [{ id: 'id', name: 'general', isNew: true }];

        return rooms.map(r => {
            let rightContent = null;
            if (r.isNew) {
                rightContent = <T k="title_new" className="badge-new" />;
            } else if ((!r.active || r.newMessagesMarkerPos) && r.unreadCount > 0) {
                rightContent = <div className="notification">{r.unreadCount < 100 ? r.unreadCount : '99+'}</div>;
            }

            return (
                <ListItem
                    data-chatid={r.id}
                    key={r.id || r.tempId}
                    className={
                        css('room-item',
                            {
                                active: r.active,
                                unread: r.unreadCount > 0
                            }
                        )
                    }
                    caption={`# ${r.name}`}
                    onClick={this.activateChat}
                    rightContent={rightContent}
                />
            );
        });
    }

    @computed get patientRoomMap() {
        // placeholder patient rooms objectArray
        const patients = [{
            id: 'id',
            name: 'Jennifer Fredrikson',
            otherParticipants: [],
            isEmpty: false,
            isNew: true
        }];

        return patients.map(c => {
            let rightContent = null;
            // let contact = c.otherParticipants.length > 0
            //     ? c.otherParticipants[0]
            //     : c.allParticipants[0];
            if (c.isNew) {
                rightContent = <T k="title_new" className="badge-new" />;
                // contact = c.contact;
            } else if ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0) {
                rightContent = <div className="notification">{c.unreadCount < 100 ? c.unreadCount : '99+'}</div>;
            }
            return (
                <ListItem
                    data-chatid={c.id}
                    key={c.id || c.tempId}
                    className={css(
                        'dm-item',
                        {
                            active: c.active,
                            unread: c.unreadCount > 0,
                            pinned: c.isFavorite
                        }
                    )}
                    leftContent={<div className="new-dm-avatar material-icons">
                        {c.isEmpty
                            ? 'help_outline'
                            : 'people'
                        }
                    </div>}

                    onClick={this.activateChat}
                    rightContent={rightContent}
                >
                    {c.isEmpty
                        ? <T k="title_noParticipants" />
                        : c.name
                    }
                </ListItem>
            );
        });
    }


    render() {
        return (
            <div className="feature-navigation-list messages-list patient-sidebar">
                <div className="list">
                    <div className="navigate-back"><Button onClick={this.goBack} icon="arrow_back" /></div>
                    <div className="patient-name">{this.space.spaceName}</div>

                    <List clickable>
                        <div>
                            <PlusIcon onClick={this.newInternalRoom} label={t('mcr_title_internalRooms')} />
                            {/* <Tooltip text={t('title_addDirectMessage')} position="right" /> */}
                        </div>
                        {this.isNewInternalRoom &&
                            <ListItem key="new chat"
                                className={css(
                                    'room-item', 'new-room-list-entry',
                                    { active: this.isNewInternalRoom }
                                )}
                                leftContent={<div className="new-dm-avatar material-icons">help_outline</div>}
                            >
                                <i>{t('title_newDirectMessage')}</i>
                            </ListItem>
                        }
                        <FlipMove duration={200} easing="ease-in-out">
                            {this.internalRoomMap}
                        </FlipMove>
                    </List>

                    <List clickable>
                        <div>
                            <PlusIcon onClick={this.newPatientRoom} label={t('mcr_title_patientRooms')} />
                            {/* <Tooltip text={t('title_addDirectMessage')} position="right" /> */}
                        </div>
                        {this.isNewPatientRoom &&
                            <ListItem key="new chat"
                                className={css(
                                    'dm-item', 'new-dm-list-entry',
                                    { active: this.isNewPatientRoom }
                                )}
                                leftContent={<div className="new-dm-avatar material-icons">help_outline</div>}
                            >
                                <i>{t('title_newDirectMessage')}</i>
                            </ListItem>
                        }
                        <FlipMove duration={200} easing="ease-in-out">
                            {this.patientRoomMap}
                        </FlipMove>
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = PatientSidebar;
