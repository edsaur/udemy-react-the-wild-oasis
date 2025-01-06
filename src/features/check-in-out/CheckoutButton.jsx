import Button from "../../ui/Button";
import { useCheckOut } from "./useCheckOut";

function CheckoutButton({ bookingId }) {
  const {isLoading, mutate: checkOut} = useCheckOut();

  function handleCheckOut() {
    if(!bookingId) return;
    checkOut(bookingId);
  }

  return (
    <Button $variation="danger" $size="small" onClick={handleCheckOut} disabled={isLoading}>
      Check out
    </Button>
  );
}

export default CheckoutButton;
