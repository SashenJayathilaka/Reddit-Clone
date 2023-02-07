import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

import MessageInput from "./MessageInput";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import NoConversationSelected from "./NoConversationSelected";

type Props = {
  user: User;
  userInCommunities: string;
  member: any;
};

function FeedWrapper({ user, userInCommunities, member }: Props) {
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
              user={user}
            />
          </Flex>
          <MessageInput
            conversationId={userInCommunities.toString()}
            user={user}
          />
        </>
      ) : (
        <NoConversationSelected user={user} />
      )}
    </Flex>
  );
}

export default FeedWrapper;
