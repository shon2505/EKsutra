"use server";

import { revalidatePath } from "next/cache";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  disconnectApi,
  removeApi
} from "@/lib/db";

export async function sendRequestAction(fromDeptId: string, apiId: string, apiName: string, path: string) {
  sendConnectionRequest(fromDeptId, apiId, apiName);
  revalidatePath(path);
}

export async function acceptRequestAction(requestId: string, toDeptId: string, path: string) {
  acceptConnectionRequest(requestId, toDeptId);
  revalidatePath(path);
}

export async function rejectRequestAction(requestId: string, toDeptId: string, path: string) {
  rejectConnectionRequest(requestId, toDeptId);
  revalidatePath(path);
}

export async function disconnectApiAction(deptId: string, apiId: string, path: string) {
  disconnectApi(deptId, apiId);
  revalidatePath(path);
}

export async function removeApiAction(deptId: string, apiId: string, path: string) {
  removeApi(deptId, apiId);
  revalidatePath(path);
}
