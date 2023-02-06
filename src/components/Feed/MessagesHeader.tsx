import { Stack, Button, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { ImUsers } from "react-icons/im";

type Props = {
  conversationId: string;
  member: any;
};

function MessagesHeader({ conversationId, member }: Props) {
  const router = useRouter();

  const bg = useColorModeValue("gray.300", "whiteAlpha.200");

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={2}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor={bg}
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.replace("?conversationId", "/chat", {
            shallow: true,
          })
        }
      >
        Back
      </Button>
      {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}

      {conversationId && (
        <Stack direction="column" spacing="0.5">
          <Text fontWeight={600} fontSize={16}>
            <Icon as={ImUsers} mr={2} />
            Chat Feedback
          </Text>
          <Text fontSize={14}>{member} Members</Text>
        </Stack>
      )}
    </Stack>
  );
}

export default MessagesHeader;
