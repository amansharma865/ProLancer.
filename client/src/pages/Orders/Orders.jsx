import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosFetch } from "../../utils";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import { Loader } from '../../components';
import "./Orders.scss";

const Orders = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axiosFetch
        .get(`/orders`)
        .then(({ data }) => {
          return data;
        })
        .catch(({ response }) => {
          console.log(response.data);
        }),
  });

  const handleContact = async (order) => {
    const sellerID = order.sellerID.hasOwnProperty("_id")
      ? order.sellerID._id
      : order.sellerID;
    const buyerID = order.buyerID.hasOwnProperty("_id")
      ? order.buyerID._id
      : order.buyerID;

    axiosFetch
      .get(`/conversations/single/${sellerID}/${buyerID}`)
      .then(({ data }) => {
        navigate(`/message/${data.conversationID}`);
      })
      .catch(async ({ response }) => {
        if (response.status === 404) {
          const { data } = await axiosFetch.post("/conversations", {
            to: user.isSeller ? buyerID : sellerID,
            from: user.isSeller ? sellerID : buyerID,
          });
          navigate(`/message/${data.conversationID}`);
        }
      });
  };

  return (
    <div className="orders">
      {isLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : error ? (
        <div className="container">
          <div className="error" style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#4a148c',
            background: '#f3e5f5',
            borderRadius: '12px' 
          }}>
            <h2 style={{ marginBottom: '10px' }}>Oops! Something went wrong</h2>
            <p>Please try again later</p>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>Your Orders</h1>
          </div>
          {data.length === 0 ? (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>When you make a purchase, it will appear here</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>{user.isSeller ? "Buyer" : "Seller"}</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img className="img" src={order.image} alt={order.title} />
                    </td>
                    <td>
                      <span 
                        className="username"
                        title={user.isSeller ? "View Buyer Profile" : "View Seller Profile"}
                      >
                        {user.isSeller
                          ? order.buyerID.username
                          : order.sellerID.username}
                      </span>
                    </td>
                    <td title={order.title}>{order.title.slice(0, 30)}{order.title.length > 30 ? "..." : ""}</td>
                    <td>
                      <span title="Order Amount">
                        {order.price.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </td>
                    <td>
                      <img
                        className="messagebox"
                        src="./media/message.png"
                        alt="message"
                        onClick={() => handleContact(order)}
                        title="Contact User"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
