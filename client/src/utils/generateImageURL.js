// import axios from "axios";

// // const generateImageURL = async (image) => {
// //   const file = new FormData();
// //   file.append("file", image);
// //   file.append("upload_preset", process.env.CLOUDINARY_PRESET);

// //   const { data } = await axios.post(
// //     `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_ENV}/image/upload`,
// //     file
// //   );
// //   return data;
// // };

// // export default generateImageURL;


// const generateImageURL = async (image) => {
//   const formData = new FormData();
//   formData.append('file', image);
//   formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

//   const response = await fetch(import.meta.env.VITE_CLOUDINARY_ENV, {
//       method: 'POST',
//       body: formData,
//   });

//   const data = await response.json();
//   return data;
// };

// export default generateImageURL;








const generateImageURL = async (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

  const cloudName = import.meta.env.VITE_CLOUDINARY_ENV.split('@')[1];
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
  }

  const data = await response.json();
  return data;
};

export default generateImageURL;