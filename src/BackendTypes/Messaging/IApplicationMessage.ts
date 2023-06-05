import {MessageType} from "./Enums/MessageType";

export interface IApplicationMessage {
  type: MessageType;
  dateTime: string;
  body: string;
  applicationExternalUniqueId: string;
}
