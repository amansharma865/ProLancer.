import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosFetch, generateImageURL } from '../../../utils';
import './Register.scss';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
    phone: '',
    description: '',
    isSeller: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let key in formInput) {
      if (formInput[key] === '') {
        toast.error('Please fill all input field: ' + key);
        return;
      }
      else if (key === 'phone' && formInput[key].length < 9) {
        toast.error('Enter valid phone number!');
        return;
      }
    }

    setLoading(true);
    try {
      const { url } = await generateImageURL(image);
      console.log('Image URL:', url); // Log the image URL
      const response = await axiosFetch.post('/auth/register', { ...formInput, image: url });
      console.log('Response:', response); // Log the response
      const { data } = response;
      console.log('Data:', data); // Log the data
      toast.success('Registration successful!');
      setLoading(false);
      navigate('/login');
    }
    catch (error) {
      console.error('Error:', error); // Log the error
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
      setLoading(false);
    }
  };
  
  const handleChange = (event) => {
    const { value, name, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormInput({
      ...formInput,
      [name]: inputValue,
    });
  };

  const containerAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const inputAnimation = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="register"
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="left"
          variants={formAnimation}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Join our Creative Community
          </motion.h1>
          
          <AnimatePresence>
            {['username', 'email', 'password'].map((field, index) => (
              <motion.div
                key={field}
                variants={inputAnimation}
                custom={index}
                whileHover={{ scale: 1.02 }}
              >
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </motion.label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#6d28d9" }}
                  name={field}
                  type={field === 'password' ? 'password' : 'text'}
                  placeholder={`Enter your ${field}`}
                  onChange={handleChange}
                />
              </motion.div>
            ))}
            
            <motion.div variants={inputAnimation}>
              <label>Profile Picture</label>
              <input 
                type="file" 
                onChange={(event) => setImage(event.target.files[0])} 
              />
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block" }}
                >
                  ⭮
                </motion.span>
                {" Creating Account..."}
              </motion.span>
            ) : (
              'Create Account'
            )}
          </motion.button>

          <motion.p 
            className="login-link"
            variants={inputAnimation}
          >
            Already have an account?
            <motion.span
              whileHover={{ color: '#a78bfa' }}
              transition={{ duration: 0.2 }}
            >
              <Link to='/login'>Sign in</Link>
            </motion.span>
          </motion.p>
        </motion.div>

        <motion.div 
          className="right"
          variants={formAnimation}
          initial="hidden"
          animate="visible"
        >
          <div className="heading-with-toggle">
            <motion.h1
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start Selling
            </motion.h1>
            <motion.div 
              className="toggle"
              whileHover={{ scale: 1.05 }}
            >
              <label className="switch">
                <input 
                  type="checkbox" 
                  name="isSeller"
                  onChange={handleChange}
                  checked={formInput.isSeller}
                />
                <motion.span 
                  className="slider"
                  whileHover={{ boxShadow: "0 0 8px rgba(147, 112, 219, 0.5)" }}
                />
              </label>
            </motion.div>
          </div>

          <motion.div>
            <label>Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              onChange={handleChange}
            />
            <label>Tell us about yourself</label>
            <motion.textarea
              whileFocus={{ scale: 1.01, borderColor: "#6d28d9" }}
              placeholder="Share your skills and experience..."
              name="description"
              rows="6"
              onChange={handleChange}
            />
          </motion.div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Register;