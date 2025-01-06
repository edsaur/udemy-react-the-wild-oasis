import Heading from "../ui/Heading";
import Row from "../ui/Row";

import UpdateUserData from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordData from "../features/authentication/UpdatePasswordForm";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserData />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordData />
      </Row>
    </>
  );
}

export default Account;
