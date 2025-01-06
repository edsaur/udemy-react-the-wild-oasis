import supabase, {supabaseUrl} from "./supabase";

export async function signUp({ fullName, email, password }) {
  // Save the current session before signing up a new user
  const { data: savedSessionData } = await supabase.auth.getSession();
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  //  Log the entire response for debugging
  // console.log("Sign-up response:", { user, error });

  //If there was a previously authenticated user, restore their session
  // This action should be placed right after signUp, otherwise the authError will stop the restore
  if (savedSessionData) {
    await supabase.auth.setSession(savedSessionData.session);
  }

  // Handle errors
  let authError = null;

  if (user && !user.identities.length) {
    authError = {
      name: "AuthApiError",
      message: "This email has already been registered",
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }

  if (authError) throw new Error(authError.message);
  return user;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return data;
}

export async function getUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ fullName, password, avatar, currentUserAvatarPath }) {
  // 1. update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if(!avatar) return data;

  
  // Delete the current avatar of user.
  const currentImagePath = currentUserAvatarPath.split("/").pop();
  const {data: user, error: userError} = await supabase.auth.getUser();

  if (userError) throw new Error("There's an error in fetching the user.");
  if (currentImagePath) {
    const { error: imageDeletionError } = await supabase.storage.from('avatars').remove([currentImagePath]);
  
    if (imageDeletionError) {
      console.error("Error deleting user avatar:", imageDeletionError);
      throw new Error("User avatar could not be deleted!");
    } else {
      console.log("User avatar deleted successfully.");
    }
  } else {
    console.error("Image path is invalid, cannot delete avatar.");
  }
  
  // Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const {error: storageError} = await supabase.storage.from("avatars").upload(fileName, avatar);
  if (storageError) throw new Error(error.message);

  // 
  const {data: updatedUser, error: error2} = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    }
  });

  if (error2) throw new Error(error2.message);
  return updatedUser
}
