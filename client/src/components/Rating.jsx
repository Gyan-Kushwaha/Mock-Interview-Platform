import React from "react";
import { Star, StarHalf } from "lucide-react";

const Rating = ({ experienceLevel, rating }) => {
  // This new line ensures the rating is always a safe number between 0 and 5.
  const sanitizedRating = Math.max(0, Math.min(5, rating || 0));

  const getColor = () => {
    switch (experienceLevel?.toLowerCase()) {
      case "fresher":
        return "text-blue-500";
      case "senior":
      case "mid-level":
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  // All calculations now use the safe, sanitized rating value.
  const filledStars = Math.floor(sanitizedRating);
  const hasHalfStar = sanitizedRating % 1 !== 0;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(filledStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`w-6 h-6 ${getColor()}`}
          fill="currentColor"
        />
      ))}
      {hasHalfStar && <StarHalf className={`w-6 h-6 ${getColor()}`} />}
      {/* Ensure emptyStars is never negative before creating the array */}
      {emptyStars > 0 &&
        [...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-6 h-6 text-gray-300" />
        ))}
    </div>
  );
};

export default Rating;