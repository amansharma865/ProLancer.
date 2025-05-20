import { useState, useEffect } from 'react';  // Add useEffect
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { userState } from '../../atoms';
import toast from 'react-hot-toast';
import { axiosFetch, generateImageURL } from '../../utils';
import './Profile.scss';
import { FiUser, FiPhone, FiFile, FiCamera, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useRecoilState(userState);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    description: user?.description || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [showPassword, setShowPassword] = useState({ old: false, new: false });

  // Add useEffect to initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        description: user.description || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = user?.image;
      if (profileImage) {
        const uploadedImage = await generateImageURL(profileImage);
        imageUrl = uploadedImage.url;
      }

      const { data } = await axiosFetch.put('/users/update', {
        ...formData,
        image: imageUrl
      });

      setUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);  // Add error logging
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Add password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosFetch.put('/users/change-password', passwordData);
      toast.success('Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <motion.div 
          className="profile-header"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <h1>Profile Settings</h1>
          <p>Manage your profile information</p>
        </motion.div>

        <motion.div 
          className="profile-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="image-section">
            <div className="image-container">
              <img 
                src={previewUrl || user?.image || "/media/noavatar.png"} 
                alt="Profile" 
              />
              <motion.div 
                className="image-overlay"
                whileHover={{ opacity: 1 }}
              >
                <label htmlFor="profile-image">
                  <FiCamera size={24} />
                  <span>Change Photo</span>
                </label>
                <input 
                  id="profile-image"
                  type="file" 
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                />
              </motion.div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <div className="input-wrapper">
                <FiUser className="icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FiPhone className="icon" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FiFile className="icon" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={5}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </motion.button>
          </form>

          <motion.div 
            className="password-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="section-header">
              <h3>Change Password</h3>
              <p>Ensure your account is using a strong password for security</p>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <div className="input-wrapper">
                  <FiLock className="icon" />
                  <input
                    type={showPassword.old ? "text" : "password"}
                    placeholder="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      oldPassword: e.target.value
                    }))}
                    required
                  />
                  <motion.div
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword.old ? <FiEyeOff /> : <FiEye />}
                  </motion.div>
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <FiLock className="icon" />
                  <input
                    type={showPassword.new ? "text" : "password"}
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    required
                  />
                  <motion.div
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword.new ? <FiEyeOff /> : <FiEye />}
                  </motion.div>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`password-button ${isLoading ? 'loading' : ''}`}  // Add password-button class
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
