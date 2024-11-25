import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCabinForm({cabinToEdit = {}, onClose}) {
  const {id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId); 

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  const { isLoading: isCreating, mutate: mutateToCreate } = useCreateCabin(reset, onClose);
  const { isLoading: isEditing, mutate: mutateToEdit } = useEditCabin();

  const isWorking = isCreating || isEditing;
  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0]; 

    if(isEditSession) mutateToEdit({newCabinData: {...data, image}, id: editId});
    else mutateToCreate({...data, image: image});

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onClose ? 'modal' : "regular"}>
      <FormRow label="Cabin name" errors={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" errors={errors?.capacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("capacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" errors={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 20,
              message: "Price should be at least $20 above!",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" errors={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be lower than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for the page"
        errors={errors?.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          {...register("description", {required: "This field is required"})}
        />
      </FormRow>

      <FormRow label="Cabin photo">
          <FileInput id="image" accept="image/*" disabled={isWorking} {...register("image", {
            required: isEditSession ? false : "This field is required"
          })}   />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset" onClick={() => onClose?.()} >
          Cancel
        </Button>
        <Button disabled={isWorking} >{isEditSession ? "Edit " : "Create new "} cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
