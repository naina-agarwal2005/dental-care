import { ClinicItem, TraumaItem } from "@/lib/types";

async function parseResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Request failed");
  }
  return json.data as T;
}

export async function fetchTraumas(): Promise<TraumaItem[]> {
  const res = await fetch("/api/traumas", { next: { revalidate: 60 } });
  return parseResponse<TraumaItem[]>(res);
}

export async function fetchTraumaById(id: string): Promise<TraumaItem> {
  const res = await fetch(`/api/traumas/${id}`, { next: { revalidate: 60 } });
  return parseResponse<TraumaItem>(res);
}

export async function createTrauma(payload: Omit<TraumaItem, "id" | "numberOfFirstAidSteps">) {
  const res = await fetch("/api/traumas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<TraumaItem>(res);
}

export async function updateTrauma(id: string, payload: Omit<TraumaItem, "id" | "numberOfFirstAidSteps">) {
  const res = await fetch(`/api/traumas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<TraumaItem>(res);
}

export async function deleteTrauma(id: string) {
  const res = await fetch(`/api/traumas/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "Failed to delete trauma");
  }
}

export async function fetchClinics(lat?: number, lng?: number): Promise<ClinicItem[]> {
  const search = typeof lat === "number" && typeof lng === "number"
    ? `?lat=${lat}&lng=${lng}`
    : "";
  // Use shorter revalidation for proximity searches, longer for default list
  const revalidate = search ? 30 : 60;
  const res = await fetch(`/api/clinics${search}`, { next: { revalidate } });
  return parseResponse<ClinicItem[]>(res);
}

export async function fetchClinicById(id: string): Promise<ClinicItem> {
  const res = await fetch(`/api/clinics/${id}`, { next: { revalidate: 60 } });
  return parseResponse<ClinicItem>(res);
}

export async function createClinic(payload: Omit<ClinicItem, "id" | "distanceKm">) {
  const res = await fetch("/api/clinics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<ClinicItem>(res);
}

export async function updateClinic(id: string, payload: Omit<ClinicItem, "id" | "distanceKm">) {
  const res = await fetch(`/api/clinics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<ClinicItem>(res);
}

export async function deleteClinic(id: string) {
  const res = await fetch(`/api/clinics/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "Failed to delete clinic");
  }
}
