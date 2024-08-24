import { defer } from "react-router-dom";
import axios from 'axios'


export const singlePageLoader = async ({ request, params }) => {
  const {data} = await axios.get("/api/residency/single/" + params.id);
  return data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = await axios.get("/api/residency/all?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = await axios.get("/api/user/profileresidency");
  const chatPromise = await axios.get("/api/chat/allchats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
}

