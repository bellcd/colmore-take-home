import { useEffect } from 'react';

export const saveApikey = apikey => {
  sessionStorage.setItem('API_KEY', apikey);
};

export const retrieveApikey = () => sessionStorage.getItem('API_KEY');

export const useApikey = ({
  setApikey,
  setHasApikey,
  setIsLoading
}) => {
  useEffect(() => {
    const maybeApikey = retrieveApikey();
    if (maybeApikey) {
      setApikey(maybeApikey);
      setHasApikey(true);
    }
    setIsLoading(false)
  }, []);
}