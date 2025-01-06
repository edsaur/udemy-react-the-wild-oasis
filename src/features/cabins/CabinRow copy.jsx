import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import useDeleteCabin from "./useDeleteCabin";
import CreateCabinForm from "./CreateCabinForm";
import { HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { HiPencil } from "react-icons/hi";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

export default function CabinRow({ cabin, onClose }) {
  const { isLoading: isDeleting, mutate: deletingCabin } = useDeleteCabin();
  const {isLoading: isDuplicating, mutate: duplicateCabin} = useCreateCabin();

  const {
    id: cabinId,
    name,
    capacity: maxCapacity,
    regularPrice: price,
    image: cabinImage,
    discount,
    description
  } = cabin;

  function handleDuplication(){
    duplicateCabin({
      name: `Copy of ${name}`,
      capacity: maxCapacity,
      regularPrice: price,
      discount,
      description,
      image: cabinImage,
    });
  }

  return (
      <Table.Row>
        <Img src={cabinImage} alt={`Cabin ${name} img`} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(price)}</Price>
        {discount ? <Discount>{formatCurrency(discount)}</Discount> : <span>&mdash;</span> }
        <div>

          <Modal>
            <Modal.Open opens={"edit"}>
              <button disabled={isDeleting}> <HiPencil /> </button>
            </Modal.Open>
            <Modal.Window name={"edit"}>
             <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>
          </Modal>


          <Modal>
            <Modal.Open opens={"delete"}>
              <button disabled={isDeleting}> <HiTrash /> </button>
            </Modal.Open>

            <Modal.Window name={"delete"}>
                <ConfirmDelete resourceName={name} onConfirm={() => deletingCabin({cabinImage, cabinId})} disabled={isDeleting}/>
            </Modal.Window>
          </Modal>

          <Menus.Menu>
            <Menus.Toggle id={cabinId}/>
            <Menus.List id={cabinId}>
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplication}>Duplicate</Menus.Button>
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              <Menus.Button icon={<HiTrash /> }>Delete</Menus.Button>
            </Menus.List>
          </Menus.Menu>
        </div>
      </Table.Row>
  );
}
