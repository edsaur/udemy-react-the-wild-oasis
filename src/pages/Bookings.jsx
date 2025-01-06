import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from '../features/bookings/BookingTable';
import BookingTableOperations from '../features/bookings/BookingTableOperations';
import Button from "../ui/Button";
import { Link } from "react-router-dom";
function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <Button $size="medium" $variation='primary' as={Link} to='/bookings/new'>Add New Booking</Button>
        <BookingTableOperations />
      </Row>

      <Row>
        <BookingTable />
      </Row>
    </>
  );
}

export default Bookings;
