const BASE_URL = "http://localhost:8080";

export const setToken = (t) => {
  if (t) localStorage.setItem("litecore_token", t);
  else localStorage.removeItem("litecore_token");
};

export const getToken = () => {
  return localStorage.getItem("litecore_token");
};

const fetchJson = async (url, opts) => {
  const res = await fetch(url, opts);
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
};

export const apiPost = async (path, data = {}) => {
  const body = new URLSearchParams(data).toString();
  return fetchJson(BASE_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: getToken() || "",
    },
    body,
  });
};

export const apiGet = async (path) => {
  return fetchJson(BASE_URL + path, {
    method: "GET",
    headers: { Authorization: getToken() || "" },
  });
};

export const apiPut = async (path, data = {}) => {
  const body = new URLSearchParams(data).toString();
  return fetchJson(BASE_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: getToken() || "",
    },
    body,
  });
};

export const apiDelete = async (path, data = null) => {
  const opts = {
    method: "DELETE",
    headers: { Authorization: getToken() || "" },
  };
  if (data) {
    opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
    opts.body = new URLSearchParams(data).toString();
  }
  return fetchJson(BASE_URL + path, opts);
};
