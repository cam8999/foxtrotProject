
const SearchBar = () => ( 
    <form action="/" method="get" >
       <label htmlFor="header-search">
           <span className="visually-hidden" overflow = "hidden"></span>
       </label>
       
       
       <input
           type="radio"
           id="loc"
           value = "Location"
           name="qtype"             
          
       />
       <label for="loc">Location</label>

       <input
           type="radio"
           id="author"
           value = "Author"
           name="qtype"             
          
       />
       <label for="author">Author</label>

       {/*TODO: more elegant way, add extra radio buttons*/}
       <input
           type="radio"
           id="title"
           value = "Title"
           name="qtype"             
          
       />
       
       <label for="title">Title</label>

       <input
           type="radio"
           id="tags"
           value = "Tags"
           name="qtype"             
          
       />
       
       <label for="title">Tags</label>

       <br />
       <input
           type="text"
           id="header-search"
           placeholder="Search posts"
           name="s"             
          
       />

       <button type="submit" value="Submit" >Search</button>
       {/*TODO: make it work*/}
       <button type="reset" type="submit" value="Reset">Reset</button>
   </form>
);



export default SearchBar;
