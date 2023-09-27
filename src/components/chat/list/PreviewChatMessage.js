import PropTypes from 'prop-types';
import { FaCheck, FaCircle } from 'react-icons/fa';
import doubleCheckmark from '@assets/images/double-checkmark.png';

const PreviewChatMessage = ({ data, profile }) => {

  return (
    <div className="conversation-message">
      <span>{data.body}</span>
      {!data.isRead ? (
        <>
          {data.receiverUsername === profile?.username ? (
            // <FaCircle className="icon" />
            <>___Tin moi</>
          ) : (
            // <FaCheck className="icon not-read" />
            <>____Da nhan</>
          )}
        </>
      ) : (
      <></>
      )}
    </div>
  );
};

PreviewChatMessage.propTypes = {
  data: PropTypes.object,
  profile: PropTypes.object
};

export default PreviewChatMessage;
