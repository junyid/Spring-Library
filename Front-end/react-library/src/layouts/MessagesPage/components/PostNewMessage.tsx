import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import MessageModel from "../../../Models/MessageModel";

export const PostNewMessage = () => {
    const {authState} = useOktaAuth();
    const [title, setTitle] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    async function submitNewMessage() {
        const url = 'http://localhost:8080/api/messages/secure/add/message';
        if (authState?.isAuthenticated && title && question) {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authState.accessToken?.accessToken
                },
                body: JSON.stringify(messageRequestModel)
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (<div className={'card mt-3'}>
        <div className={'card-header'}>
            📢 Ask our librarians!
        </div>
        <div className={'card-body'}>
            <form method={'POST'}>
                {displayWarning && <div className={'alert alert-danger'} role={'alert'}>
                    ❌ Please fill in all fields
                </div>}
                {displaySuccess && <div className={'alert alert-success'} role={'alert'}>
                    🎉 Message sent successfully
                </div>}
                <div className={'mb-3'}>
                    <label className={'form-label'}>
                        Title
                    </label>
                    <input type={'text'} className={'form-control'} id={'exampleFormControlInput1'}
                           placeholder={'Title'}
                           onChange={e => setTitle(e.target.value)} value={title}/>
                </div>

                <div className={'mb-3'}>
                    <label className={'form-label'}>
                        Question
                    </label>
                    <textarea className={'form-control'} id={'exampleFormControlTextarea1'} rows={3}
                              onChange={e => setQuestion(e.target.value)} value={question}/>
                </div>

                <div>
                    <button type={'button'} className={'btn btn-primary mt-3'} onClick={submitNewMessage}>Submit
                    </button>
                </div>
            </form>
        </div>
    </div>);
}