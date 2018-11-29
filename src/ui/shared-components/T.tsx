import React from 'react';
import { t, LocalizationStrings } from 'peerio-icebear';

interface TBaseProps {
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: React.CSSProperties;
}

type TProps<K extends keyof LocalizationStrings> = LocalizationStrings[K] extends () => any
    ? { k: K } & TBaseProps
    : LocalizationStrings[K] extends (params: infer U) => any
    ? { k: K; children: U } & TBaseProps
    : never;

/**
 * given a translation file:
 *
 * `"key": "some text <link>bla</> and a var {count}"`
 *
 * use the component like this:
 *
 * ```
   <T k="key">
       {{ count: 5, link: text => <a>{text}</a>}}
   </T>
   ```
 */
export default function T<K extends keyof LocalizationStrings>(props: TProps<K>): JSX.Element {
    const tag = props.tag || 'span';
    const properties = { className: props.className, style: props.style };

    const translation = (t as any)(props.k, (props as any).children);

    if (typeof translation === 'string') {
        return React.createElement(tag, properties, translation);
    }

    return React.createElement(tag, properties, ...translation);
}
