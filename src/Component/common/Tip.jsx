import React, {Component, PropTypes} from 'react';

/**
 * @export
 * @class Toast
 * @extends {Component}
 */
export class Toast extends Component {

    render() {
        let {content, display} = this.props;
        if(display=="toasts")display = "toast "+display;
        return (
            <div className={display} ref="toast">
                <div className = 'toast-out'><div className = 'toast-in'>{content}</div></div>
            </div>
        );
    }

    componentDidMount() {
        let self = this;
        this.refs.toast.addEventListener('webkitAnimationEnd', function(){
            self.props.callback('toast');
        }, false);
    }
}

/**
 * @export
 * @class Confirm
 * @extends {Component}
 */
export class Confirm extends Component {
    componentDidUpdate(){
        this.refs.content.innerHTML = this.props.content;
    }
    render() {
        let {title,content,leftText,rightText,display,leftMethod,rightMethod,rightClass=""} = this.props;
        
        return (
            <div className="confirm" ref="confirm" style={{display: display}}>
                <header>{title}</header>
                <div className="content" ref="content"></div>
                <div className="button">
                    <span onClick={leftMethod}>{leftText}</span>
                    {rightText?(<span onClick={rightMethod} className={rightClass} >{rightText}</span>):""}
                </div>
            </div>
        );
    }
}

/**
 * @export
 * @class AjaxTip
 * @extends {Component}
 */
export class AjaxTip extends Component {
    render() {
        let {display} = this.props;
        return (
            <div className="loadEffect" id="loadEffect" ref="load" style={{display: display}}>
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
        );
    }
}