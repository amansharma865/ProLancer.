import toast from 'react-hot-toast';
import { useEffect, useReducer, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { gigReducer, initialState } from '../../reducers/gigReducer';
import { cards } from '../../data';
import { axiosFetch, generateImageURL } from '../../utils';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import './Add.scss';

const Add = () => {
  const user = useRecoilValue(userState);
  const [state, dispatch] = useReducer(gigReducer, initialState);
  const [coverImage, setCoverImage] = useState(null);
  const [gigImages, setGigImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const mutation = useMutation({
    mutationFn: (gig) =>
      axiosFetch.post('/gigs', gig)
      .then(({data}) => {
        return data;
      })
      .catch(({response}) => {
        toast.error(response.data.message);
      })
    ,
    onSuccess: () => 
      queryClient.invalidateQueries(['my-gigs'])
  })

  const handleFormCange = (event) => {
    const { name, value } = event.target;
    dispatch({
      type: 'CHANGE_INPUT',
      payload: { name, value }
    })
  }

  const handleFormFeature = (event) => {
    event.preventDefault();
    dispatch({
      type: 'ADD_FEATURE',
      payload: event.target[0].value
    })
    event.target.reset();
  }

  const handleImageUploads = async () => {
    try {
      setUploading(true);
      const cover = await generateImageURL(coverImage);
      const images = await Promise.all(
        [...gigImages].map(async (img) => await generateImageURL(img))
      )
      dispatch({
        type: 'ADD_IMAGES',
        payload: { cover: cover.url, images: images.map((img) => img.url) }
      })
      setUploading(false);
      setDisabled(true);
    }
    catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = {...state, userID: user._id}
    for(let key in form) {
      if(form[key] === '' || form[key].length === 0) {
        toast.error('Please fill input field: ' + key);
        return;
      }
    }
    toast.success("Congratulations! You're on the market!")
    mutation.mutate(form);
    setTimeout(() => {
      navigate('/my-gigs');
    }, 2000);
  }

  return (
    <div className='add'>
      <div className="container">
        <h1>Create Your Amazing Gig</h1>
        <div className="sections">
          <div className="left">
            <label>What service are you offering?</label>
            <input 
              name='title' 
              type="text" 
              placeholder="e.g. I will create a stunning website design" 
              onChange={handleFormCange} 
            />

            <label>Select your service category</label>
            <select name="category" onChange={handleFormCange}>
              <option value=''>Category</option>
              {
                cards.map((item) => (
                  <option key={item.id} value={item.slug}>{item.slug[0].toUpperCase() + item.slug.slice(1)}</option>
                ))
              }
            </select>

            <label>Tell us about your service</label>
            <textarea 
              name='description' 
              rows="8" 
              placeholder='Describe your service in detail, including what customers will receive' 
              onChange={handleFormCange}
            ></textarea>

            <div className="images">
              <div className="imagesInputs">
                <label>Upload a cover image that represents your service</label>
                <input type="file" accept='image/*' onChange={(event) => setCoverImage(event.target.files[0])} />
                <br />
                <label htmlFor="">Upload Images</label>
                <input type="file" accept='image/*' multiple onChange={(event) => setGigImages(event.target.files)} />
              </div>
              <button disabled={!!disabled} onClick={handleImageUploads}>{uploading ? 'uploading' : disabled ? 'Uploaded' : 'upload'}</button>
            </div>
          </div>

          <div className="right">
            <label>Short & Sweet Title</label>
            <input 
              type="text" 
              name='shortTitle' 
              placeholder='e.g. Professional Website Design' 
              onChange={handleFormCange} 
            />

            <label>Quick Overview</label>
            <textarea 
              name='shortDesc' 
              rows="4" 
              placeholder='Give a brief, compelling summary of your service' 
              onChange={handleFormCange}
            ></textarea>

            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name='deliveryTime' min='1' onChange={handleFormCange} />

            <label htmlFor="">Revision Number</label>
            <input type="number" name='revisionNumber' min='1' onChange={handleFormCange} />

            <label>What's included in your service?</label>
            <form className='add' onSubmit={handleFormFeature}>
              <input 
                type="text" 
                placeholder='Add a feature (e.g. "Logo design", "Video editing")'
                maxLength="30"
              />
              <button type='submit'>Add</button>
            </form>
            <div className="addedFeatures">
              {state.features?.length === 0 ? (
                <span style={{ color: '#666', fontSize: '0.9rem' }}>No features added yet</span>
              ) : (
                state.features?.map((feature) => (
                  <div key={feature} className="item">
                    <button onClick={() => dispatch({ type: 'REMOVE_FEATURE', payload: feature })}>
                      {feature}<span>×</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <label>Set Your Price</label>
            <input 
              name='price' 
              type="number" 
              min='1' 
              placeholder="Enter amount" 
              onChange={handleFormCange} 
            />

            <button onClick={handleFormSubmit}>
              Launch Your Gig
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add