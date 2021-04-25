import axios from "axios";

export const getMethodsService = () =>
  axios.get("/methods").then((response) => response.data);
