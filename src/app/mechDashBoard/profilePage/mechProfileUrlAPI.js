
export async function updateMechProfileImage(mechId, base64Data) {
    try {
        // Check if user profile data already exists by making a GET request
        const getUserProfileResponse = await fetch(`/api/mechprofiles`);
        if (!getUserProfileResponse.ok) {
            throw new Error(`Error checking user profile data: ${getUserProfileResponse.statusText}`);
        }
        // console.log(base64Data);
        const userData = await getUserProfileResponse.json();
        const existingUserData = userData.result.find(item => item.MechId === mechId);

        if (existingUserData) {
            // User profile data exists, perform a PUT request to update
            const putResponse = await fetch(`/api/mechprofiles/${mechId}`, {
                method: "PUT",
                body: JSON.stringify({
                    ProfileUrl: base64Data,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (putResponse.ok) {
                return true; // User profile image updated successfully
            } else {
                throw new Error("User profile image update failed.");
            }
        } else {
            // User profile data doesn't exist, perform a POST request
            const postResponse = await fetch(`/api/mechprofiles`, {
                method: "POST",
                body: JSON.stringify({
                    MechId: mechId,
                    ProfileUrl: base64Data,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (postResponse.ok) {
                return true; // User profile image created successfully
            } else {
                throw new Error("User profile image creation failed.");
            }
        }
    } catch (error) {
        throw new Error(`Error handling user profile image: ${error.message}`);
    }
}
