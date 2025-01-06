import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import { useState } from "react";
import Hamburger from "hamburger-react";

const StyledAppLayout = styled.div`
  display: grid;
  /* grid-template-columns: 26rem 1fr; */
  grid-template-columns: ${({ $isOpen }) => ($isOpen ? "28rem 1fr" : "1fr")};
  grid-template-rows: auto 1fr;
  height: 100vh;

  /* Make the layout responsive */
  /* @media (max-width: 768px) {
    grid-template-columns: 1fr; } */
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;



export default function AppLayout() {
  const [isOpen, setOpen] = useState(false);
  return (
    <StyledAppLayout $isOpen={isOpen}>
      <Header>
        <Hamburger toggle={setOpen} toggled={isOpen} />
      </Header>
      {isOpen ? (
          <Sidebar />
      ) : (
        ""
      )}
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}
