import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

import { Post } from "../../atoms/PostAtom";

// const secretPass = process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS;

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<Element, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);
  const [decryptedData, setDecryptedData] = useState({
    title: "",
    body: "",
    creatorDisplayName: "",
    imageURL: "",
  });
  const singlePostPage = !onSelectPost;
  const router = useRouter();

  // Thames
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const singlePageBorderColor = useColorModeValue("white", "#2D3748");
  const voteLineBorderColor = useColorModeValue("gray.100", "#171923");
  const IconHoverBg = useColorModeValue("gray.200", "#2A4365");
  const IconBg = useColorModeValue("none", "#A0AEC0");
  const voteIconBg = useColorModeValue("gray.400", "#CBD5E0");

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error("Failed to Delete Post");
      }

      console.log("Post was Successfully Deleted");

      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    const arr = [];
    const arrName: string[] = [];

    if (post.body) {
      arr.push(post.title, post.body, post.creatorDisplayName, post.imageURL);
      arrName.push("title", "body", "creatorDisplayName", "imageURL");
    } else {
      arr.push(post.title, post.creatorDisplayName, post.imageURL);
      arrName.push("title", "creatorDisplayName", "imageURL");
    }

    try {
      for (let index = 0; index < arr.length; index++) {
        if (arr[index]) {
          const bytes = CryptoJS.AES.decrypt(
            arr[index]!,
            process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
          );
          const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          setDecryptedData((prev) => ({
            ...prev,
            [arrName[index]]: data,
          }));
        } else return;
      }
    } catch (error) {
      console.log(error);
    }
  }, [post]);

  return (
    <Flex
      border="1px solid"
      bg={bg}
      borderColor={singlePostPage ? singlePageBorderColor : borderColor}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : borderColor }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? "none" : voteLineBorderColor}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : voteIconBg}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, post.communityId)}
          cursor="pointer"
        />
        <Text fontSize="9pt" color={voteIconBg}>
          {post.voteStatus}
        </Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : voteIconBg}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, post.communityId)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
            {/* check */}
            {homePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18px" color="blue.500" />
                )}
                <Link href={`r/${post.communityId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation}
                  >{`r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text>
              Posted by u/{decryptedData.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {decryptedData.title}
          </Text>
          <Text fontSize="10pt">{decryptedData.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={decryptedData.imageURL}
                maxHeight="460px"
                alt="Post Image"
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: IconHoverBg }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} color={IconBg} />
            <Text fontSize="9pt" color={IconBg}>
              {post.numberOfComments}
            </Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: IconHoverBg }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} color={IconBg} />
            <Text fontSize="9pt" color={IconBg}>
              Share
            </Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: IconHoverBg }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} color={IconBg} />
            <Text fontSize="9pt" color={IconBg}>
              Save
            </Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: IconHoverBg }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} color={IconBg} />
                  <Text fontSize="9pt" color={IconBg}>
                    Delete
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
