import got from "../../../common/got-request";

export async function apiGetManifest<T>() {
  const { body } = await got.get<T>(`bundle-update/manifest`);

  return body;
}

export async function apiGetElectronMirror<T>() {
  const { body } = await got.get<T>(`bundle-update/electron-mirror`);

  return body;
}
