import { mediaStatus, mediaType } from "./enums";

export type createMediaParams = {
    name: string;
    description: string;
    type: mediaType;
    status: mediaStatus;
    url: string;
}

export type updateMediaParams = {
    status: mediaStatus;
}