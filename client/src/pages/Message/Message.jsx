import toast from 'react-hot-toast';
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import { axiosFetch } from '../../utils';
import { Loader } from '../../components';
import "./Message.scss";

const Message = () => {
  const user = useRecoilValue(userState);
  const { conversationID } = useParams();
  const messagesBoxRef = useRef(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ['messages'],
    queryFn: () =>
      axiosFetch.get(`/messages/${conversationID}`)
        .then(({ data }) => {
          return data;
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (message) => 
      axiosFetch.post('/messages', message)
    ,
    onSuccess: () =>
      queryClient.invalidateQueries(['messages'])
  })

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    
    mutation.mutate({
      conversationID,
      description: event.target[0].value
    });

    event.target.reset();
  }

  // Add this effect to scroll to bottom when new messages arrive
  useEffect(() => {
    if (data && data.length > 0 && messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link"> Back to Messages</Link>
        </span>
        {
          isLoading
            ? <div className="loader"> <Loader /> </div>
            : error
              ? <div className="error" style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#4a148c',
                  background: '#f3e5f5',
                  borderRadius: '12px'
                }}>
                  <h2 style={{ marginBottom: '10px' }}>Oops! Something went wrong</h2>
                  <p>Please try again later</p>
                </div>
              : <>
                <div className="messages" ref={messagesBoxRef}>
                  {
                    data.map((message) => (
                      <div className={message.userID._id === user._id ? 'owner item' : 'item'} key={message._id}>
                        <img
                          src={message.userID.image || '/media/noavatar.png'}
                          alt=""
                        />
                        <p>{message.description}</p>
                      </div>
                    ))
                  }
                </div>
                <form className="write" onSubmit={handleMessageSubmit}>
                  <textarea 
                    placeholder="Type your message here..."
                    rows="3"
                  />
                  <button type="submit">Send Message</button>
                </form>
              </>
        }
      </div>
    </div>
  );
};

export default Message;