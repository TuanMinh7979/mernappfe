import PropTypes from 'prop-types';
import './Dialog.scss';
import Button from '@components/button/Button';

const ThreeButtonDialog = ({ title, firstButtonText, secondButtonText, firstBtnHandler, secondBtnHandler
    , thirdButtonText, thirdBtnHandler
}) => {
    return (
        <div className="dialog-container" data-testid="dialog-container">
            <div className="dialog">
                <h4>{title}</h4>
                <div className="btn-container">
                    <Button className="btn button cancel-btn" label={thirdButtonText} handleClick={thirdBtnHandler} />
                    <Button className="btn button confirm-btn" label={secondButtonText} handleClick={secondBtnHandler} />
                    <Button className="btn button confirm-btn" label={firstButtonText} handleClick={firstBtnHandler} />

                </div>
            </div>
        </div>
    );
};

ThreeButtonDialog.propTypes = {
    title: PropTypes.string,
    firstButtonText: PropTypes.string,
    secondButtonText: PropTypes.string,
    firstBtnHandler: PropTypes.func,
    secondBtnHandler: PropTypes.func,
    thirdButtonText: PropTypes.string,
    thirdBtnHandler: PropTypes.func
};

export default ThreeButtonDialog;
