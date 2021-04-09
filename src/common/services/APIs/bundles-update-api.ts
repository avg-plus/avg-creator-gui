import got from "../../got-request";

const API_PREFIX = "v1/bundle-update";
export async function apiGetManifest<T>() {
  const { body } = await got.get<T>(`${API_PREFIX}/manifest`);

  return body;
}

export async function apiGetElectronMirror<T>() {
  const { body } = await got.get<T>(`${API_PREFIX}/electron-mirror`);

  return body;
}
