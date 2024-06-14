import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import HistoryModel from "../../../Models/HistoryModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Link} from "react-router-dom";
import {Pagination} from "../../Utils/Pagination";

export const HistoryPage = () => {
    const {authState} = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [error, setError] = useState('');
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail?userEmail=${authState.idToken?.claims.email}&page=${currentPage - 1}&size=5`;
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                const responseJson = await response.json();
                const responseData = responseJson._embedded.histories;
                setHistories(responseData);
                setTotalPages(responseJson.page.totalPages);
            }
            setIsLoadingHistory(false);
        }

        fetchUserHistory().catch((e: any) => {
            setError(e.message);
            setIsLoadingHistory(false);
        });
    }, [currentPage, authState]);


    if (isLoadingHistory) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className={'alert alert-danger'}>{error}</div>;
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={'mt-2'}>
            {histories.length > 0 ?
                <>
                    <h5>
                        Recent history:
                    </h5>
                    {histories.map((history, id) => (
                        <div key={history.id}>
                            <div className={'card mt-3 shadow p-3 mb-3 bg-body rounded'}>
                                <div className={'row g-0'}>
                                    <div className={'col-md-2'}>
                                        <div className={'d-none d-lg-block'}>
                                            {history.img ?
                                                <img src={history.img} width={'123'} height={'196'} alt={'Book'}/> :
                                                <img src={require('./../../../Images/BooksImages/default.png')}
                                                     width={'123'} height={'196'} alt={'Book'}/>
                                            }
                                        </div>
                                        <div className={'d-lg-none d-flex justify-content-center align-items-center'}>
                                            {history.img ?
                                                <img src={history.img} width={'123'} height={'196'} alt={'Book'}/> :
                                                <img src={require('./../../../Images/BooksImages/default.png')}
                                                     width={'123'} height={'196'} alt={'Book'}/>
                                            }
                                        </div>
                                    </div>
                                    <div className={'col'}>
                                        <div className={'card-body'}>
                                            <h5 className={'card-title'}>{history.author}</h5>
                                            <h4 className={'card-text'}>{history.title}</h4>
                                            <p className={'card-text'}>
                                                {history.description}
                                            </p>
                                            <hr/>
                                            <p className={'card-text'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-bag-check"
                                                     viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                                    <path
                                                        d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                                </svg>
                                                &nbsp;
                                                Checked out on {history.checkoutDate}
                                            </p>
                                            <p className={'card-text'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-collection"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5z"/>
                                                </svg>
                                                &nbsp;
                                                Returned on {history.returnedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ))}
                </> :
                <>
                    <h3 className={'mt-3'}>Currently no history:</h3>
                    <Link className={'btn btn-primary'} to={'search'}>Search for a new book</Link>
                </>
            }

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}