import { useForm } from "react-hook-form";
import { useCreateCabin } from "../../hooks/useCreateCabin";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCabinForm({status, name, maxCapacity, price, discount }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { errors } = formState;

  const { isLoading, mutate } = useCreateCabin(reset);

  function onSubmit(data) {
     mutate({...data, image: data.image[0]});
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Cabin name" errors={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isLoading}
          value={name || ''}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" errors={errors?.capacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isLoading}
          value={maxCapacity || ''}
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
          disabled={isLoading}
          
          value={price || ''}
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
          defaultValue={0 || discount}
          disabled={isLoading}
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
          disabled={isLoading}
          {...register("description", {required: "This field is required"})}
        />
      </FormRow>

      <FormRow label="Cabin photo">
          <FileInput id="image" accept="image/*" disabled={isLoading} {...register("image")}   />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isLoading}>{status === "Edit" ? status : "Add "} cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
