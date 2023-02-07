import { Skeleton } from "@chakra-ui/react";
import React from "react";

type Props = {
  count: number;
  height: string;
  width?: string;
};

function SkeletonLoader({ count, height, width }: Props) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {width ? (
            <Skeleton
              height={height}
              width={{ base: "full", md: width }}
              borderRadius={4}
            />
          ) : (
            <Skeleton
              height={height}
              width={{ base: "full" }}
              borderRadius={4}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default SkeletonLoader;
