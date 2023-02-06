import { Box } from "@chakra-ui/react";

import { Community } from "../../atoms/CommunitiesAtom";
import { MessageBody } from "../Feed/Messages";
import ConversationItem from "./ConversationItem";

type Props = {
  chatUsers: Community[];
  lastSeenMessage: MessageBody[];
};

function ConversationsList({ chatUsers, lastSeenMessage }: Props) {
  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      position="relative"
      height="100%"
      overflow="hidden"
    >
      {chatUsers.map((user) => (
        <ConversationItem
          key={user.id}
          user={user}
          lastSeenMessage={lastSeenMessage}
        />
      ))}
    </Box>
  );
}

export default ConversationsList;
