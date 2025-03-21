import Form from 'next/form'
import SearchFormReset from '../SearchFormReset';
import { Search as SearchIcon  } from 'lucide-react'

const Search = ({query}: {query?: string}) => {

  return (
    <Form id='search' action="/" scroll={false} 
      className='flex flex-row items-center justify-between w-[25rem] border-1 border-neutral-300 pl-5 pr-1 py-1 rounded-full shadow-2xs' >
        <input
            type="text"
            name='query'
            defaultValue={query}
            placeholder='Поиск'
            className='focus:outline-none'/>

        <div className='flex flex-row gap-1'>
           {query && (
            <SearchFormReset />
           )}

            <button type='submit' className='form-button'>
              <SearchIcon className='size-5'/>
            </button>
        </div>
    </Form>
  )
}

export default Search