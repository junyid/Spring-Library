import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import MessageModel from "../../../Models/MessageModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Pagination} from "../../Utils/Pagination";
import {AdminMessage} from "./AdminMessage";
import AdminMessageRequest from "../../../Models/AdminMessageRequest";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [error, setError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);

    // pagination
    const [messagesPerPage, setMessagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const [btnSubmit, setBtnSubmit] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const response = await fetch(`http://localhost:8080/api/messages/search/findMessagesByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const messagesResponseJson = await response.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        };
        fetchMessages().catch((error) => {
            setIsLoadingMessages(false);
            setError(error);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);

    if (isLoadingMessages) {
        return <SpinnerLoading/>;
    }

    if (error) {
        return <div>Something went wrong: {error}</div>;
    }

    async function submitResponse(id: number, response: string) {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        if (authState?.isAuthenticated && id !== null && response !== '') {
            const messasgeAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authState.accessToken?.accessToken
                },
                body: JSON.stringify(messasgeAdminRequestModel)
            }

            const messageAdminRequestModelResponse = await fetch(url, options);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Failed to send response');
            }
            setBtnSubmit(!btnSubmit);
        }
    }


    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={'mt-3'}>
            {messages.length > 0 ? <>
                    <h5>Pending Messages:</h5>
                    {messages.map((message: MessageModel) => (
                            <AdminMessage message={message} key={message.id} submitResponse={submitResponse}></AdminMessage>
                        )
                    )}
                </> :
                <>
                    <h5>No pending messages.</h5>
                </>}
            {totalPages > 1 ? <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/> : ''}
        </div>

    );
};