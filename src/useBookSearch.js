import { useEffect, useState } from 'react'
import axios from 'axios'

const useBookSearch = (query, pageNumber) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setError(false);

        let cancel;

        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber }, 
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then( res => {
            console.log(res.data)
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.docs.map(b => { return {title: b.title, author: b.author_name, year: b.first_publish_year} })])];
            })
            setHasMore(res.data.docs.length>0)
            setLoading(false)
            console.log(res.data);
        }).catch(e => {
            console.log(e);
            if (axios.isCancel(e)) return;
            setError(true)
        })

        return () => cancel();

    }, [query, pageNumber]);

    return {loading, error, books, hasMore};

}

export default useBookSearch;