import React from 'react';

export default class Score extends React.Component {
    render() {
        let { text, value, color, keyboard } = this.props;
        return(
            <div className="box-score">
                <span style={{ color : color }} className="score">{ text } : { value }</span>
                <span>({keyboard})</span>
            </div>
        )
    }
} 