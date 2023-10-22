import PropTypes from 'prop-types';


const PreviewChatMessage = ({ data, profile }) => {

  return (
    <div className="conversation-message">
      <span>{data.body}</span>

      {!data.isRead ? (
        <>
          {data.receiverUsername === profile?.username ? (
          
            <span className='icon'>New</span>
          ) : (
           
            <span className='icon'>Recieved</span>
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
