import React from 'react';

const CLOUDINARY_UPLOAD_URL =
  'https://api.cloudinary.com/v1_1/dx1jwn9cz/image/upload';

const UPLOAD_PRESET_NAME = 'wdqafr5r';

export const useUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  /** src image */
  const [image, setImage] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const handleChangeImage = (e: React.ChangeEvent): null | void => {
    const file = inputRef?.current?.files?.[0];
    if (!file) return null;

    const reader = new FileReader();

    const url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setImage(reader.result as string);
    };

    const xhr = new XMLHttpRequest();
    setUploading(true);
    xhr.open('POST', CLOUDINARY_UPLOAD_URL);
    xhr.onloadend = () => {
      const _response = JSON.parse(xhr.responseText);
      console.log(_response);
      setUploading(false);

      /**
       * @todo post request to save url avatar to server
       * and update current url avatar in frontend
       */
    };
    xhr.onerror = (event) => {};
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET_NAME);

    xhr.send(formData);
  };

  return (
    <>
      <button
        onClick={() => {
          inputRef.current?.click();
        }}
        disabled={uploading}
      >
        upload
      </button>
      <input
        ref={inputRef}
        type='file'
        onChange={handleChangeImage}
        accept='image/*'
        hidden={true}
      />
      <image src={image} />
    </>
  );
};
