import { toast } from 'react-toastify';
import bcrypt from "bcryptjs";

export async function verifyMech(email, password) {
  try {
    const response = await fetch("/api/mechanicdetails");
    if (!response.ok) {
      toast.error("Network Error", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return null;
    }

    const data = await response.json();

    if (data.success) {
      const foundItem = data.result.find(item => {
        return item.Email === email && 
               item.Status === "Verified";
      });

      if (foundItem) {
        // const hashedPasswordFromServer = foundItem.Password;
        try {
          const match = await bcrypt.compare(password,foundItem.Password);
          if (match) {
            return {
              Status: true,
              id: foundItem._id,
            };
          } else {
            toast.error('Invalid password', {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        } catch (error) {
          toast.error('Password verification error', {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }else{
      toast.error("Network Error", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    toast.error("Network Error", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  return null; // Return null if no match is found or there's an error
}
