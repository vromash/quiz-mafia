import { PureComponent } from 'react';

import styles from '../../styles/CardButton.module.scss';

class CardButton extends PureComponent {
    render() {
        return (
            <div className={styles.card} >
                <button type="button" onClick={this.props.handleButtonClick}>
                    <h2 className={this.props.labelStyles}>{this.props.label}</h2>
                </button>
                {this.props.children}
            </div>
        );
    }
}

export default CardButton;
