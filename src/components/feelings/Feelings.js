import React from 'react'
import { useSelector } from 'react-redux'
import { feelingsList } from '@services/utils/static.data'
import "./Feelings.scss"
import { useDispatch } from 'react-redux'
import { updModalFeeling, updModalIsFeelingOpen } from '@redux/reducers/modal/modal.reducer'
const Feelings = () => {
    const { isFeelingOpen } = useSelector((state) => state.modal)
    const dispatch = useDispatch();

    const selectFeeling = (feeling) => {
        // ! TO REDUX 
        dispatch(updModalFeeling({ feeling }));
        dispatch(updModalIsFeelingOpen(!isFeelingOpen));
    };

    return (
        <div className="feelings-container">
            <div className="feelings-container-picker">
                <p>Feelings</p>
                <hr />
                <ul className="feelings-container-picker-list">
                    {feelingsList.map((feeling) => (
                        <li
                            data-testid="feelings-item"
                            className="feelings-container-picker-list-item"
                            key={feeling.index}
                            onClick={() => selectFeeling(feeling)}
                        >
                            <img src={feeling.image} alt="" /> <span>{feeling.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Feelings