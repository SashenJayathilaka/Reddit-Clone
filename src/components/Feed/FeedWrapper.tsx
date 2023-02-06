import { Flex } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";

import MessageInput from "./MessageInput";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import NoConversationSelected from "./NoConversationSelected";

type Props = {
  setLastSeenMessage: any;
};

function FeedWrapper({ setLastSeenMessage }: Props) {
  const router = useRouter();
  const {
    query: { userInCommunities, member },
  } = router;
  const [timestamp, setTimestamp] = useState<Timestamp>();

  return (
    <Flex
      display={{ base: userInCommunities ? "flex" : "none", md: "flex" }}
      direction="column"
      width="100%"
    >
      {userInCommunities ? (
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <MessagesHeader
              conversationId={userInCommunities.toString()}
              member={member?.toString()}
            />
            <Messages
              conversationId={userInCommunities.toString()}
              timestamp={timestamp as Timestamp}
              setLastSeenMessage={setLastSeenMessage}
            />
          </Flex>
          <MessageInput
            conversationId={userInCommunities.toString()}
            setTimestamp={setTimestamp}
          />
        </>
      ) : (
        <NoConversationSelected />
      )}
    </Flex>
  );
}

export default FeedWrapper;
