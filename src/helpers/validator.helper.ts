export const validEmail = (value: string) => {
  const reg = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return reg.test(value);
};

export const validUrl = (value: string) => {
  const reg = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
      "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return reg.test(value);
};

export const validAlpha = (value: string) => {
  const reg = new RegExp(/^[A-Za-z ]+$/);

  return reg.test(value);
};

export const validAlphaNumeric = (value: string) => {
  const reg = new RegExp(/^[0-9A-Za-z ]+$/);

  return reg.test(value);
};

export const validNumber = (value: string) => {
  const reg = new RegExp(/^[0-9.]+$/);

  return reg.test(value);
};
