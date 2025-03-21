"use client"
import { X } from "lucide-react";
import Link from "next/link";

const SearchFormReset = () => {

    const reset = () => {
        const form = document.getElementById('search') as HTMLFormElement;
        if (form) { form.reset(); }
      }

  return (
    <button type='reset' onClick={reset}
        className="form-button">
        <Link href='/' >
         <X className="size-5"/>
        </Link>
    </button>
  )
}

export default SearchFormReset