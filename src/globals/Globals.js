export default {
  STORAGE_INITIALIZED: 'storage_initialized',
  DARK_STYLE_ACTIVE: 'application_dark_style',
  FINGERPRINT_ACTIVE: 'fingerprint_active',
  SERVERS: 'servers',
  Authorization: {
    USERNAME: 'username',
    SERVER_NAME: 'server_name',
    FIREBASE_ACCOUNT: 'firebase_account',
  },
  httpMethod: {
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE',
  },
  Entities: {
    VIDEO_CAMERA: 'VideoSource',
    MEDIA_GALLERY_FOLDER: 'MediaGalleryFolder',
    MEDIA_GALLERY_FILE: 'MediaGalleryFile',
  },
  Endpoints: {
    SERVICE_ACCOUNTS: '/api/jwt/users/service-accounts',
    ENTITY_EDITOR_DATA: '/api/jwt/entity-editor-data',
    JWT_AUTHORIZATION: '/api/jwt/auth/login',
    JWT_TOKEN_REFRESH: '/api/jwt/users/token/refresh',
    APPLICATION_INFO: '/api/jwt/application/info',
    Services: {
      APPLICATION_SERVICES_STATUS: '/api/jwt/services/status',
      APPLICATION_SERVICE_ACTION: (service, videoSourceId, currentState) =>
        `/api/jwt/services/${service}/${videoSourceId}/${currentState ? 'stop' : 'start'}`,
    },
    Entities: {
      ALARM_PROFILES: '/api/jwt/alarm-profile',
      VIDEO_CAMERAS: '/api/jwt/video-sources',
    },
    MediaGallery: {
      MEDIA: ({fileName, mediaGalleryFolder}) => `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`,
      IMAGE_BASE64: ({fileName, mediaGalleryFolder}) => `/api/jwt/media/base64/${mediaGalleryFolder.folderName}/${fileName}`,
      MEDIA_THUMB: ({fileName, mediaGalleryFolder}) => {
        fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '_thumb.png';
        return `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`;
      },
      LIMITED_ACCESS_LINK: ({fileName, mediaGalleryFolder}) => `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}/access`,
      FILE: (fileId) => `/api/jwt/media-gallery-file/${fileId}`,
      FILES: (folderId) => `/api/jwt/media-gallery-folder/${folderId}/files`,
      FOLDERS: '/api/jwt/media-gallery-folder',
    },
    Streaming: {
      THUMBNAIL: (videoSourceId) => `/api/jwt/streaming/${videoSourceId}/${videoSourceId}_thumb.png`,
      HLS_PLAYLIST: (videoSourceId) => `/api/jwt/streaming/${videoSourceId}/${videoSourceId}.m3u8`,
    },
  },
};
