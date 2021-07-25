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
  Formats: {
    TIME: 'HH:mm:ss',
    DATE: 'YYYY-MM-DD',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
  },
  Entities: {
    ALARM_PROFILE: 'AlarmProfile',
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
    MediaGallery: {
      MEDIA: ({fileName, folderName}) => `/api/jwt/media/${folderName}/${fileName}`,
      MEDIA_THUMB: ({fileName, folderName}) => {
        fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '_thumb.png';
        return `/api/jwt/media/${folderName}/${fileName}`;
      },
      LIMITED_ACCESS_LINK: ({fileName, mediaGalleryFolder}) => `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}/access`,
    },
    Streaming: {
      THUMBNAIL: (videoSourceId) => `/api/jwt/streaming/${videoSourceId}/${videoSourceId}_thumb.png`,
      HLS_PLAYLIST: (videoSourceId) => `/api/jwt/streaming/${videoSourceId}/${videoSourceId}.m3u8`,
    },
  },
};
