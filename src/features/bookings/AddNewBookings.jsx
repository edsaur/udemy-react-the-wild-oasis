import { useEffect, useState } from "react";
import { useGuests } from "../guests/useGuests";
import { useCabins } from "../cabins/useCabins";

import Heading from "../../ui/Heading";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";

import Spinner from "../../ui/Spinner";

import SelectUser from "../../ui/SelectUser";
import SelectCabin from "../../ui/SelectCabin";

import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { useCabinCapacity } from "../../features/cabins/useCabinCapacity";

import SelectNumGuests from "../../ui/SelectNumGuests";

import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { Calendar, DateObject } from "react-multi-date-picker";

import { useDarkMode } from "../../context/LightModeContext";
import { useCabinsPrice } from "../cabins/useCabinsPrice";
import { formatCurrency } from "../../utils/helpers";
import Checkbox from "../../ui/Checkbox";
import { useSettings } from "../settings/useSettings";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { useCreateBookings } from "./useCreateBookings";

const CalendarWrapper = styled.div`
  display: flex;
  flex-shrink: 0; /* Prevent the calendar from shrinking */
`;

const Box = styled.div`
  /* Box */
  background-color: white;
  border: 1px solid var(--color-grey-0);
  color: var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

export default function AddNewBookings() {

  // React Hook Form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guest: "",
      cabin: "",
      hasBreakfast: false,
      hasPaid: false,
      numNights: 0,
      numGuests: 0,
    },
  });

  // Hooks
  const { isDarkMode } = useDarkMode();
  const { settingData = {}, isLoading: isLoadingSetting } = useSettings();

  // STATES
  // Cabin
  const { cabins, isLoading: isLoading2 } = useCabins();
  const [cabinId, setCabinId] = useState();
  const { cabinCapacity, isLoading: isLoading3 } = useCabinCapacity(cabinId);

  // dates and guests
  const [dates, setDates] = useState([new DateObject()]);
  const { guests, isLoading } = useGuests();

  const [guestId, setGuestId] = useState();

  const [numNights, setNumNights] = useState(0);
  const [numGuests, setNumGuests] = useState(0);


  // Check-in
  const [hasPaid, setHasPaid] = useState();

  // Prices
  const { cabinPrice, isLoading: isLoading4 } = useCabinsPrice(cabinId);
  setValue("cabinPrice", cabinPrice?.regularPrice);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);



  function handleDateChange(dateObjects) {
    setDates(dateObjects);
    setValue("calendar", [
      dateObjects[0].format(),
      dateObjects[1] && dateObjects[1].format(),
    ]);
    if (dateObjects.length === 2) {
      const fromDate = dateObjects[0].toDate();
      const toDate = dateObjects[1].toDate();
      const timeDiff = Math.abs(toDate - fromDate);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setValue("numNights", daysDiff);
      setNumNights(daysDiff);
    } else {
      setNumNights(0);
    }

  }

  console.log('numNights', getValues('numNights'));

  // - number of guests (ranging from max guest from cabin's capacity)

  // - has breakfast (checkbox)

  const { breakfastPrice } = settingData;
  setValue("extrasPrice", breakfastPrice * numGuests);


  // - observations

  // Add Validations && Add data handling

  // Sum the bill
  useEffect(
    function () {
      if (isLoading4 || !cabinPrice) return;
      const discount = cabinPrice.discount ?? 0;
      const nightPrice = cabinPrice.regularPrice * numNights - discount;
      const bookingTotalPrice = hasBreakfast
        ? breakfastPrice * numNights * numGuests +
          (cabinPrice.regularPrice * numNights - discount)
        : nightPrice;

      setTotalPrice(bookingTotalPrice);
      setValue("totalPrice", bookingTotalPrice);
    },
    [cabinPrice, numNights, isLoading4, breakfastPrice, numGuests, hasBreakfast, setValue]
  );

  const {isLoading: processingBooking, mutate: createBooking} = useCreateBookings();

  function onSubmit(data) {
    createBooking(data);
  }

  if (isLoadingSetting) return <Spinner />;

  return (
    <>
      <Heading as="h1">Create a new booking</Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Select Guest" errors={errors?.guest?.message}>
          {!isLoading ? (
            <SelectUser
              options={guests}
              value={guestId || ""} // Controlled by React Hook Form
              onChange={(value) => setValue("guest", value)} // Update Hook Form state
              onHandleChange={(id) => setGuestId(id)} // Trigger additional side effects
              ref={
                register("guest", { required: "This field is required!" }).ref
              } // Forward ref
            />
          ) : (
            <Spinner />
          )}
        </FormRow>

        <FormRow label="Select Cabins" errors={errors?.cabin?.message}>
          {!isLoading2 ? (
            <SelectCabin
              options={cabins}
              value={cabinId}
              onChange={(value) => setValue("cabin", value)}
              onHandleChange={(id) => setCabinId(id)}
              ref={
                register("cabin", { required: "This field is required!" }).ref
              }
            />
          ) : (
            <Spinner />
          )}
        </FormRow>

        <CalendarWrapper>
          <FormRow label="Select a date">
            <Controller
              control={control}
              name="calendar"
              rules={{
                required: "Please select a date range",
                validate: {
                  validateRange: (value) =>
                    value.length === 2
                      ? true
                      : "Please select both start and end dates",
                },
              }}
              render={({ field }) => (
                <Calendar
                  className={isDarkMode ? "bg-dark green" : "green"}
                  minDate={new DateObject().subtract(0, "days")}
                  value={dates}
                  onChange={(date) => {
                    handleDateChange(date);
                    field.onChange(date);
                  }}
                  range
                  format="YYYY-MM-DD"
                />
              )}
            />

            <p>
              You're booking from {dates[0].format()}{" "}
              {`${dates[1] ? "to " + dates[1].format() : ""}`}{" "}
            </p>
            {dates[1] && numNights !== 0 ? (
              <Heading as="h5"> You're Booking for {numNights} nights </Heading>
            ) : null}
          </FormRow>
        </CalendarWrapper>

        {dates[1] ? (
          <>
            <FormRow label="Number of Guests">
              {!isLoading3 ? (
                <SelectNumGuests
                  options={cabinCapacity}
                  value={numGuests || ""}
                  onChange={(value) => {
                    setValue("numGuests", value);
                  }}
                  setNumGuests={(id) => setNumGuests(id)}
                  ref={
                    register("numGuests", {
                      required: "This field is required!",
                    }).ref
                  }
                />
              ) : (
                <Spinner />
              )}
            </FormRow>

            <FormRow label="Observations?">
              <Textarea
                {...register("observations", {
                  required: "This field is required",
                })}
              />
            </FormRow>

            <FormRow>
              <Heading as="h2">Has Breakfast?</Heading>

              <Controller
                control={control}
                name="hasBreakfast"
                render={({ field }) => (
                  <Checkbox
                    id="booking-breakfast"
                    checked={hasBreakfast}
                    onChange={(e) => {
                      setHasBreakfast(e.target.checked);
                      field.onChange(e.target.checked);
                    }}
                  />
                )}
              />
            </FormRow>

            <FormRow>
              <Heading as="h2">Has Paid?</Heading>

              <Controller
                control={control}
                name="hasPaid"
                render={({ field }) => (
                  <Checkbox
                    id="has-paid"
                    checked={hasPaid}
                    onChange={(e) => {
                      setHasPaid(e.target.checked);
                      field.onChange(e.target.checked);
                    }}
                  />
                )}
              />
            </FormRow>

            <Box>
              <Heading as="h5">Price Breakdown: </Heading>
              <div>
                <p>
                  Cabin Price:{" "}
                  {isLoading4 || !cabinPrice
                    ? "Loading..."
                    : formatCurrency(
                        cabinPrice.regularPrice - (cabinPrice.discount ?? 0)
                      )}{" "}
                  for{" "}
                  {numNights === 1
                    ? `${numNights} night`
                    : `${numNights} nights`}{" "}
                  {cabinPrice?.discount
                    ? `(${formatCurrency(cabinPrice.discount)} discount)`
                    : ""}
                </p>
                <p>
                  {hasBreakfast ? (
                    <>
                      Breakfast Price:{" "}
                      {isLoading4 || formatCurrency(breakfastPrice * numGuests)}{" "}
                      for {numGuests} guests
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <Heading as="h3">
                Total Price: {isLoading4 || formatCurrency(totalPrice)}{" "}
              </Heading>

              <Button type="submit">Create Booking</Button>
            </Box>
          </>
        ) : (
          ""
        )}
      </Form>
    </>
  );
}

// Make the form
/* Libraries to use 
        useForm, datepicker

        data/hooks to use:
        guests
        cabins
        */
/* 
        - use the Form Component
            - Inside of Form ask:
            
           
            
            - check if going to check-in today
            - check if client already paid today
            
            - total price
        - When submitting add data to bookings database
        */

// - Who's guest (pre-filled based on database)

// - What Cabin?

// get cabin id
