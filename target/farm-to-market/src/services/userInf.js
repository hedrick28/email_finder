export const getUserInfo = () => {
  const info = localStorage.getItem("ftm");
  if (info) {
    return JSON.parse(info);
  }

  return false;
};
