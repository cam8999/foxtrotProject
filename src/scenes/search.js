import * as React from 'react';
import { Searchbar } from 'react-native-paper';


  const SearchB = (he) => {

    
    const [myRef, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    return (
      <Searchbar
       
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={myRef}
      />
    );
  };
  
  export default SearchB;