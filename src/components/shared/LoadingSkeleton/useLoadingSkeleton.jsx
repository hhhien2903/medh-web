import { Skeleton } from 'antd';
import React, { useState } from 'react';

const useLoadingSkeleton = () => {
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  return {
    setIsLoadingSkeleton,
    isLoadingSkeleton,
    renderLoadingSkeleton: (
      <>
        <Skeleton active loading={isLoadingSkeleton} />
      </>
    ),
  };
};

export default useLoadingSkeleton;
