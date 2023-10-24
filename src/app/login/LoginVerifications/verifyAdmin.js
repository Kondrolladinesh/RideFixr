import { toast } from 'react-toastify';
import bcrypt from "bcryptjs";

export async function verifyAdmin(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/admin");
    if (!response.ok) {
      toast.error("Network Error", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return null;
    }

    const data = await response.json();

    if (data.success) {
      const foundItem = data.result.find(item => {
        return item.Email === email;
      });

      if (foundItem) {
        // const hashedPasswordFromServer = foundItem.Password;
        try {
          const match = await bcrypt.compare(password,foundItem.Password);
          if (match) {
            return {
              Status: true,
              Admin: true,
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

  return {
    Status: false,
    Admin: false,
    id: null,
  };
}
