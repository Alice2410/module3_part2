import { ObjectId } from "mongodb";
import { Stats } from "fs";

export interface UserLog {
  _id?: ObjectId,
  email: string;
  password: string;
  salt: string;
}

export interface ResponseObject {
  objects: string[];
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

export interface GetImageParams {
  limitNumber: number;
  pageNumber: number;
  filter: string;
}

export interface ImageDB {
  metadata: Object;
  partitionKey: string;
  path: string;
  sortKey: string;
  resType: string;
}
