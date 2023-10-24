import cookies from "js-cookie";
export const getMechanicDetails = async () => {
  try {
    let verify = cookies.get("mechid");
    const response = await fetch(
      `http://localhost:3000/api/mechanicdetails/${verify}`
    );
    const userData = await response.json();
    if (userData.success) {
      return userData.result;
    } else {
      console.error("Data retrieval was not successful");
    }
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};
