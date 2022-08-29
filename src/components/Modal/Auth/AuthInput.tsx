import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { authModelState } from "../../../atoms/authModalAtom";
import Login from "./Login";
import SignUp from "./SignUp";

type AuthInputProps = {};

const AuthInput: React.FC<AuthInputProps> = () => {
  const modelState = useRecoilValue(authModelState);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {modelState.view === "login" && <Login />}
      {modelState.view === "signup" && <SignUp />}
    </Flex>
  );
};
export default AuthInput;
