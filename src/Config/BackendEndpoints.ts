import {ApplicationServices, IMediaGalleryFile} from '../BackendTypes';

export const backendEndpoints = {
    APPLICATION_INFO: '/api/jwt/application/info',
    ENTITY_EDITOR_DATA: '/api/jwt/entity-editor-data',
    SERVICE_ACCOUNTS: '/api/jwt/users/service-accounts',
    Authentication: {
        JWT_LOGIN: '/api/jwt/auth/login',
        JWT_LOGOUT: '/api/jwt/auth/logout',
        JWT_TOKEN_REFRESH: '/api/jwt/users/token/refresh',
        AUTH_USERINFO: '/api/jwt/authentication/info/user',
    },
    Services: {
        APPLICATION_SERVICES_STATUS: '/api/jwt/services/status',
        APPLICATION_SERVICE_ACTION: (service: ApplicationServices, videoSourceId: number, currentState: boolean) =>
            `/api/jwt/services/${service}/${videoSourceId}/${currentState ? 'stop' : 'start'}`,
    },
    MediaGallery: {
        MEDIA: ({fileName, mediaGalleryFolder}: IMediaGalleryFile) =>
            `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`,
        MEDIA_THUMB: ({fileName, mediaGalleryFolder}: IMediaGalleryFile) => {
            fileName = fileName.substr(0, fileName.lastIndexOf('.')) + '_thumb.png';
            return `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}`;
        },
        LIMITED_ACCESS_LINK: ({fileName, mediaGalleryFolder}: IMediaGalleryFile) =>
            `/api/jwt/media/${mediaGalleryFolder.folderName}/${fileName}/access`,
    },
    Streaming: {
        THUMBNAIL: (videoSourceId: number) =>
            `/api/jwt/streaming/${videoSourceId}/${videoSourceId}_thumb.png`,
        HLS_PLAYLIST: (videoSourceId: number) =>
            `/api/jwt/streaming/${videoSourceId}/${videoSourceId}.m3u8`,
    },
};
