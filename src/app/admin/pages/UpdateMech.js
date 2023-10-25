import { toast } from 'react-toastify';
export default async function UpdateMech(userid, value){
    let mechData = await fetch(
      "/api/mechanicdetails/" + userid,
      {
        method: "PUT",
        body: JSON.stringify({ Status: value }),
      }
    );
    mechData = await mechData.json();
    if (mechData.result) {
      toast.success('Updated Successfully!', {
        position: toast.POSITION.BOTTOM_CENTER
    });
    }
};