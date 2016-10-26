const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Avatar, Button, FontIcon, List, ListItem, ListSubHeader, ListDivider, ListCheckbox } = require('react-toolbox');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const css = require('classnames');


class Messages extends Component {

    render() {
        return (
            <Layout>
                {/* TODO: extract app-nav to own view? maybe App.jsx? */}
                <div className="app-nav">
                    <Avatar>
                        <img src="https://placeimg.com/80/80/animals" alt="avatar" />
                    </Avatar>
                    <div className="app-menu">
                        <div className="menu-item active">
                            <i className="material-icons">forum</i>
                        </div>
                        <div className="menu-item">
                            <i className="material-icons">folder</i>
                        </div>

                        <div className="menu-item settings">
                            <i className="material-icons">settings</i>
                        </div>
                    </div>
                </div>
                <Panel>
                    <div className="messages" >
                        <div className="message-list">
                            {/* Not sure that we should use the react-toolbox list items.
                                the ones we have are more custom than what these seem to allow. */}
                            <List>
                                <ListSubHeader caption="Direct messages" />
                                <ListItem caption="Alice" className="online active" />
                                <ListItem caption="Albert" />
                                <ListItem caption="Bob" />
                                <ListItem caption="Jeff" />
                                <ListItem caption="Steve" />
                            </List>
                        </div>
                        <div className="message-view">
                            <div className="message-toolbar">
                                <div className="title">Alice</div>
                            </div>
                            <div className="message">
                                <Avatar>
                                    <img src="https://placeimg.com/80/80/animals" alt="avatar" />
                                </Avatar>
                                <div className="message-content">
                                    <div className="meta-data">
                                        <div className="user">Bob</div>
                                        <div className="timestamp">8:29 AM</div>
                                    </div>
                                    <p> Bacon ipsum dolor amet bresaola shankle spare ribs, doner t-bone ribeye sausage pancetta turducken swine landjaeger short ribs tenderloin. Venison boudin turducken salami. Pork belly hamburger cupim kielbasa rump sirloin meatball. Cupim tongue capicola, ham hock tenderloin turkey picanha shoulder ball tip chuck cow pork chop. Andouille boudin chuck frankfurter. Tail alcatra shoulder flank cupim tri-tip pork belly sirloin pork loin cow.

T-bone chicken meatloaf jowl strip steak beef ribs burgdoggen tri-tip shoulder turkey landjaeger bresaola fatback. Chicken meatball shank tail. Pork loin kevin alcatra, picanha turducken shank capicola hamburger meatloaf jowl swine prosciutto fatback. Kevin shoulder kielbasa, hamburger fatback bacon ribeye. Tenderloin meatloaf sirloin, pancetta strip steak shankle ground round frankfurter beef ribs.

Jowl boudin tri-tip, tenderloin pork loin ground round ham chicken prosciutto. Ham hock venison meatball corned beef leberkas cupim jerky tri-tip bacon short ribs meatloaf ball tip cow spare ribs picanha. Brisket jowl capicola, sausage frankfurter sirloin short loin alcatra pig fatback meatball. Doner short loin strip steak ribeye capicola alcatra ball tip beef ribs meatball ham hock ham. Drumstick tail frankfurter ball tip. Rump drumstick tri-tip shankle pork belly ham. Sirloin cow meatloaf, filet mignon kevin venison ground round pork loin.

Turducken leberkas tenderloin, pork chop kielbasa turkey tail cow spare ribs swine jowl short ribs rump bacon chicken. Ground round porchetta kielbasa pancetta. Frankfurter sirloin turkey, tenderloin spare ribs leberkas short ribs. Venison sausage strip steak, pork loin kielbasa cupim beef ribs doner jowl shankle ribeye pork. Pork loin capicola bacon shankle hamburger salami, cupim sirloin rump biltong jerky pig.

Tail biltong cow, cupim short loin ball tip ribeye frankfurter t-bone flank kielbasa meatball. Tail cow brisket pork belly flank chicken rump ground round pancetta spare ribs. Brisket corned beef chuck, tail fatback shoulder filet mignon turkey kielbasa venison shankle biltong jerky tri-tip. Brisket corned beef rump tongue short ribs. Flank shankle picanha burgdoggen turducken, corned beef porchetta salami shoulder shank. Porchetta t-bone bresaola pancetta swine strip steak. </p>
                                </div>

                            </div>
                            <div className="message-input">
                                <FontIcon value="add_circle_outline" />
                                <input />
                            </div>
                        </div>
                    </div>
                </Panel>
            </Layout>
        );
    }
}

module.exports = Messages;
