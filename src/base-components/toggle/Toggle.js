import PropTypes from 'prop-types';
import { useState } from 'react';
import './Toggle.scss';
import { useEffect } from 'react';

const Toggle = ({ toggle, onClick }) => {

    return (
        <label className="switch" htmlFor="switch" data-testid="toggle">
            <input
                id="switch"
                type="checkbox"
                checked={toggle}

            />
            <span onClick={onClick} className="slider round"></span>
        </label>
    );
};

Toggle.propTypes = {
    toggle: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Toggle;
