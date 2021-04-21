export const validate = (type, id = "") => {
  switch (type) {
    case "jsm":
      return /\+\d{3} \(\d\d\) \d{3}-\d\d-\d\d/.test(id);
    default:
      return true;
  }
};
