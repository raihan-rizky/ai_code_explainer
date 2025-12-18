import PropTypes from "prop-types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SectionSkeleton = ({ className, height = "400px" }) => {
  return (
    <SkeletonTheme baseColor="#1b3224" highlightColor="#254632">
      <div className={`w-full max-w-7xl mx-auto px-4 py-20 ${className}`}>
        <div className="flex flex-col gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center gap-4 mx-auto w-full max-w-2xl">
            <Skeleton height={40} width="60%" borderRadius="0.5rem" />
            <Skeleton height={20} width="80%" borderRadius="0.25rem" />
          </div>

          {/* Body Skeleton - approximates a grid or content area */}
          <Skeleton
            height={height}
            className="w-full rounded-2xl"
            borderRadius="1rem"
          />
        </div>
      </div>
    </SkeletonTheme>
  );
};

SectionSkeleton.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
};

export default SectionSkeleton;
