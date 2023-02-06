import {
  Box,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { motion } from "framer-motion";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { ImUsers } from "react-icons/im";

import { Community } from "../../atoms/CommunitiesAtom";
import { firestore } from "../../firebase/clientApp";
import { MessageBody } from "../Feed/Messages";

type Props = {
  user: Community;
};

function ConversationItem({ user }: Props) {
  const [userCommunities, SetUserCommunities] = useState<Community>();
  const [decryptMessage, setDecryptedMessage] = useState("");
  const [lastSeenMessages, setLastSeenMessages] = useState<MessageBody[]>([]);
  const router = useRouter();
  const {
    query: { userInCommunities },
  } = router;

  const bg = useColorModeValue("gray.300", "whiteAlpha.200");
  const textBg = useColorModeValue("gray.500", "whiteAlpha.700");

  const getChatUser = async (userId: any) => {
    if (userId) {
      try {
        const chatUserQuery = query(collection(firestore, `communities`));
        const chatUserDoc = await getDocs(chatUserQuery);
        const chat = chatUserDoc.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filterCommunities = chat.find((doc) => doc.id === userId);
        SetUserCommunities(filterCommunities);
      } catch (error: any) {
        console.log(error.message);
      }
    } else return;
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            firestore,
            `communities/${userCommunities?.id}/conversation`
          ),
          orderBy("sendedAt", "desc")
        ),
        (snapshot) => {
          const chat = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLastSeenMessages(chat);
        }
      ),
    [firestore, userCommunities?.id]
  );

  useEffect(() => {
    getChatUser(user.id);
  }, [user, firestore]);

  useEffect(() => {
    const decryptArr = [];
    try {
      for (let index = 0; index < lastSeenMessages.length; index++) {
        const pushArr = lastSeenMessages[index].messageBody;

        const bytes = CryptoJS.AES.decrypt(
          pushArr.toString(),
          process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
        );
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        decryptArr.push(data);
      }
      setDecryptedMessage(decryptArr[0]);
    } catch (error: any) {
      console.log(error.message);
    }
  }, [userCommunities?.id, lastSeenMessages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Stack
        direction="row"
        align="center"
        justify="space-between"
        p={4}
        cursor="pointer"
        borderRadius={4}
        bg={
          userInCommunities === userCommunities?.id ? "whiteAlpha.200" : "none"
        }
        _hover={{ bg: bg }}
        onClick={() =>
          router.push({
            query: {
              userInCommunities: userCommunities?.id,
              member: userCommunities?.numberOfMembers,
            },
          })
        }
        position="relative"
      >
        {userCommunities?.imageURL ? (
          <Flex position="relative">
            <Image
              borderRadius="full"
              boxSize="38px"
              src={userCommunities?.imageURL}
              mr={2}
            />
            <Icon as={BsFillChatDotsFill} position="absolute" top={6} />
          </Flex>
        ) : (
          <Flex position="relative">
            <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
            <Icon as={BsFillChatDotsFill} position="absolute" top={6} />
          </Flex>
        )}

        <Flex justify="space-between" width="80%" height="100%">
          <Flex direction="column" width="70%" height="100%">
            <Text
              fontWeight={600}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              r/{userCommunities?.id}
            </Text>

            <Box width="140%" display="flex" alignItems="center" gap={2}>
              <Icon as={ImUsers} />
              <Text
                color={textBg}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontSize={15}
              >
                {decryptMessage ? decryptMessage : "Select a Conversation..."}
              </Text>
            </Box>
          </Flex>
          <Text
            color={textBg}
            position="absolute"
            right={4}
            textAlign="right"
            fontSize={12}
          >
            {moment(
              new Date((userCommunities?.createdAt?.seconds as any) * 1000)
            ).fromNow()}
          </Text>
        </Flex>
      </Stack>
    </motion.div>
  );
}

export default ConversationItem;
