"use client";

export function useAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("glowtips_access") ?? "";
}

export function useCreatorId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("glowtips_creator") ?? "";
}