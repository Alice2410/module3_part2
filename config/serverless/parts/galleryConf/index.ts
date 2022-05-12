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

export const addImageGallery = {
  handler: 'api/gallery/handler.addImageGallery',
    description: 'Upload new images',
    timeout: 6,
    memorySize: 128,
    events: [
    {
      httpApi: {
        path: '/gallery/upload-new',
        method: 'post',
        authorizer: {
          name: 'authenticate'
        },
      },
    },
  ],
};

export const uploadDefaultImages = {
  handler: 'api/gallery/handler.uploadDefaultImages',
    description: 'Create default images objects in DB',
    timeout: 6,
    memorySize: 128,
    events: [
    {
      httpApi: {
        path: '/gallery/upload-default',
        method: 'post',
      },
    },
  ],
};