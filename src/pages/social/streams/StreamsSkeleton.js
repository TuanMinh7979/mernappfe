import PostFormSkeleton from '@components/posts/post-form/PostFormSkeleton';
import '@pages/social/streams/Streams.scss';


const StreamsSkeleton = () => {
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post">
        <PostFormSkeleton/>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
       
            </div>
          ))}
        </div>
        <div className="streams-suggestions">
         
        </div>
      </div>
    </div>
  );
};

export default StreamsSkeleton;
