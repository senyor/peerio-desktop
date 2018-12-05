import React from 'react';
import { observer } from 'mobx-react';
import { Message } from 'peerio-icebear/dist/models';
import { chatSchema, Renderer } from '~/helpers/chat/prosemirror/chat-schema';
import { User } from 'peerio-icebear';

let legacyProcessMessageForDisplay: (msg: Message) => { __html: string };

interface MessageTextProps {
    /** icebear message */
    message: Message;

    /** handler of event when user clicks on contact */
    onClickContact: (ev: React.MouseEvent<Element>) => void;
}

@observer
export default class MessageText extends React.Component<MessageTextProps> {
    render() {
        const { message, onClickContact } = this.props;

        if (!message) return null;

        const richText = message.richText;
        if (
            richText &&
            typeof richText === 'object' &&
            // @ts-ignore needs icebear fixes
            richText.type === 'doc' &&
            // @ts-ignore needs icebear fixes
            richText.content
        ) {
            try {
                // Creating the ProseMirror node from the JSON may seem like an
                // added step/layer of indirection, but it lets us validate the
                // rich text payload and ensure it conforms to the schema.
                const proseMirrorNode = chatSchema.nodeFromJSON(richText);

                // Note that an error in the renderer component won't get caught
                // by this try-catch -- it's not actually invoked in this stack
                // frame.
                return (
                    <Renderer
                        fragment={proseMirrorNode.content}
                        onClickContact={onClickContact}
                        currentUser={User.current.username}
                    />
                );
            } catch (e) {
                console.warn(`Couldn't deserialize message rich text:`, e);
            }
        }

        if (typeof message.text !== 'string') {
            // HACK: React error boundaries only catch errors in children, so we
            // wrap this throw in a createElement.
            return React.createElement(() => {
                throw new Error("Can't render rich text and message has no plaintext!");
            });
        }

        // lazily load legacy message processing logic. the emojione file it
        // requires is pretty huge and slows startup, so we should only require
        // it if it's necessary.
        legacyProcessMessageForDisplay =
            legacyProcessMessageForDisplay ||
            require('~/helpers/chat/legacy-process-message-for-display').processMessageForDisplay;
        return (
            <p
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={legacyProcessMessageForDisplay(message)}
                className="selectable"
            />
        );
    }
}
