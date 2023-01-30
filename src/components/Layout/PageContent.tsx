import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const router = useRouter();
  const uid = router.query;

  return (
    <Flex justify="center" p="16px 0px">
      <Flex
        width="95%"
        justify="center"
        maxWidth={uid.uid ? "1160px" : "860px"}
      >
        {/* Left */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>

        {/* Right */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
