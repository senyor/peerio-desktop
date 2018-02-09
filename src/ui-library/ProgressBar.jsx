const React = require('react');
const { observer } = require('mobx-react');

const css = require('classnames');

/*
    PROPS           type        description
    ----------------------------------------
    className       string
    mode            string      determinate (default), indeterminate
    type            string      linear (default), circular
    theme           string      multicolor, light, small

    value           int         (determinate) current progress value of the progress bar
    max             int         (determinate) max progress value of progress bar
    ----------------------------------------

    determinate + circular will not work (will default to indeterminate)
*/

@observer
class ProgressBar extends React.Component {
    render() {
        let style;
        if (this.props.mode === 'determinate') {
            style = { width: `${this.props.value / this.props.max * 100}%` };
        }

        return (
            /*
                Progress bar itself needs to be position:relative,
                so we need to put everything in a container div to be able to control positioning
            */
            <div className={css(
                'p-progress-bar',
                this.props.className,
                this.props.theme,
                { circular: this.props.type === 'circular' }
            )}>
                { this.props.type !== 'circular'
                    ? <div className="progress-bar">
                        <div
                            className={css(
                                this.props.type || 'linear',
                                this.props.mode || 'determinate',
                                this.props.theme
                            )}
                            style={style}
                        />
                    </div>
                    : <div className={css(
                        'progress-spinner',
                        this.props.theme
                    )}>
                        <svg className="circular">
                            <circle className="path" />
                        </svg>
                    </div>
                }
            </div>
        );
    }
}

module.exports = ProgressBar;
