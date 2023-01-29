import { Flex, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { defaultMenuItem } from "../atoms/directoryMenuAtom";
import { auth } from "../firebase/clientApp";
import useDirectory from "../hooks/useDirectory";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white", "blackAlpha.800");

  return (
    <Flex
      bg={bg}
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src={
            colorMode === "light"
              ? "/images/redditText.svg"
              : "/images/Reddit-Word-Dark.svg"
          }
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
