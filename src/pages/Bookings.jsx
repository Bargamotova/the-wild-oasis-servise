import Row from "../ui/Row";
import Heading from "../ui/Heading";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import BookingTable from "../features/bookings/BookingTable";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>

        <BookingTableOperations />
      </Row>
      <BookingTable />
    </>
  );
}

export default Bookings;
