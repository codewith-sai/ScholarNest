import Scholarship from "../models/Scholarship.js";

export const getRecommendedScholarships = async (
  user,
  limit = 6
) => {
  const scholarships =
    await Scholarship.find({
      isActive: true,
      deadline: {
        $gte: new Date(),
      },
    })
      .sort({
        featured: -1,
        deadline: 1,
      })
      .limit(50);

  const scored = scholarships.map(
    (scholarship) => {
      let score = 0;

      if (
        user.educationLevel &&
        scholarship.educationLevel.includes(
          user.educationLevel
        )
      ) {
        score += 25;
      }

      if (
        user.category &&
        scholarship.category.includes(
          user.category
        )
      ) {
        score += 20;
      }

      if (
        user.state &&
        scholarship.state.includes(
          user.state
        )
      ) {
        score += 15;
      }

      if (
        user.annualIncome &&
        scholarship.maxFamilyIncome &&
        user.annualIncome <=
          scholarship.maxFamilyIncome
      ) {
        score += 20;
      }

      if (
        user.cgpa &&
        scholarship.minCGPA &&
        user.cgpa >= scholarship.minCGPA
      ) {
        score += 10;
      }

      if (
        user.percentage &&
        scholarship.minPercentage &&
        user.percentage >=
          scholarship.minPercentage
      ) {
        score += 10;
      }

      return {
        scholarship,
        score,
      };
    }
  );

  scored.sort((a, b) => b.score - a.score);

  return scored
    .slice(0, limit)
    .map((item) => item.scholarship);
};