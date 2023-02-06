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
        <>
          {width ? (
            <Skeleton key={i} height={height} width={width} borderRadius={4} />
          ) : (
            <Skeleton
              key={i}
              height={height}
              width={{ base: "full" }}
              borderRadius={4}
            />
          )}
        </>
      ))}
    </>
  );
}

export default SkeletonLoader;
