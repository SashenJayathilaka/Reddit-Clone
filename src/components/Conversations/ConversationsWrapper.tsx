import {
  Box,
  Flex,
  Stack,
  useColorModeValue,
  Image,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Community } from "../../atoms/CommunitiesAtom";
import { auth, firestore } from "../../firebase/clientApp";
import SkeletonLoader from "../common/SkeletonLoader";
import { MessageBody } from "../Feed/Messages";
import ConversationsList from "./ConversationsList";

export interface ChatUser {
  apiKey: string;
  appName: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  lastLoginAt: string;
  providerData: any[];
  stsTokenManager: any[];
  uid: string;
  photoURL: string;
  displayName: string;
  updatedAt: Timestamp;
}

type Props = {
  lastSeenMessage: MessageBody[];
};

function ConversationsWrapper({ lastSeenMessage }: Props) {
  const router = useRouter();
  const {
    query: { userInCommunities },
  } = router;
  const [user] = useAuthState(auth);
  const [chatUsers, setChatUser] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const bg = useColorModeValue("whiteAlpha.500", "whiteAlpha.50");

  const getChatUser = async (userId: any) => {
    if (userId) {
      try {
        setLoading(true);

        const chatUserQuery = query(
          collection(firestore, `users/${userId}/communitySnippets`)
        );
        const chatUserDoc = await getDocs(chatUserQuery);

        const chat = chatUserDoc.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChatUser(chat);

        setLoading(false);
      } catch (error: any) {
        console.log(error.message);
      }
    } else return;
  };

  useEffect(() => {
    getChatUser(user?.uid);
  }, [user, firestore]);

  return (
    <Box
      width={{ base: "100%", md: "430px" }}
      bg="whiteAlpha.50"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
      display={{ base: userInCommunities ? "none" : "flex", md: "flex" }}
    >
      {loading ? (
        <SkeletonLoader count={10} height="80px" width="370px" />
      ) : (
        <>
          {chatUsers ? (
            <ConversationsList
              chatUsers={chatUsers}
              lastSeenMessage={lastSeenMessage}
            />
          ) : (
            <Flex justify="center" pt="50px">
              <Stack spacing={5}>
                <Image
                  src="https://drive.google.com/uc?export=download&id=1oS2QPa8ex6ufQvTG3mZ51Gm-LSWSb2SQ"
                  height="200px"
                />
                <Text
                  fontSize="15pt"
                  color="gray.500"
                  fontWeight="bold"
                  textAlign="center"
                >
                  No Communities Yet!
                </Text>
              </Stack>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}

export default ConversationsWrapper;
