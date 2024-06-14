import {useEffect, useState} from "react";
import {useOktaAuth} from "@okta/okta-react";
import MessageModel from "../../../Models/MessageModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import * as http from "node:http";
import {Pagination} from "../../Utils/Pagination";

export const Messages = () => {

    const {authState} = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [error, setError] = useState<string>('');

    const [messagesPerPage, setMessagesPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findMessagesByUserEmail?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authState.accessToken?.accessToken
                    }
                }
                const messagesResponse = await fetch(url, options);
                if (!messagesResponse.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
                setIsLoadingMessages(false);
            }
        }
        fetchUserMessages().catch((e: any) => {
            setError(e.message);
            setIsLoadingMessages(false);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage]);


    if (isLoadingMessages) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div className={'container m-5'}>
            <p>{error}</p>
        </div>
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className={'mt-2'}>
            {messages.length > 0 ?
                <>
                    <h5>Current Q/A: </h5>
                    {
                        messages.map(message => (
                            <div key={message.id}>
                                <div className={'card mt-2 shadow p-3 rounded'}>
                                    <h5>Case #{message.id}: {message.title}</h5>
                                    <h6>{message.userEmail}</h6>
                                    <p>{message.question}</p>
                                    <hr/>
                                    <div>
                                        <h5>Response:</h5>
                                        {message.response && message.adminEmail ? <>
                                            <>
                                                <h6>{message.adminEmail} (librarian)</h6>
                                                <p>{message.response}</p>
                                            </>
                                        </> : <p>⌛ Waiting for a librarian's response</p>}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </> : <>
                    <h5>Questions you have for our librarians will be shown here.</h5>
                </>
            }

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}