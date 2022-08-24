export const backendEndpoints = {
  APPLICATION_INFO: '/api/jwt/application/info',
  ENTITY_EDITOR_DATA: '/api/jwt/entity-editor-data',
  SERVICE_ACCOUNTS: '/api/jwt/users/service-accounts',
  Authorization: {
    JWT_LOGIN: '/api/jwt/auth/login',
    JWT_LOGOUT: '/api/jwt/auth/logout',
    JWT_TOKEN_REFRESH: '/api/jwt/users/token/refresh',
  },
  Services: {
    APPLICATION_SERVICES_STATUS: '/api/jwt/services/status',
    APPLICATION_SERVICE_ACTION: (service, videoSourceId, currentState) =>
      `/api/jwt/services/${service}/${videoSourceId}/${
        currentState ? 'stop' : 'start'
      }`,
  },
  MediaGallery: {
    MEDIA: ({fileName, mediaGalleryFolder}) =>
      `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`,
    MEDIA_THUMB: ({fileName, mediaGalleryFolder}) => {
      fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '_thumb.png';
      return `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`;
    },
    LIMITED_ACCESS_LINK: ({fileName, mediaGalleryFolder}) =>
      `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}/access`,
  },
  Streaming: {
    THUMBNAIL: (videoSourceId) =>
      `/api/jwt/streaming/${videoSourceId}/${videoSourceId}_thumb.png`,
    HLS_PLAYLIST: (videoSourceId) =>
      `/api/jwt/streaming/${videoSourceId}/${videoSourceId}.m3u8`,
  },
};
