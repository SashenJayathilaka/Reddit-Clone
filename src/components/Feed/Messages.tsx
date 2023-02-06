import { Flex, Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore } from "../../firebase/clientApp";
import SkeletonLoader from "../common/SkeletonLoader";
import MessageItems from "./MessageItems";

export interface MessageBody {
  id: string;
  communityId: string;
  senderId: string;
  senderImageUrl: string;
  senderName: string;
  senderEmail: any;
  messageBody: string;
  sendedAt: Timestamp;
}

type Props = {
  conversationId: string;
  timestamp: Timestamp;
  setLastSeenMessage: any;
};

function Messages({ conversationId, timestamp, setLastSeenMessage }: Props) {
  const [user] = useAuthState(auth);
  const [messageDetails, setMessageDetails] = useState<MessageBody[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = async (conversationId: string) => {
    if (!conversationId && !user) return;

    try {
      const chatUserQuery = query(
        collection(firestore, `communities/${conversationId}/conversation`),
        orderBy("sendedAt", "desc")
      );
      const chatUserDoc = await getDocs(chatUserQuery);

      const chat = chatUserDoc.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessageDetails(chat);
      setLastSeenMessage(chat);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchMessages(conversationId);
  }, [conversationId, firestore, timestamp]);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        setLoading(true);
      }
    }, 2000);
  });

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading ? (
        <Flex direction="column-reverse" overflow="scroll" height="100%">
          {messageDetails.map((message) => (
            <MessageItems
              key={message.id}
              message={message}
              userId={user?.uid.toString() as string}
            />
          ))}
        </Flex>
      ) : (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={7} height="60px" />
        </Stack>
      )}
    </Flex>
  );
}

export default Messages;
