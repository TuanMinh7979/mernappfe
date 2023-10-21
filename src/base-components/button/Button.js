import React from 'react'
import PropTypes from 'prop-types'
const Button = (props) => {
    const { label, className, disabled, handleClick } = props
    return (
        <>
            <button className={`${className} ${disabled}`}
                onClick={handleClick}
                disabled={disabled}
            >
                {label}</button>
        </>
    )
}

Button.propTypes = {
    label: PropTypes.any.isRequired,
    className: PropTypes.string,
    handleClick: PropTypes.func,
    disabled: PropTypes.bool
}

export default Button