import React from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const bg = useColorModeValue("gray.100", "whiteAlpha.100");
  const iconColor = useColorModeValue("gray.300", "white");
  const focusedInputBg = useColorModeValue("white", "#171923");
  const searchBorder = useColorModeValue("gray.200", "#4A5568");

  return (
    <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color={iconColor} mb={1} />
        </InputLeftElement>
        <Input
          type="tel"
          placeholder="Search Reddit"
          fontSize="10pt"
          bg={bg}
          _placeholder={{ colors: "gray.500" }}
          _hover={{
            bg: focusedInputBg,
            border: "1px solid",
            borderColor: searchBorder,
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: searchBorder,
            bg: focusedInputBg,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
