import { Link } from 'react-router-dom';
import './GigCard.scss';

const getSellerLevel = (level, completedOrders = 0) => {
  if (completedOrders >= 100) return "Top Rated Seller";
  if (completedOrders >= 50) return "Level 2 Seller";
  if (completedOrders >= 10) return "Level 1 Seller";
  return "New Seller";
}

const GigCard = (props) => {
    const { data } = props;
    const sellerLevel = getSellerLevel(data.userID.level, data.userID.completedOrders);

  return (
    <Link to={`/gig/${data._id}`} className="link">
      <div className="gigCard">
        <div className="image-container">
          <img src={data.cover} alt="" />
          <span className="category">{data.category}</span>
        </div>
        <div className="info">
          <div className="user-section">
            <div className="user">
              <img src={data.userID.image || './media/noavatar.png'} alt="" />
              <div className="user-info">
                <span className="username">{data.userID.username}</span>
                <span className={`level level-${
                  data.userID.completedOrders >= 100 ? 4 :
                  data.userID.completedOrders >= 50 ? 3 :
                  data.userID.completedOrders >= 10 ? 2 : 1
                }`}>
                  {sellerLevel}
                </span>
              </div>
            </div>
            <div className="rating">
              <div className="star">
                <img src="./media/star.png" alt="" />
                <span className="score">{Math.round(data.totalStars / data.starNumber) || 0}</span>
                <span className='totalStars'>({data.starNumber})</span>
              </div>
            </div>
          </div>
          <p className="title">{data.title}</p>
        </div>
        <hr />
        <div className="detail">
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              {data.price.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GigCard;