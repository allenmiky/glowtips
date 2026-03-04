"use client";

export function useAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("glowtips_access") ?? "";
}

export function useCreatorId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("glowtips_creator") ?? "";
}

export function useUser() {
  if (typeof window === "undefined") return { email: "", name: "" };
  return {
    email: localStorage.getItem("glowtips_email") ?? "",
    name: localStorage.getItem("glowtips_name") ?? ""
  };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("glowtips_access");
  localStorage.removeItem("glowtips_refresh");
  localStorage.removeItem("glowtips_creator");
  localStorage.removeItem("glowtips_email");
  localStorage.removeItem("glowtips_name");
  window.location.href = "/auth/login";
}