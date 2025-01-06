import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../ui/Spinner";
const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; 
  position: fixed; 
  top: 0;
  left: 0;
`;

function Login() {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isAuthenticated) navigate("/dashboard");
    },
    [isAuthenticated, navigate]
  );

  if (isLoading)
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );

  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Log-in to your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
