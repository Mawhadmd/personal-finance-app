const getDateRanges = () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
// Helper function to calculate date ranges
  return { thisMonthStart, lastMonthStart, lastMonthEnd };
};
export default getDateRanges;
