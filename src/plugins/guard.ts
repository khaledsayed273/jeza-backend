import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../db";
import { authenticate } from "../modules/auth/auth.service";
import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../shared/const";
import { ForbiddenError, UnauthorizedError } from "../shared/errors";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

export async function attachUser(request: FastifyRequest, _reply: FastifyReply) {
  request.user = (await authenticate(request.headers.cookie)) ?? undefined;
}

export async function requireUser(request: FastifyRequest, _reply: FastifyReply) {
  const user = await authenticate(request.headers.cookie);
  if (!user) {
    throw UnauthorizedError(UNAUTHED_ERR_MSG);
  }
  request.user = user;
}

export async function requireAdmin(request: FastifyRequest, _reply: FastifyReply) {
  const user = await authenticate(request.headers.cookie);
  if (!user || user.role !== "admin") {
    throw ForbiddenError(NOT_ADMIN_ERR_MSG);
  }
  request.user = user;
}
