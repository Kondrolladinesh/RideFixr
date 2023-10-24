import { toast } from 'react-toastify';
import bcrypt from "bcryptjs";

export async function verifyUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/userdetails");
    if (!response.ok) {
      toast.error("Network Error", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return null;
    }

    const data = await response.json();

    if (data.success) {
      const foundItem = data.result.find(item => item.Email === email);

      if (foundItem) {
        // const hashedPasswordFromServer = foundItem.Password;
        try {
          const match = await bcrypt.compare(password,foundItem.Password);
          if (match) {
            return {
              Status: true,
              Admin: false,
              id: foundItem._id,
              name: foundItem.UserName,
              phone: foundItem.PhoneNo,
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

  return {
    Status: false,
    Admin: false,
    id: null,
  }; // Return null if no match is found or there's an error
}
