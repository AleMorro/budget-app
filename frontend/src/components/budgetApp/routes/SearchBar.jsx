import React from 'react'
// import stylesheet
import '../styles/SearchBar.css'

function SearchBar() {
   // function to handle the input on the searchbar
   // it filter for every row in the table
   const handleInput = (event) => {
      const value = event.target.value.toLowerCase();
      const table = document.getElementById('myTable');
      const rows = table.getElementsByTagName('tr');

      Array.from(rows).forEach((row) => {
         const text = row.textContent || row.innerText;
         row.style.display = text.toLowerCase().includes(value) ? '' : 'none';
      });
   }

   return (
      <div className="search-bar">
         <form
            className='search-form d-flex align-items-center'
            method='#POST'
            action="#"
         >
            <input 
               type="text"
               name='query'
               placeholder='Search'
               title='Enter search keyword'
               onKeyUp={handleInput}
            />
            <i className='bi bi-search'></i>
         </form>
      </div>
   );
}

export default SearchBar