import React from 'react';
import { shallow, mount, render } from 'enzyme';

import MessageText from '~/ui/chat/components/MessageText';

const onClickContact = () => {};

function makeRichTextMessage(content: any[]): any {
    return {
        richText: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content
                }
            ]
        }
    };
}

describe('<MessageText>', () => {
    it('should match the snapshot for all fixtures', () => {
        ['1', '2', '3', '4', '5']
            .map(fn => require(`./message-text-fixtures/${fn}.json`))
            .forEach(richText => {
                expect(
                    render(
                        <MessageText
                            message={{ richText } as any}
                            onClickContact={onClickContact}
                            currentUsername={'testuser'}
                        />
                    )
                ).toMatchSnapshot();
            });
    });

    it('should render nothing if passed an empty message', () => {
        expect(
            shallow(
                <MessageText
                    message={null}
                    onClickContact={onClickContact}
                    currentUsername={'testuser'}
                />
            )
        ).toBeEmptyRender();
    });

    it('should contain a highlight if the message contains a mention of the current user', () => {
        const username = 'testuser';

        const message = makeRichTextMessage([
            {
                type: 'mention',
                attrs: {
                    username
                }
            }
        ]);

        expect(
            mount(
                <MessageText
                    message={message}
                    onClickContact={onClickContact}
                    currentUsername={username}
                />
            )
        ).toContainMatchingElement('.self');
    });

    it('should render jumboji if the message contains only {1,3} emoji', () => {
        const emojiNode = {
            type: 'emoji',
            attrs: {
                shortname: ':apple:'
            }
        };

        [[emojiNode], [emojiNode, emojiNode], [emojiNode, emojiNode, emojiNode]]
            .map(makeRichTextMessage)
            .forEach(message => {
                expect(
                    mount(
                        <MessageText
                            message={message}
                            onClickContact={onClickContact}
                            currentUsername={'testUser'}
                        />
                    )
                ).toContainMatchingElement('.jumboji');
            });
    });

    it('should not render jumboji if the message contains text or more than three emoji', () => {
        const emojiNode = { type: 'emoji', attrs: { shortname: ':apple:' } };

        [
            [{ type: 'text', text: 'just text' }],
            [{ type: 'text', text: 'text and emoji ' }, emojiNode],
            [emojiNode, emojiNode, emojiNode, emojiNode]
        ]
            .map(makeRichTextMessage)
            .forEach(message => {
                expect(
                    mount(
                        <MessageText
                            message={message}
                            onClickContact={onClickContact}
                            currentUsername={'testUser'}
                        />
                    )
                ).not.toContainMatchingElement('.jumboji');
            });
    });

    it('should process legacy messages if no rich text is provided', () => {
        jest.mock('~/helpers/chat/legacy-process-message-for-display', () => ({
            processMessageForDisplay: jest.fn(msg => ({ __html: `<div>${msg.text}</div>` }))
        }));

        const message = {
            text: 'a legacy message.'
        };

        expect(
            render(
                <MessageText
                    message={message as any}
                    onClickContact={onClickContact}
                    currentUsername={'testUser'}
                />
            ).text()
        ).toContain(message.text);

        expect(
            require('~/helpers/chat/legacy-process-message-for-display').processMessageForDisplay
        ).toHaveBeenCalledTimes(1);
    });
});
