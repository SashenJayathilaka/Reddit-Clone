import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { BsCalendar4Week } from "react-icons/bs";
import { FaHotjar } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { MdVerified } from "react-icons/md";

type Props = {};

function ProfileTopBar({}: Props) {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const hoverBg = useColorModeValue("gray.200", "#2A4365");

  return (
    <Flex
      justify="start"
      align="center"
      bg={bg}
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
      p={2}
      mb={4}
    >
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        alignItems="center"
        gap={2}
        borderRadius={4}
        _hover={{ bg: hoverBg }}
        display={{ base: "none", md: "flex" }}
      >
        <Icon as={MdVerified} fontSize={20} />
        <Text>New</Text>
      </Flex>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        alignItems="center"
        gap={2}
        borderRadius={4}
        _hover={{ bg: hoverBg }}
        display={{ base: "none", md: "flex" }}
      >
        <Icon as={FaHotjar} fontSize={20} />
        <Text>Hot</Text>
      </Flex>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        alignItems="center"
        gap={2}
        borderRadius={4}
        _hover={{ bg: hoverBg }}
        bg={hoverBg}
      >
        <Icon as={GoGraph} fontSize={20} color="blue.500" />
        <Text color="blue.500">New</Text>
      </Flex>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        alignItems="center"
        gap={2}
        borderRadius={4}
        _hover={{ bg: hoverBg }}
        bg={hoverBg}
      >
        <Icon as={BsCalendar4Week} fontSize={20} color="blue.500" />
        <Text color="blue.500">ThisWeek</Text>
      </Flex>
    </Flex>
  );
}

export default ProfileTopBar;
