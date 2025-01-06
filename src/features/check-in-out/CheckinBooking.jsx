import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import Checkbox from "../../ui/Checkbox";
import { useCheckIn } from "./useCheckIn";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useParams } from "react-router-dom";
import { useBooking } from "../bookings/useBooking";

import Spinner from "../../ui/Spinner";
import { formatCurrency } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const [isChecked, setIsChecked] = useState(false);
  const [checkBreakfast, setCheckBreakfast] = useState(false);

  const { id } = useParams();
  const { booking, isLoading: isLoadingBooking } = useBooking(id);
  const { settingData, isLoading: isLoadingSetting } = useSettings();

  const { isLoading: isCheckingIn, mutate: checkingIn } = useCheckIn();

  useEffect(() => setIsChecked(!!booking?.isPaid), [booking]);

  if (isLoadingBooking || isLoadingSetting) return <Spinner />;
  const { breakfastPrice } = settingData;
  const {
    id: bookingId,
    guests: { fullName },
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const withBreakfastPrice =
    numGuests && breakfastPrice ? breakfastPrice * numNights * numGuests : 0;
  const totalWithBreakfast =
    totalPrice + (checkBreakfast ? withBreakfastPrice : 0);

  function handleCheckin() {
    if (!isChecked) return null;
    if (checkBreakfast) {
      checkingIn({
        bookingId,
        obj: {
          hasBreakfast: true,
          extrasPrice: breakfastPrice,
          totalPrice: totalWithBreakfast,
        },
      });
    } else {
      checkingIn({ bookingId, obj: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {(!hasBreakfast || !isChecked) && (
        <Box>
          <Checkbox
            id={`breakfast-checkbox-${bookingId}`}
            checked={checkBreakfast}
            onChange={() => {
              setCheckBreakfast((prev) => !prev);
              setIsChecked(false);
            }}
          >
            {" "}
            Want to add breakfast for {formatCurrency(withBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          id={bookingId}
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
          disabled={isChecked}
        >
          {" "}
          I confirm that {fullName} has paid the total amount of{" "}
          {formatCurrency(totalWithBreakfast)}{" "}
          {!checkBreakfast
            ? ""
            : `(${formatCurrency(totalPrice)} + ${formatCurrency(
                withBreakfastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          $variation="primary"
          disabled={!isChecked || isCheckingIn}
        >
          Check in booking #{bookingId}
        </Button>
        <Button
          $variation="secondary"
          onClick={moveBack}
          disabled={isCheckingIn}
        >
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
