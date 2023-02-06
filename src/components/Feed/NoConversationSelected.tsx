import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoLogoReddit } from "react-icons/io5";

type Props = {};

function NoConversationSelected({}: Props) {
  return (
    <Flex height="100%" justify="center" align="center">
      <Stack spacing={10} align="center">
        <Text fontSize={40}>Select a Conversation</Text>
        <IoLogoReddit fontSize={90} />
      </Stack>
    </Flex>
  );
}

export default NoConversationSelected;
