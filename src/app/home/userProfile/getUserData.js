
import cookies from "js-cookie";
export const getUserDetails = async () => {
  try {
    let verify = cookies.get("userid");
    let response = await fetch(
      `http://localhost:3000/api/userdetails/${verify}`
    );
    const userData = await response.json();
    if (userData.success) {
      return userData.result;
    } else {
      console.error("Data retrieval was not successful");
    }
    return userData;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};
