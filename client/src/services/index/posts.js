import axios from "axios";
import BASEURL from "../../data/Baseurl";
export const getAllPosts = async () => {
  try {
    const { data } = await axios.get(`${BASEURL}/api/posts`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async ({ slug }) => {
  try {
    const { data } = await axios.get(`${BASEURL}/api/posts/${slug}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updatePost = async ({ slug, token, postdata }) => { 
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(`${BASEURL}/api/posts/useritem/${slug}`, {
      postdata, 
      config
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
}
