const images = import.meta.url.replace(/^file:\/\/|\/\w+\.?[jt]s$/g, "").replace(/\/index\.[a-z]+$/g, "");

export { images };
