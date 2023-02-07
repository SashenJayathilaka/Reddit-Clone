import { Flex, Stack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { firestore } from "../../firebase/clientApp";
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
  user: User;
};

function Messages({ conversationId, user }: Props) {
  const [messageDetails, setMessageDetails] = useState<MessageBody[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firestore, `communities/${conversationId}/conversation`),
          orderBy("sendedAt", "desc")
        ),
        (snapshot) => {
          const chat = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessageDetails(chat);
        }
      ),
    [firestore, conversationId]
  );

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
