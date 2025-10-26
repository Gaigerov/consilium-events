export const trackSearch = (searchTerm: string, resultsCount: number) => {
  console.log('Search:', { searchTerm, resultsCount });
};

export const trackFilter = (filterType: string, filterValue: string, resultsCount: number) => {
  console.log('Filter:', { filterType, filterValue, resultsCount });
};
