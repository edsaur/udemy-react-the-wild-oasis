import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import {useUpdateUser} from './useUpdateUser';

import { useUser } from "./useUser";
import toast from "react-hot-toast";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName, avatar: currentUserAvatar },
    }
  } = useUser();


  const {isLoading, mutate: updateUser} = useUpdateUser();
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if(!fullName) return;
    if(currentFullName === fullName) {
      toast.error("Your name hasn't changed!");
      return;
    }

    const updateData = {fullName};
    if(avatar) {
      updateData.currentUserAvatarPath = currentUserAvatar;
      updateData.avatar = avatar;
    }
    
    updateUser(updateData, {
      onSuccess: () => {
        setAvatar(null);
        e.target.reset();
      }
    })
  }

  function handleCancel(){
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isLoading}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow>
          <Button type="reset" variation="secondary" disabled={isLoading} onClick={handleCancel}>
          Cancel
        </Button>
        <Button>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
