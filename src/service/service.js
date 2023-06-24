import axios from 'axios';

const app_id = process.env.REACT_APP_ID;
const Key_ID = process.env.REACT_APP_KEY;

export const fetchData = async (query, condition) => {
  try {
    if (condition === 'details') {
      const response = await axios.get(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${query}&app_id=a1710252&app_key=f10494e47bad8799ae4515481f6bf5e9`,{
        headers: {
                  'Access-Control-Allow-Origin': '*'
                }
      });
      return response.data;
    } else {
      const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=a1710252&app_key=f10494e47bad8799ae4515481f6bf5e9`,{
        headers: {
                  'Access-Control-Allow-Origin': '*'
                }
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};