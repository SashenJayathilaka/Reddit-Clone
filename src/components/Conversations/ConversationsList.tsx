import { Box } from "@chakra-ui/react";

import { Community } from "../../atoms/CommunitiesAtom";
import ConversationItem from "./ConversationItem";

type Props = {
  chatUsers: Community[];
};

function ConversationsList({ chatUsers }: Props) {
  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      position="relative"
      height="100%"
      overflow="scroll"
    >
      {chatUsers.map((user) => (
        <ConversationItem key={user.id} user={user} />
      ))}
    </Box>
  );
}

export default ConversationsList;
