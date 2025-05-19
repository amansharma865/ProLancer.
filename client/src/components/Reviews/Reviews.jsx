import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Review, Loader } from '..';
import { axiosFetch } from '../../utils';
import toast from 'react-hot-toast';
import './Reviews.scss';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const Reviews = ({ gigID }) => {
    const navigation = useNavigate();
    const queryClient = useQueryClient();
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['reviews'],
        queryFn: () =>
            axiosFetch.get(`/reviews/${gigID}`)
                .then(({ data }) => {
                    return data;
                })
                .catch(({ response }) => {
                    console.log(response.data);
                })
    });

    const mutation = useMutation({
        mutationFn: (review) =>
            axiosFetch.post('/reviews', review)
            .then(({data}) => {
                return data;
            })
            .catch(({ response: { data } }) => {
                if(data.message == 'jwt expired') {
                    navigation('/login');
                }
                toast.error(data.message);
            })
        ,
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews'])
        }
    })

    const handleReviewSubmit = (event) => {
        event.preventDefault();

        const description = event.target[0].value;
        const star = event.target[1].value;
        
        if(star && description) {
            mutation.mutate({ gigID, description, star });
            event.target.reset();
        }
    }

    return (
        <motion.div 
            className="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="reviews-header">
                <h2>Customer Reviews</h2>
                <div className="rating-summary">
                    <span className="total-reviews">{data?.length || 0} Reviews</span>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={16} />
                        ))}
                    </div>
                </div>
            </div>

            <motion.div 
                className="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <form 
                    className='addForm' 
                    onSubmit={handleReviewSubmit}
                >
                    <textarea 
                        placeholder='Share your experience with this service...'
                        required
                    />
                    <div className="review-actions">
                        <select required>
                            <option value="">Rate this service</option>
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Post Review
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            <div className="reviews-grid">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div>Error loading reviews</div>
                ) : data?.length === 0 ? (
                    <div>No reviews yet</div>
                ) : (
                    data.map((review) => (
                        <Review key={review._id} review={review} />
                    ))
                )}
            </div>
        </motion.div>
    )
}

export default Reviews;