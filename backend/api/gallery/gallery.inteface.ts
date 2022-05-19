import { ObjectId } from "mongodb";
import { Stats } from "fs";

export interface UserLog {
  _id?: ObjectId,
  email: string;
  password: string;
  salt: string;
}

export interface ResponseObject {
  objects: object[];
  page: number;
  total: number;
}

export interface ImageInterface {
  id: string;
  path: string;
  metadata: Stats;
  owner?: string;
}

export interface QueryParameters {
  page: string;
  limit: string;
  filter: string;
}

export interface ImageMetadata {
  name: string,
  lastModifiedDate: Date,
  size: number,
  type: string,
}
