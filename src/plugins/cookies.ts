import type { FastifyRequest } from "fastify";
import { ACCESS_TOKEN_EXPIRY_MS, REFRESH_TOKEN_EXPIRY_MS } from "../shared/const";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: FastifyRequest) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

function isLocalhost(req: FastifyRequest): boolean {
  const host = req.hostname;
  if (!host) return false;
  return LOCAL_HOSTS.has(host) || isIpAddress(host);
}

export type CookieOptions = {
  domain?: string;
  httpOnly: boolean;
  path: string;
  sameSite: "lax" | "none";
  secure: boolean;
};

function getBaseCookieOptions(req: FastifyRequest): CookieOptions {
  const localhost = isLocalhost(req);
  const secure = isSecureRequest(req);

  return {
    httpOnly: true,
    path: "/",
    sameSite: localhost ? "lax" : "none",
    secure: localhost ? false : secure,
  };
}

export function getAccessTokenCookieOptions(
  req: FastifyRequest,
): CookieOptions & { maxAge: number } {
  return {
    ...getBaseCookieOptions(req),
    maxAge: ACCESS_TOKEN_EXPIRY_MS,
  };
}

export function getRefreshTokenCookieOptions(
  req: FastifyRequest,
): CookieOptions & { maxAge: number } {
  return {
    ...getBaseCookieOptions(req),
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  };
}
