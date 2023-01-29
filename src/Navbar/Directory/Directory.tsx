import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

import useDirectory from "../../hooks/useDirectory";
import Communities from "./Communities";

const Directory: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();
  const iconColor = useColorModeValue("black", "white");

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <>
                {directoryState.selectedMenuItem.iconColor === "black" ? (
                  <Icon
                    fontSize={24}
                    mr={{ base: 1, md: 2 }}
                    as={directoryState.selectedMenuItem.icon}
                    color={iconColor}
                  />
                ) : (
                  <Icon
                    fontSize={24}
                    mr={{ base: 1, md: 2 }}
                    as={directoryState.selectedMenuItem.icon}
                    color={directoryState.selectedMenuItem.iconColor}
                  />
                )}
              </>
            )}

            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
