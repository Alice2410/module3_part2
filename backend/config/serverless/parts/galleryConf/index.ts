export const getGallery =  {
  handler: 'api/gallery/handler.getGallery',
    description: 'Return pictures',
    timeout: 6,
    memorySize: 128,
    events: [
    {
      httpApi: {
        path: '/gallery',
        method: 'get',
        authorizer: {
          name: 'authenticate'
        },
      },
    },
  ],
};

export const getUploadLink = {
  handler: 'api/gallery/handler.getUploadLink',
    description: 'Upload new images',
    timeout: 6,
    memorySize: 128,
    events: [
    {
      httpApi: {
        path: '/gallery/get-upload-link',
        method: 'post',
        authorizer: {
          name: 'authenticate'
        },
      },
    },
  ],
};
