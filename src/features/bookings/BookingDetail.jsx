import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import { useDeleteBooking } from "./useDeleteBooking";
import { useCheckOut } from "../check-in-out/useCheckOut";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const {id} = useParams();
  const {booking, isLoading} = useBooking(id);
  const {mutate: deletingBooking} = useDeleteBooking();
  const {isLoading: isCheckingOut, mutate: checkOutBooking} = useCheckOut();

  console.log(booking);
  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  const navigate = useNavigate();

  function handleDeletion(id) {
    deletingBooking(id);
    navigate('/bookings');
  }

  if(isLoading) return <Spinner/>
  if(!booking) return <Empty resource='bookings'/>
  const {status} = booking;
  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && <Button $variation="primary" onClick={() => navigate(`/checkin/${id}`) }> Check In</Button>}
        {status === "checked-in" && <Button $variation="primary" onClick={() => checkOutBooking(id) } disabled={isCheckingOut}> Check Out</Button>}
        <Button $variation="danger" onClick={() => handleDeletion(id) }> Delete Booking</Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
