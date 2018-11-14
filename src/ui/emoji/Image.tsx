import React from 'react';
import { observer } from 'mobx-react';
import css from 'classnames';

import { emojiByCanonicalShortname } from '~/helpers/chat/emoji';

interface EmojiImageProps {
    emoji: string;
    className?: string;
    size?: 'large';
}

/**
 * This component returns an individual image file of an emoji, rather than
 * using the spritesheets.
 *
 * Note: if you set the `size` prop to `large`, it will use the 2x version of
 * the image. The 2x files are not all in the static folder! Because of how
 * infrequently we use this component, we just copy those in individually as we
 * use them. So, if you need a 2x version of an emoji that isn't in the folder
 * (static/emoji/png/2x/), you need to copy it from
 * node_modules/emojione-assets/
 */
@observer
export default class EmojiImage extends React.Component<EmojiImageProps> {
    render() {
        return (
            <img
                className={css('emoji-image', this.props.size, this.props.className)}
                title={this.props.emoji}
                src={
                    this.props.size === 'large'
                        ? emojiByCanonicalShortname[`:${this.props.emoji}:`].filename.replace(
                              '/png/',
                              '/png/2x/'
                          )
                        : emojiByCanonicalShortname[`:${this.props.emoji}:`].filename
                }
            />
        );
    }
}
